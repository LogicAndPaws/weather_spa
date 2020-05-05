var ws = new WebSocket("ws://localhost:3030")
var messageInput = document.getElementById("testMessage")

var regEmail = document.getElementById("regEmail")
var regPass = document.getElementById("regPass")
var regPassConf = document.getElementById("regPassConf")

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    //TODO print somewhere
    console.log(message);
}

function testSend() {
    ws.send(messageInput.value)
}

function regConfirm() {
    var request = {
        action: 'register',
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
    }
}