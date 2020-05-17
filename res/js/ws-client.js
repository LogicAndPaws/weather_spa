var ws = new WebSocket("ws://" + window.location.hostname + ":3030")
var messageInput = document.getElementById("testMessage")

var regForm = document.getElementById("regForm");
var regEmail = document.getElementById("regEmail")
var regPass = document.getElementById("regPass")
var regPassConf = document.getElementById("regPassConf")
var regInfo = document.getElementById("regInfo");
var regConfirmBtn = document.getElementById("regConfirm")

var loginForm = document.getElementById("loginForm");
var loginEmail = document.getElementById("loginEmail")
var loginPass = document.getElementById("loginPass")
var loginInfo = document.getElementById("loginInfo");
var loginConfirmBtn = document.getElementById("loginConfirm")

var model = {
    currentDay: strDate(new Date(Date.now())),
    weatherTable: {},
    currentUser: null
};

function strDate(date){
    return date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear();
}

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    resolveMessage(message)
    //TODO print somewhere
    console.log(message);
}

function prepareData(data){
    for(var i = 0; i < 24; i++){
        let hour = i + ":00"
        weatherTable[hour] = data[i]
    }
}

function resolveMessage(message){
    switch(message.action){
        case "confirm loginUser":{
            loginInfo.innerHTML = message.reason;
            //TODO
            break;
        }
        case "deny loginUser":{
            loginInfo.innerHTML = message.reason;
            regConfirmBtn.disabled = false;
            loginConfirmBtn.disabled = false;
            break;            
        }
        case "confirm regUser":{
            regInfo.innerHTML = message.reason;
            //TODO
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
        regForm.style.display = "block";
    } else {
        regForm.style.display = "none";
        regPass.value = "";
        regPassConf.value = "";
        regInfo.innerHTML = "";
    }
}