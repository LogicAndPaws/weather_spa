var ws = new WebSocket("ws://localhost:3030")
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

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    resolveMessage(message)
    //TODO print somewhere
    console.log(message);
}

function resolveMessage(message){
    switch(message.action){
        case "confirm loginUser":{
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
            //TODO
            break;
        }
        case "deny regUser":{
            regInfo.innerHTML = message.reason;
            regConfirmBtn.disabled = false;
            loginConfirmBtn.disabled = false;  
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