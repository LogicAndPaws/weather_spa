var express = require('express');
let ws = require('./web-socket-server');
let base = require('./db');
let http = require("http"); 
let schedule = require('node-schedule')

let Data = require("./utils").Data;
let utils = require("./utils");
var spaApp = express();

var apiChecker;
const APP_PORT = 3000;

spaApp.use('/res', express.static(__dirname + '/res'));

spaApp.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/main.html');
});

spaApp.listen(APP_PORT, function () {
  base.initBase();
  ws.initWs(base);
  apiChecker = schedule.scheduleJob("* /10 * * *", checkEndpoints);
  checkEndpoints();
  console.log("INFO: App started on " + APP_PORT);
});

function checkEndpoints(){
  console.log("INFO: Checking endpoints...")
  http.get('http://192.168.100.101:3003/weather', (res) => {
    res.on("data", data => {
      base.saveData(new Data("test@m.c", utils.bin2string(data), utils.strDate(new Date(Date.now()))));
      ws.updateData();
    })
  })
}