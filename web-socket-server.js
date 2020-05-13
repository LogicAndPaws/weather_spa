const WebSocket = require("ws");
let User = require("./utils").User;
let Endpoint = require("./utils").Endpoint;
let Data = require("./utils").Data;
let db;

const wss = new WebSocket.Server({
    port: 3030
})
var connections = {}
var lastId = 0
const roles = {
    guest: "guest",
    user: "user"
}

var data = {
    0: {name: 'sdads', age: 42, date: '11.11.11'},
    1: {name: 'sdssdads', age: 44, date: '11.11.11'},
    2: {name: 'sdagads', age: 41, date: '11.11.11'},
    3: {name: 'sdyads', age: 42, date: '11.11.11'},
    4: {name: 'sdiuads', age: 42, date: '11.11.11'},
    5: {name: 'sdahjjds', age: 42, date: '11.11.11'},
    6: {name: 'sdvbads', age: 42, date: '11.11.11'},
    7: {name: 'zxsdads', age: 44, date: '11.11.11'},
    8: {name: 'hsdads', age: 48, date: '11.11.11'},
    9: {name: 'dyesdads', age: 42, date: '11.11.11'},
    10: {name: 'embsdads', age: 47, date: '11.11.11'},
    11: {name: 'agsdads', age: 42, date: '11.11.11'},
    12: {name: 'opsdads', age: 42, date: '11.11.11'},
}

exports.initWs = function (dataBase) {
    db = dataBase
    wss.on("connection", ws => {
        var id = lastId++;
        connections[id] = roles.guest;
        console.log("WS: User " + id + " connected")
        // ws.send(JSON.stringify(data));
        ws.on("message", message => {
            console.log("WS: " + id + ">" + message);
            var answer = JSON.stringify(resolveMessage(message, id));
            console.log("WS: " + id + "<" + answer);
            ws.send(answer);
        })
        ws.on("close", () => {
            delete connections[id];
            console.log("WS: User " + id + " disconnected")
        })
    })
    console.log("INFO: WS Ready")
}

function resolveMessage(message, id){
    message = JSON.parse(message);
    var answer = {
        action: "error",
        reason: "Internal Error"
    };
    switch(message.action){
        case "regUser": {
            if(message.data.email != undefined && message.data.pass != undefined){
                //TODO validation
                let newUser = new User(message.data.email, message.data.pass, "user");
                let existUser = db.findUser(newUser.email);
                if(existUser === ""){
                    db.addUser(newUser);
                    answer = {
                        action: "confirm regUser",
                        reason: newUser.email
                    }
                } else if(existUser == null){
                    answer = {
                        action: "deny regUser",
                        reason: "Internal error"
                    }
                } else {
                    answer = {
                        action: "deny regUser",
                        reason: "User with this email already exists"
                    }
                }
            } else {
                answer = {
                    action: "deny regUser",
                    reason: "Invaliid email or password"
                }
            }
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
    return answer;
}