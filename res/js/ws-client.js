var ws = new WebSocket("ws://" + window.location.hostname + ":3030")
var messageInput = document.getElementById("testMessage")

var regForm = document.getElementById("regForm");
var regEmail = document.getElementById("regEmail")
var regPass = document.getElementById("regPass")
var regPassConf = document.getElementById("regPassConf")
var regInfo = document.getElementById("regInfo");
var regConfirmBtn = document.getElementById("regConfirm")
var regDiv = document.getElementById("regDiv")

var loginForm = document.getElementById("loginForm");
var loginEmail = document.getElementById("loginEmail")
var loginPass = document.getElementById("loginPass")
var loginInfo = document.getElementById("loginInfo");
var loginConfirmBtn = document.getElementById("loginConfirm")
var loginDiv = document.getElementById("loginDiv")

var logoutDiv = document.getElementById("logoutDiv")
var userDiv = document.getElementById("userDiv")

var endpointForm = document.getElementById("endpointForm")
var endpointBtn = document.getElementById("endpointBtn")
var endpointAddress = document.getElementById("endpointAddress")
var endpointConfirm = document.getElementById("endpointConfirm")


var model = {
    currentDay: strDate(new Date(Date.now())),
    weatherTable: {},
    currentUser: "Guest"
};

function strDate(date){
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
}

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    console.log(message);
    resolveMessage(message)
    //TODO print somewhere
}

function prepareData(data){
    console.log(data)
    for(var i = 0; i < 24; i++){
        let hour = i + ":00"
        model.weatherTable[hour] = data[i]
    }
}

function resolveMessage(message){
    switch(message.action){
        case "confirm loginUser":{
            // loginInfo.innerHTML = message.reason;
            model.currentUser = message.reason;
            loginBtn();
            userMode();
            break;
        }
        case "deny loginUser":{
            loginInfo.innerHTML = message.reason;
            regConfirmBtn.disabled = false;
            loginConfirmBtn.disabled = false;
            break;            
        }
        case "confirm regUser":{
            // regInfo.innerHTML = message.reason;
            model.currentUser = message.reason;
            regBtn()
            userMode();
            break;
        }
        case "deny regUser":{
            regInfo.innerHTML = message.reason;
            regConfirmBtn.disabled = false;
            loginConfirmBtn.disabled = false;  
            break;
        }
        case "sendData":{
            prepareData(message.data)
            break;
        }
        case "error": {
            alert(message.reason);
            break;
        }
    }
}

function userMode(){
    regDiv.style.display = "none";
    loginDiv.style.display = "none";
    userDiv.style.innerHTML = model.currentUser;
    userDiv.style.display = "block";
    logoutDiv.style.display = "block";
    endpointBtn.disabled = false;
}

function regConfirm() {
    var request = {
        action: 'regUser',
        data: {
            email: regEmail.value,
            pass: regPass.value
        }
    }
    var pass = regPass.value;
    //TODO validate pass
    //   validatePass(pass);
    if (pass === regPassConf.value) {
        ws.send(JSON.stringify(request))
        regConfirmBtn.disabled = true;
        loginConfirmBtn.disabled = true;
        regInfo.innerHTML = "Please wait...";
    } else {
        regInfo.innerHTML = "Passwords doesnt match";
    }
}

function loginConfirm() {
    var request = {
        action: 'loginUser',
        data: {
            email: loginEmail.value,
            pass: loginPass.value
        }
    }
    ws.send(JSON.stringify(request))
    loginConfirmBtn.disabled = true;
    regConfirmBtn.disabled = true;
    loginInfo.innerHTML = "Please wait...";
}

function loginBtn() {
    if(loginForm.style.display === "none"){
        regForm.style.display = "none";
        endpointForm.style.display = "none";
        loginForm.style.display = "block";
    } else {
        loginForm.style.display = "none";
        loginPass.value = "";
        loginInfo.innerHTML = "";
    }
}

function regBtn() {
    if(regForm.style.display === "none"){
        loginForm.style.display = "none";
        endpointForm.style.display = "none";
        regForm.style.display = "block";
    } else {
        regForm.style.display = "none";
        regPass.value = "";
        regPassConf.value = "";
        regInfo.innerHTML = "";
    }
}

function logoutBtn() {
    ws.close();
    ws = new WebSocket("ws://" + window.location.hostname + ":3030");
    regDiv.style.display = "block";
    loginDiv.style.display = "block";
    model.currentUser = "Guest"
    userDiv.innerHTML = model.currentUser;
    userDiv.style.display = "none";
    logoutDiv.style.display = "none";
    loginConfirmBtn.disabled = false;
    regConfirmBtn.disabled = false;  if(loginForm.style.display === "none"){
        regForm.style.display = "none";
        loginForm.style.display = "block";
    } else {
        loginForm.style.display = "none";
        loginPass.value = "";
        loginInfo.innerHTML = "";
    }
    endpointBtn.disabled = true;
}

function endpointBtnClick() {
    if(endpointForm.style.display === "none"){
        regForm.style.display = "none";
        loginForm.style.display = "none";
        endpointForm.style.display = "block";
    } else {
        endpointForm.style.display = "none";
        endpointAddress.value = ""
    }
}

function endpointConfirm() {
    var request = {
        action: 'userEndpoint',
        data: {
            address: endpointAddress.value
        }
    }
    endpointForm.style.display = "none";
}