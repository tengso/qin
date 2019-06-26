"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var Messages_1 = require("./Messages");
var uuid = require('uuid/v4');
var wss = new ws_1.Server({ port: 8080 });
var sessionIdToUserId = new Map();
var userIdToSessionId = new Map();
function authenticate(userId, password) {
    return true;
}
function handle_login(userId, password) {
    if (authenticate(userId, password)) {
        if (userIdToSessionId.has(userId)) {
            return Messages_1.loginSuccess(userIdToSessionId.get(userId));
        }
        else {
            var sessionId = uuid();
            sessionIdToUserId.set(sessionId, userId);
            userIdToSessionId.set(userId, sessionId);
            return Messages_1.loginSuccess(sessionId);
        }
    }
    else {
        return Messages_1.loginFailure('wrong user or password');
    }
}
function handle_logout(userId) {
    if (userIdToSessionId.has(userId)) {
        var sessionId = userIdToSessionId.get(userId);
        sessionIdToUserId.delete(sessionId);
        userIdToSessionId.delete(userId);
        return Messages_1.logoutSuccess();
    }
    else {
        return Messages_1.logoutFailure("unknown user: " + userId);
    }
}
function handle_create_user() {
}
function handle_message(message) {
    var returnMsg;
    switch (message.msgType) {
        case Messages_1.MsgType.Login:
            returnMsg = handle_login(message.payLoad.userId, message.payLoad.password);
            break;
        case Messages_1.MsgType.Logout:
            returnMsg = handle_logout(message.payLoad.userId);
            break;
        case Messages_1.MsgType.CreateTable:
            console.log("Create Table => " + message.payLoad.tableId);
            break;
        case Messages_1.MsgType.CreateUser:
            console.log("Create User => " + message.payLoad.userId);
            break;
        default:
            console.log("Unknown Msg");
            break;
    }
    return JSON.stringify(returnMsg);
}
function handle_connection(ws) {
    ws.on('message', function (msg) {
        var message = JSON.parse(msg.toString());
        var return_message = handle_message(message);
        ws.send(return_message);
    });
}
wss.on('connection', handle_connection);
//# sourceMappingURL=server.js.map