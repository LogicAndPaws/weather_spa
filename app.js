var NodeCouchDb = require('node-couchdb');
var express = require('express');
let ws = require('./web-socket-server');
let base = require('./db');

var spaApp = express();

const APP_PORT = 3000;

spaApp.use('/res', express.static(__dirname + '/res'));

spaApp.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/main.html');
});

spaApp.listen(APP_PORT, function () {
  var tablePromise = new Promise(base.initBase);
  ws.initWs(base);
  Promise.all([tablePromise]).then(values => {
    console.log('INFO: App started on ' + APP_PORT);
  })
});