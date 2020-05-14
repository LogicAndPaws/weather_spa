var mysql = require('mysql');
const { v4: uuid4, v5: uuid5 } = require('uuid');
let User = require("./utils").User;
let Endpoint = require("./utils").Endpoint;
let Data = require("./utils").Data;
const UUIDNS = "ABCDEFGH";

let TABLES = new Map([
    ["USERS", "users"],
    ["DATA", "data"],
    ["ENDPOINTS", "endpoints"]
])

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '177013',
    database: 'weather'
});

exports.initBase = async function () {
    db.query('CREATE TABLE user(email varchar(200) UNIQUE, password varchar(200), status varchar(20))', function (err) { });
    db.query('CREATE TABLE data(owner varchar(200), commit_data mediumtext, commit_date date)', function (err) { });
    db.query('CREATE TABLE endpoint(owner varchar(200), address varchar(255))', function (err) { });
    db.query('SHOW TABLES', function (error, result, fields) {
        if (error != null) console.log(error.sqlMessage);
        else console.log("INFO: DB Ready");
    })
};

exports.addUser = function (user, callbackS, callbackE) {
    db.query('INSERT INTO user VALUES (?, ?, ?)', [user.email, user.password, user.status], function (error, result, fields) {
        if (error) {
            console.log("ERROR: " + error.sqlMessage);
            callbackE(error.sqlMessage);
        }
        else (callbackS());
    })
};

exports.findUser = function (user, callbackS, callbackE) {
    db.query('SELECT * FROM user WHERE email = ? and password = ?', [user.email, user.password], function (error, result, fields) {
        if (error) {
            console.log("ERROR: " + error.sqlMessage);
            callbackE(error.sqlMessage);
        }
        else {
            if (result.length != 0) callbackS(user);
            else callbackE(null);
        }
    })
};

exports.addEndpoint = function (endpoint) {

};

exports.getEndpoints = function () {

};

exports.deleteEndpoint = function (owner) {

};

exports.getData = function (date) {

};