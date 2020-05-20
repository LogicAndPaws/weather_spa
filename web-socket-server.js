const WebSocket = require("ws");
const { v4: uuid4, v5: uuid5 } = require('uuid');
let User = require("./utils").User;
let Endpoint = require("./utils").Endpoint;
let Data = require("./utils").Data;
let utils = require("./utils");
const UUIDNS = "ABCDEFGH";
let db;
let nextId = 0;
const wss = new WebSocket.Server({
    port: 3030
})
var connections = {}
var users = {}
const roles = {
    guest: "guest",
    user: "user"
}

let TABLES = new Map([
    ["USERS", "weather_users"],
    ["DATA", "weather_data"],
    ["ENDPOINTS", "endpoints"]
])

var ACTUAL_DATA = {}

exports.updateData = function(){
    calculateData(strDate(new Date(Date.now())));
}

exports.initWs = function (dataBase) {
    db = dataBase
    let id = nextId++;
    wss.on("connection", ws => {
        users[ws] = roles.guest;
        connections[id] = ws;
        sendData(utils.strDate(new Date(Date.now())), ws)
        ws.on("message", message => {
            resolveMessage(message, ws);
        })
        ws.on("close", () => {
            delete users[ws];
            delete connections[id];
        })
    })
    console.log("INFO: WS Ready")
}

function calculateData(date) {
    db.getData(date, insertCurrent, () => {});
};

exports.updateData = function(){
    calculateData(utils.strDate(new Date(Date.now())));
}

function insertCurrent(dataSet, date){
    console.log("INFO: Updating current table...")
    var weathers = [];
    for (var i = 0; i < 24; i++)
        weathers[i] = [];
    for (var data of dataSet) {
        var weather = JSON.parse(data.commit_data);
        for (var i = 0; i < 24; i++){
            weathers[i].push(weather[i]);
        }
    }
    ACTUAL_DATA[date] = []
    for (var i = 0; i < 24; i++){
        var sumTemp = 0;
        var sumWind = 0;
        for (var entity of weathers[i]){
            sumTemp += entity.temperature;
            sumWind += entity.wind;
        }
        ACTUAL_DATA[date][i] = {
            temperature: Math.round(sumTemp/weathers[i].length),
            weather: weathers[i][0].weather,
            wind: Math.round(sumWind/weathers[i].length)
        }
    }
    console.log("INFO: Updated -> " + new Date(Date.now()));
    resendToAll()
}

function resendToAll(){
    for (var id in connections) {
        sendData(utils.strDate(new Date(Date.now())), connections[id]);
    }
}

function logError(err) {

}

function sendData(date, ws) {
    var data = ACTUAL_DATA[date];
    var message = {
        action: "sendData",
        data: data,
        date: date
    }
    ws.send(JSON.stringify(message));
}

function regUser(user, ws) {
    db.addUser(user, function () {
        users[ws] = user.email;
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
        users[ws] = user.email;
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

function resolveMessage(message, ws) {
    message = JSON.parse(message);
    var answer = {
        action: "error",
        reason: "Internal Error"
    };
    switch (message.action) {
        case "regUser": {
            if (message.data.email != undefined && message.data.pass != undefined) {
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
                reason: "Wrong request",
            }
            ws.send(JSON.stringify(answer))
            break;
        }
    }
}