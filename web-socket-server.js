const WebSocket = require("ws");
const wss = new WebSocket.Server({
    port: 3030
})
var connections = {}
var lastId = 0

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

exports.initWs = function () {
    wss.on("connection", ws => {
        var id = lastId++;
        connections[id] = ws;
        console.log("WS: User " + id + " connected")
        // ws.send(JSON.stringify(data));
        ws.on("message", message => {
            console.log("WS: "+ id + ">" + message)
        })
        ws.on("close", () => {
            delete connections[id];
            console.log("WS: User " + id + " disconnected")
        })
    })
    console.log("INFO: WS Ready")
}