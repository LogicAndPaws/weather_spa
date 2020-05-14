const WebSocket = require("ws");
const { v4: uuid4, v5: uuid5 } = require('uuid');
let User = require("./utils").User;
let Endpoint = require("./utils").Endpoint;
let Data = require("./utils").Data;
const UUIDNS = "ABCDEFGH";
let db;

const wss = new WebSocket.Server({
    port: 3030
})
var connections = {}
// var lastId = 0
const roles = {
    guest: "guest",
    user: "user"
}

let TABLES = new Map([
    ["USERS", "weather_users"],
    ["DATA", "weather_data"],
    ["ENDPOINTS", "endpoints"]
])

exports.initWs = function (dataBase) {
    db = dataBase
    wss.on("connection", ws => {
        // var id = lastId++;
        connections[ws] = roles.guest;
        console.log("WS: User " + id + " connected")
        // ws.send(JSON.stringify(data));
        ws.on("message", message => {
            console.log("WS: " + id + ">" + message);
            resolveMessage(message, ws, id);
        })
        ws.on("close", () => {
            delete connections[ws];
            console.log("WS: User " + id + " disconnected")
        })
    })
    console.log("INFO: WS Ready")
}

function regUser(user, ws) {
    db.addUser(user, function () {
        connections[ws] = user.email;
        var answer = {
            action: "confirm regUser",
            reason: user.email
        };
        ws.send(JSON.stringify(answer))
    }, function (err) {
        var answer = {
            action: "deny regUser",
            reason: err
        };
        ws.send(JSON.stringify(answer))
    }
    )
}
function loginUser(user, ws) {
    db.findUser(user, function (found) {
        connections[ws] = user.email;
        answer = {
            action: "confirm loginUser",
            reason: user.email
        };
        ws.send(JSON.stringify(answer))
    }, function (err) {
        var answer;
        if (err == null) {
            answer = {
                action: "deny loginUser",
                reason: "Wrong email or password"
            };
        } else {
            answer = {
                action: "deny loginUser",
                reason: err
            };
        }
        ws.send(JSON.stringify(answer))
    })
}

function resolveMessage(message, ws, id) {
    message = JSON.parse(message);
    var answer = {
        action: "error",
        reason: "Internal Error"
    };
    switch (message.action) {
        case "regUser": {
            if (message.data.email != undefined && message.data.pass != undefined) {
                //TODO validation
                let newUser = new User(message.data.email, message.data.pass, "user");
                regUser(newUser, ws)
            } else {
                answer = {
                    action: "deny regUser",
                    reason: "Invaliid email or password"
                }
                ws.send(JSON.stringify(answer))
            }
            break;
        }
        case "loginUser": {
            let user = new User(message.data.email, message.data.pass, "user");
            loginUser(user, ws);
            break;
        }
        default: {
            answer = {
                action: "deny " + message.action,
                reason: "Test",
            }
            break;
        }
    }
}