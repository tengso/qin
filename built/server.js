"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var Messages_1 = require("./Messages");
var uuid = require('uuid/v4');
var wss = new ws_1.Server({ port: 8080 });
var root_id = 'root';
var root_name = 'super';
var root_password = 'root';
// Persistent State
var sessionIdToUserId = new Map();
var userIdToSessionId = new Map();
var users = new Map();
var tableUpdates = new Map();
var tables = new Map();
var rowIdToRowIndex = new Map();
var subscribers = new Map();
// 
// Transient State
var sessionIdToSocket = new Map();
// 
users.set(root_id, { userId: root_id, userName: root_name, password: root_password });
function authenticate(userId, password) {
    if (users.has(userId)) {
        return users.get(userId).password === password;
    }
    else {
        return false;
    }
}
function publishTableUpdate(update) {
    subscribers.forEach(function (userId, sessionId) {
        if (sessionIdToSocket.has(sessionId)) {
            sessionIdToSocket.get(sessionId).send(Messages_1.sendTableUpdate(sessionId, userId, update));
        }
    });
}
function publishTableSnap(table) {
    subscribers.forEach(function (userId, sessionId) {
        if (sessionIdToSocket.has(sessionId)) {
            sessionIdToSocket.get(sessionId).send(Messages_1.sendTableSnap(sessionId, userId, table));
        }
    });
}
function handleLogin(ws, userId, password) {
    console.log("login: " + userId + " " + password);
    if (authenticate(userId, password)) {
        if (userIdToSessionId.has(userId)) {
            var sessionId = userIdToSessionId.get(userId);
            sessionIdToSocket.set(sessionId, ws);
            return Messages_1.loginSuccess(sessionId);
        }
        else {
            var sessionId = uuid();
            sessionIdToUserId.set(sessionId, userId);
            userIdToSessionId.set(userId, sessionId);
            sessionIdToSocket.set(sessionId, ws);
            return Messages_1.loginSuccess(sessionId);
        }
    }
    else {
        return Messages_1.loginFailure('wrong user or password');
    }
}
function handleLogout(userId) {
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
function handleCreateUser(sessionId, userId, userName, password, creatorId) {
    if (checkSessionId(creatorId, sessionId)) {
        if (users.has(userId)) {
            return Messages_1.createUserFailure("user " + userId + " exists");
        }
        else {
            users.set(userId, {
                userId: userId,
                userName: userName,
                password: password
            });
            return Messages_1.createUserSuccess();
        }
    }
    else {
        return Messages_1.createUserFailure("unknown user " + creatorId);
    }
}
function handleAppendRow(message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var values = pl.values;
    var updatorId = pl.updatorId;
    if (checkSessionId(updatorId, sessionId)) {
        if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
            return Messages_1.appendTableRowFailure(rowId, "table " + tableId + " not exists");
        }
        else {
            var table = tables.get(tableId);
            table.version = table.version + 1;
            table.rows.push({
                rowId: rowId,
                values: values
            });
            tables.set(tableId, table);
            rowIdToRowIndex.set(rowId, table.rows.length - 1);
            var tableUpdate = tableUpdates.get(tableId);
            tableUpdate.set(table.version, message);
            console.log("append row\n" + JSON.stringify(table) + "\n" + tableUpdate);
            publishTableUpdate({
                updateType: message.msgType,
                tableId: tableId,
                rowId: rowId,
                values: values
            });
            return Messages_1.appendTableRowSuccess(rowId);
        }
    }
    else {
        return Messages_1.appendTableRowFailure(rowId, 'unknown session');
    }
}
function handleRemoveRow(message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var updatorId = pl.updatorId;
    if (checkSessionId(updatorId, sessionId)) {
        if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
            return Messages_1.removeTableRowFailure(rowId, "table " + tableId + " not exists");
        }
        else {
            if (!rowIdToRowIndex.has(rowId)) {
                return Messages_1.removeTableRowFailure(rowId, "row " + rowId + " not exists");
            }
            else {
                var table = tables.get(tableId);
                table.rows.splice(rowIdToRowIndex.get(rowId), 1);
                table.version = table.version + 1;
                tables.set(tableId, table);
                tableUpdates.get(tableId).set(table.version, message);
                // console.log(tableUpdates)
                // console.log(tables)
                publishTableUpdate(message);
                return Messages_1.removeTableRowSuccess(rowId);
            }
        }
    }
    else {
        return Messages_1.appendTableRowFailure(rowId, 'unknown session');
    }
}
function handleUpdateCell(message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var columnName = pl.columnName;
    var value = pl.value;
    var updatorId = pl.updatorId;
    if (checkSessionId(updatorId, sessionId)) {
        if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
            return Messages_1.updateCellFailure(tableId, rowId, columnName, "table " + tableId + " not exists");
        }
        else {
            if (!rowIdToRowIndex.has(rowId)) {
                return Messages_1.updateCellFailure(tableId, rowId, columnName, "row " + rowId + " not exists");
            }
            else {
                var table = tables.get(tableId);
                var columnIndex = table.columns.indexOf(columnName);
                if (columnIndex === -1) {
                    return Messages_1.updateCellFailure(tableId, rowId, columnName, "column " + columnName + " not exists");
                }
                else {
                    table.version = table.version + 1;
                    var row = table.rows[rowIdToRowIndex.get(rowId)];
                    row.values[columnIndex] = value;
                    tables.set(tableId, table);
                    tableUpdates.get(tableId).set(table.version, message);
                    // console.log(tableUpdates)
                    // console.log(tables)
                    // console.log(tables.get(tableId).rows[0].values)
                    publishTableUpdate(message);
                    return Messages_1.updateCellSuccess(tableId, rowId, columnName);
                }
            }
        }
    }
    else {
        return Messages_1.updateCellFailure(tableId, rowId, columnName, 'unknown session');
    }
}
function handleCreateTable(message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var tableId = pl.tableId;
    var tableName = pl.tableName;
    var columns = pl.columns;
    var creatorId = pl.creatorId;
    if (checkSessionId(creatorId, sessionId)) {
        if (!tableUpdates.has(tableId)) {
            tableUpdates.set(tableId, new Map());
            var version = 0;
            var tableUpdate = tableUpdates.get(tableId);
            tableUpdate.set(version, message);
            var table = {
                tableId: tableId,
                tableName: tableName,
                version: version,
                columns: columns,
                rows: new Array(),
                creatorId: creatorId,
            };
            tables.set(tableId, table);
            console.log("create table\n" + JSON.stringify(table) + "\n" + tableUpdate);
            publishTableUpdate(message);
            publishTableSnap(table);
            return Messages_1.createTableSuccess(tableId);
        }
        else {
            return Messages_1.createTableFailure(tableId, "table " + tableId + " exists");
        }
    }
    else {
        return Messages_1.createTableFailure(tableId, 'unknown session');
    }
}
function handleSubscribeTables(ws, message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var subscriberId = pl.subscriberId;
    if (checkSessionId(subscriberId, sessionId)) {
        if (sessionIdToSocket.has(sessionId)) {
            var wws_1 = sessionIdToSocket.get(sessionId);
            subscribers.set(sessionId, subscriberId);
            tables.forEach(function (table, _) {
                console.log(table);
                wws_1.send(Messages_1.sendTableSnap(sessionId, subscriberId, table));
            });
            // FIXME: should send response before sending table
            return Messages_1.subscribeTablesSuccess(sessionId, subscriberId);
        }
        else {
            return Messages_1.subscribeTablesFailure(sessionId, subscriberId, subscriberId + " sessionId: " + sessionId + " socket not found");
        }
    }
    else {
        return Messages_1.subscribeTablesFailure(sessionId, subscriberId, "subscriberId: " + subscriberId + " not login");
    }
}
function checkSessionId(userId, sessionId) {
    return (userIdToSessionId.has(userId) && userIdToSessionId.get(userId) === sessionId);
}
function handleMessage(ws, message) {
    switch (message.msgType) {
        case Messages_1.MsgType.Login:
            return handleLogin(ws, message.payLoad.userId, message.payLoad.password);
        case Messages_1.MsgType.Logout:
            return handleLogout(message.payLoad.userId);
        case Messages_1.MsgType.CreateUser:
            return handleCreateUser(message.payLoad.sessionId, message.payLoad.userId, message.payLoad.userName, message.payLoad.password, message.payLoad.creatorId);
        case Messages_1.MsgType.CreateTable:
            return handleCreateTable(message);
        case Messages_1.MsgType.AppendRow:
            return handleAppendRow(message);
        case Messages_1.MsgType.RemoveRow:
            return handleRemoveRow(message);
        case Messages_1.MsgType.UpdateCell:
            return handleUpdateCell(message);
        case Messages_1.MsgType.SubscribeTables:
            return handleSubscribeTables(ws, message);
        default:
            console.log("Unknown Msg");
            break;
    }
}
function handleConnection(ws) {
    ws.on('message', function (msg) {
        var message = JSON.parse(msg.toString());
        var return_message = handleMessage(ws, message);
        ws.send(return_message);
    });
}
wss.on('connection', handleConnection);
//# sourceMappingURL=server.js.map