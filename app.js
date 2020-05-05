var NodeCouchDb = require('node-couchdb');
var express = require('express');
var initWs = require('./web-socket-server').initWs

var spaApp = express();

const APP_PORT = 3000;

let TABLES = new Map([
  ["USERS", "weather_users"],
  ["DATA", "weather_data"]
])


const db = new NodeCouchDb({
  host: 'localhost',
  protocol: 'http',
  port: 5984,
  auth: {
    user: 'SunShade',
    pass: '4141'
  }
});

spaApp.use('/res', express.static(__dirname + '/res'));

spaApp.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/main.html');
});

spaApp.listen(APP_PORT, function () {
  var tablePromise = new Promise(initTables);
  initWs();
  Promise.all([tablePromise]).then(values => {
    console.log('INFO: App started on ' + APP_PORT);
  })
});

function initTables(resolve, reject){
  let initBase = db.listDatabases().then(
    dbs => {
      for (let tableName of TABLES.values()) {
        let index = dbs.find( (value, index, array) => {
          if (value === tableName) return true;
          else return false;
        })
        if (index === undefined) {
          db.createDatabase(tableName).then(
            () => {
              console.log("INFO: Table " + tableName + " created")
            },
            err => {
              console.log("ERROR: " + err);
            }
          )
        }
      }
  }, err => {
      console.log("ERROR: " + err);
  });
  Promise.all([initBase]).then(values => {
    console.log("INFO: Database is ready");
    resolve(1)
  }, error => {
    console.log("ERROR: " + error)
  });
}