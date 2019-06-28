"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Messages_1 = require("./Messages");
// FIXME: use import
var uuid = require('uuid/v4');
// const WebSocket = require('ws');
var ClientWrapper = /** @class */ (function () {
    function ClientWrapper(host, port, userId, password) {
        var _this = this;
        var url = "ws://" + host + ":" + port;
        this.connection = new WebSocket(url);
        this.userId = userId;
        this.password = password;
        this.connection.onopen = function () {
            _this.listen();
            console.log('connected');
        };
        this.connection.onerror = function (error) {
            console.log("WebSocket error: " + error);
        };
    }
    ClientWrapper.prototype.login = function () {
        this.connection.send(Messages_1.login(this.userId, this.password));
    };
    ClientWrapper.prototype.logout = function () {
        this.connection.send(Messages_1.logout(this.userId));
    };
    ClientWrapper.prototype.createUser = function (userId, userName, password) {
        this.connection.send(Messages_1.createUser(this.sessionId, userId, userName, password, this.userId));
    };
    ClientWrapper.prototype.createTable = function (tableName, columns) {
        var tableId = uuid();
        this.connection.send(Messages_1.createTable(this.sessionId, tableId, tableName, columns, this.userId));
    };
    ClientWrapper.prototype.subscribeTables = function () {
        this.connection.send(Messages_1.subscribeTables(this.sessionId, this.userId));
    };
    ClientWrapper.prototype.appendRow = function (tableId, values) {
        var rowId = uuid();
        this.connection.send(Messages_1.appendTableRow(this.sessionId, tableId, rowId, values, this.userId));
    };
    ClientWrapper.prototype.removeRow = function (tableId, rowId) {
        this.connection.send(Messages_1.removeTableRow(this.sessionId, tableId, rowId, this.userId));
    };
    ClientWrapper.prototype.updateCell = function (tableId, rowId, columnName, newValue) {
        this.connection.send(Messages_1.updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId));
    };
    ClientWrapper.prototype.listen = function () {
        var _this = this;
        this.connection.onmessage = function (e) {
            var returnMsg = JSON.parse(e.data.toString());
            switch (returnMsg.msgType) {
                case Messages_1.MsgType.LoginSuccess: {
                    _this.sessionId = returnMsg.payLoad.sessionId;
                    console.log("login success: " + returnMsg.payLoad.sessionId);
                    break;
                }
                case Messages_1.MsgType.CreateUserSuccess: {
                    console.log("create user success");
                    break;
                }
                case Messages_1.MsgType.CreateTableSuccess: {
                    console.log("create table success");
                    break;
                }
                case Messages_1.MsgType.SubscribeTablesSuccess: {
                    console.log("subscribe table success");
                    break;
                }
                case Messages_1.MsgType.AppendRowSuccess: {
                    console.log("append row success");
                    break;
                }
                case Messages_1.MsgType.UpdateCellSuccess: {
                    console.log("update cell success");
                    break;
                }
                case Messages_1.MsgType.RemoveRowSuccess: {
                    console.log("remove row success");
                    break;
                }
                case Messages_1.MsgType.TableSnap: {
                    console.log("table snap");
                    console.log("" + JSON.stringify(returnMsg));
                    break;
                }
                case Messages_1.MsgType.TableUpdate: {
                    console.log("table update");
                    console.log("" + JSON.stringify(returnMsg));
                    break;
                }
                case Messages_1.MsgType.AppendRowFailure: {
                    console.error("append row failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.LogoutSuccess: {
                    console.log("logout success");
                    break;
                }
                case Messages_1.MsgType.LoginFailure: {
                    console.error("login failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.CreateUserFailure: {
                    console.error("create user failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.CreateTableFailure: {
                    console.error("create table failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.UpdateCellFailure: {
                    console.error("update cell failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.RemoveRowFailure: {
                    console.error("remove row failure: " + returnMsg.payLoad.reason);
                    break;
                }
                case Messages_1.MsgType.LogoutFailure: {
                    console.error("logout failure: " + returnMsg.payLoad.reason);
                    break;
                }
                default: {
                    console.error("unknown msg: " + returnMsg);
                    break;
                }
            }
        };
    };
    return ClientWrapper;
}());
var client;
function getClient(host, port, userId, password) {
    console.log(typeof (ClientWrapper));
    if (!client) {
        client = new ClientWrapper(host, port, userId, password);
        return client;
    }
    else {
        return client;
    }
}
exports.getClient = getClient;
//# sourceMappingURL=client.js.map