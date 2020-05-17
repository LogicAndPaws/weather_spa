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

var ACTUAL_DATA = {}

exports.initWs = function (dataBase) {
    db = dataBase
    wss.on("connection", ws => {
        // var id = lastId++;
        connections[ws] = roles.guest;
        sendData(strDate(new Date(Date.now())), ws)
        // console.log("WS: User " + id + " connected")
        // ws.send(JSON.stringify(data));
        ws.on("message", message => {
            // console.log("WS: " + id + ">" + message);
            resolveMessage(message, ws);
        })
        ws.on("close", () => {
            delete connections[ws];
            // console.log("WS: User " + id + " disconnected")
        })
    })
    // calculateData(strDate(new Date(Date.now())));
    console.log("INFO: WS Ready")
}

function strDate(date){
    return date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear();
}

function calculateData(date) {
    db.getData(date, insertCurrent, () => {});
};

//owner (email), commit_data (json), commit_date '7.4.2020'
//temperature, weather, wind
//var ACTUAL_DATA = {}
function insertCurrent(dataSet){
    var weathers = [
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
    ];
    for (var data of dataSet) {
        var weather = JSON.parse(data.commit_data);
        for (var i = 0; i < 24; i++){
            weathers[i].push(weather[i]);
        }
    }
    for (var i = 0; i < 24; i++){
        var sumTemp = 0;
        var sumwind = 0;
        for (var entity of weathers[i]){
            sumTemp += entity.temperature;
            sumWind += entity.wind;
        }
        ACTUAL_DATA[dataSet[0].commit_date][i] = {
            temperature: sumTemp/weathers[i].length,
            weather: weathers[i][0].weather,
            wind: sumwind/weathers[i].length
        }
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

function resolveMessage(message, ws) {
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