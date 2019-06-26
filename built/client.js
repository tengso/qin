"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME: use import
var Messages_1 = require("./Messages");
var userId = 'ts';
var password = '';
var userName = 'song';
var creatorId = 'xyz';
var WebSocket = require("ws");
var url = 'ws://localhost:8080';
var connection = new WebSocket(url);
connection.onopen = function () {
    connection.send(Messages_1.login(userId, password));
};
connection.onerror = function (error) {
    console.log("WebSocket error: " + error);
};
connection.onmessage = function (e) {
    var x = e.data.toString();
    console.log(x);
    var o = JSON.parse(x);
    console.log(o);
    console.log(typeof (o));
    var returnMsg = JSON.parse(e.data.toString());
    switch (returnMsg.msgType) {
        case Messages_1.MsgType.LoginSuccess:
            console.log("login success: " + returnMsg.payLoad.sessionId);
            connection.send(Messages_1.logout(userId));
            break;
        case Messages_1.MsgType.LoginFailure:
            console.log("login failure: " + returnMsg.payLoad.reason);
            break;
        case Messages_1.MsgType.LogoutFailure:
            console.log("logout failure: " + returnMsg.payLoad.reason);
        case Messages_1.MsgType.LogoutSuccess:
            console.log("logout success");
        default:
            // console.log(typeof returnMsg)
            // console.log(returnMsg['msgType'])
            // console.log(MsgType.LoginSuccess)
            console.log("unknown msg: " + returnMsg);
            break;
    }
    // console.log(e.data)
};
//# sourceMappingURL=client.js.map