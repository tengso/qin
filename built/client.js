"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Messages_1 = require("./Messages");
// FIXME: use import
var uuid = require('uuid/v4');
// const WebSocket = require('ws');
var Client = /** @class */ (function () {
    function Client(host, port, callback) {
        var _this = this;
        var url = "ws://" + host + ":" + port;
        this.connection = new WebSocket(url);
        this.callback = callback;
        this.connection.onopen = function () {
            _this.listen();
            console.log('connected');
        };
        this.connection.onerror = function (error) {
            console.log("WebSocket error: " + error);
        };
    }
    Client.prototype.login = function (userId, password) {
        this.userId = userId;
        this.password = password;
        this.connection.send(Messages_1.login(this.userId, this.password));
    };
    Client.prototype.logout = function () {
        this.connection.send(Messages_1.logout(this.userId));
    };
    Client.prototype.createUser = function (userId, userName, password) {
        this.connection.send(Messages_1.createUser(this.sessionId, userId, userName, password, this.userId));
    };
    Client.prototype.createTable = function (tableName, columns) {
        var tableId = uuid();
        this.connection.send(Messages_1.createTable(this.sessionId, tableId, tableName, columns, this.userId));
    };
    Client.prototype.subscribeTables = function () {
        this.connection.send(Messages_1.subscribeTables(this.sessionId, this.userId));
    };
    Client.prototype.appendRow = function (tableId, values) {
        var rowId = uuid();
        this.connection.send(Messages_1.appendTableRow(this.sessionId, tableId, rowId, values, this.userId));
    };
    Client.prototype.removeRow = function (tableId, rowId) {
        this.connection.send(Messages_1.removeTableRow(this.sessionId, tableId, rowId, this.userId));
    };
    Client.prototype.updateCell = function (tableId, rowId, columnName, newValue) {
        this.connection.send(Messages_1.updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId));
    };
    Client.prototype.listen = function () {
        var _this = this;
        this.connection.onmessage = function (e) {
            var returnMsg = JSON.parse(e.data.toString());
            switch (returnMsg.msgType) {
                case Messages_1.MsgType.LoginSuccess: {
                    _this.sessionId = returnMsg.payLoad.sessionId;
                    _this.callback.loginSuccess(_this.sessionId);
                    break;
                }
                case Messages_1.MsgType.CreateUserSuccess: {
                    _this.callback.createUserSuccess();
                    break;
                }
                case Messages_1.MsgType.CreateTableSuccess: {
                    _this.callback.createTableSuccess(returnMsg.payLoad.tableId);
                    break;
                }
                case Messages_1.MsgType.SubscribeTablesSuccess: {
                    _this.callback.subscribeTablesSuccess();
                    break;
                }
                case Messages_1.MsgType.AppendRowSuccess: {
                    _this.callback.appendRowSuccess(returnMsg.payLoad.rowId);
                    break;
                }
                case Messages_1.MsgType.RemoveRowSuccess: {
                    _this.callback.removeRowSuccess(returnMsg.payLoad.rowId);
                    break;
                }
                case Messages_1.MsgType.UpdateCellSuccess: {
                    _this.callback.updateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId, returnMsg.payLoad.columnName);
                    break;
                }
                case Messages_1.MsgType.LogoutSuccess: {
                    _this.sessionId = undefined;
                    _this.userId = undefined;
                    _this.password = undefined;
                    _this.callback.logoutSuccess();
                    break;
                }
                case Messages_1.MsgType.TableSnap: {
                    _this.callback.tableSnap(returnMsg.payLoad.table);
                    break;
                }
                case Messages_1.MsgType.TableUpdate: {
                    var update = returnMsg.payLoad.update;
                    switch (update.updateType) {
                        case Messages_1.MsgType.AppendRow:
                            _this.callback.appendRow(update.tableId, update.rowId, update.values);
                            break;
                        case Messages_1.MsgType.RemoveRow:
                            _this.callback.removeRow(update.rowId);
                            break;
                        case Messages_1.MsgType.UpdateCell:
                            _this.callback.updateCell(update.rowId, update.columnIndex, update.value);
                            break;
                        default:
                            console.log("unknown update type: " + update.updateType);
                    }
                    break;
                }
                case Messages_1.MsgType.AppendRowFailure: {
                    console.error("append row failure: " + returnMsg.payLoad.reason);
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
                case Messages_1.MsgType.SubscribeTablesFailure: {
                    console.error("subscribe table failure: " + returnMsg.payLoad.reason);
                    break;
                }
                default: {
                    console.error("unknown msg: " + returnMsg);
                    break;
                }
            }
        };
    };
    return Client;
}());
// @ts-ignore
window.Client = Client;
//# sourceMappingURL=client.js.map