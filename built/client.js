"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME: use import
var Messages_1 = require("./Messages");
var uuid = require('uuid/v4');
var userId = 'root';
var password = 'root';
var newUserId = 'song';
var newUserName = 'Song Teng';
var newUserPassword = 'java';
// let userId = newUserId
// let password = newUserPassword
var tableId = uuid();
var tableName = 'table_name';
var columns = ['col_1', 'col_2', 'col_3'];
var rowId = uuid();
var values = ['val_1', 'val_2', 'val_3'];
var WebSocket = require("ws");
var url = 'ws://localhost:8080';
var connection = new WebSocket(url);
connection.onopen = function () {
    connection.send(Messages_1.login(userId, password));
};
connection.onerror = function (error) {
    console.log("WebSocket error: " + error);
};
var sessionId;
connection.onmessage = function (e) {
    var returnMsg = JSON.parse(e.data.toString());
    switch (returnMsg.msgType) {
        case Messages_1.MsgType.LoginSuccess: {
            sessionId = returnMsg.payLoad.sessionId;
            console.log("login success: " + returnMsg.payLoad.sessionId);
            // connection.send(createUser(sessionId, newUserId, newUserName, newUserPassword, userId))
            connection.send(Messages_1.createTable(sessionId, tableId, tableName, columns, userId));
            break;
        }
        case Messages_1.MsgType.LoginFailure: {
            console.error("login failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.LogoutFailure: {
            console.error("logout failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.LogoutSuccess: {
            console.log("logout success");
            break;
        }
        case Messages_1.MsgType.CreateUserFailure: {
            console.error("create user failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.CreateUserSuccess: {
            console.log("create user success");
            break;
        }
        case Messages_1.MsgType.CreateTableFailure: {
            console.error("create table failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.CreateTableSuccess: {
            console.log("create table success");
            connection.send(Messages_1.appendTableRow(sessionId, tableId, rowId, values, userId));
            break;
        }
        case Messages_1.MsgType.AppendRowFailure: {
            console.error("append row failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.AppendRowSuccess: {
            console.log("append row success");
            connection.send(Messages_1.updateCell(sessionId, tableId, rowId, 'col_4', 'new_vaue', userId));
            break;
        }
        case Messages_1.MsgType.UpdateCellFailure: {
            console.error("update cell failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.UpdateCellSuccess: {
            console.log("update cell success");
            connection.send(Messages_1.removeTableRow(sessionId, tableId, rowId, userId));
            break;
        }
        case Messages_1.MsgType.RemoveRowFailure: {
            console.error("remove row failure: " + returnMsg.payLoad.reason);
            break;
        }
        case Messages_1.MsgType.RemoveRowSuccess: {
            console.log("remove row success");
            break;
        }
        default:
            // console.log(typeof returnMsg)
            // console.log(returnMsg['msgType'])
            // console.log(MsgType.LoginSuccess)
            console.error("unknown msg: " + returnMsg);
            break;
    }
    // console.log(e.data)
};
//# sourceMappingURL=client.js.map