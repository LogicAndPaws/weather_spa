var NodeCouchDb = require('node-couchdb');
const { v4: uuid4, v5: uuid5 } = require('uuid');
let User = require("./utils").User;
let Endpoint = require("./utils").Endpoint;
let Data = require("./utils").Data;
const UUIDNS = "ABCDEFGH";

let TABLES = new Map([
    ["USERS", "weather_users"],
    ["DATA", "weather_data"],
    ["ENDPOINTS", "endpoints"]
])

let db = new NodeCouchDb({
    host: 'localhost',
    protocol: 'http',
    port: 5984,
    auth: {
        user: 'SunShade',
        pass: '4141'
    }
});

exports.initBase = function (resolve, reject) {
    let initBase = db.listDatabases().then(
        dbs => {
            for (let tableName of TABLES.values()) {
                let index = dbs.find((value, index, array) => {
                    if (value === tableName) return true;
                    else return false;
                })
                if (index === undefined) {
                    db.createDatabase(tableName).then(
                        () => {
                            console.log("INFO: Table [" + tableName + "] created")
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
        console.log("INFO: Database Ready");
        resolve(1)
    }, error => {
        console.log("ERROR: " + error)
    });
};

exports.addUser = function (user) {
    db.insert(TABLES.USERS, {
        _id: user.email,
        user: {
            email: user.email,
            // password: uuid5(user.password, UUIDNS)
            password: user.password,
            status: user.status
        }
    }).then(({data, headers, status}) => {
        console.log("INFO:" +  user.email +  " > data inserted");
          
    }, err => {
        console.log("ERROR: " + err);

    });
};

exports.findUser = function (email) {
    user = "";
    db.get(TABLES.USERS, email).then(({data, headers, status}) => {
        user = new User(data.user.email, data.user.password, data.user.status);
    }, err => {
        console.log("ERROR: " + err);
        user = null
    });
    return user;
};

exports.addEndpoint = function (endpoint) {

};

exports.getEndpoints = function () {
    
};

exports.deleteEndpoint = function (owner) {

};

exports.getData = function (date) {

};