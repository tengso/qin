"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var Messages_1 = require("./Messages");
var RedisStorage_1 = require("./RedisStorage");
// FIXME: enforce one user one session
var uuid = require('uuid/v4');
var wss = new ws_1.Server({ port: 8080 });
var root_id = 'root';
var root_name = 'super';
var root_password = 'root';
// Persistent State
// const sessionIdToUserId = new Map<SessionId, UserId>()
// const userIdToSessionId = new Map<UserId, SessionId>()
// const users = new Map<UserId, UserInfo>()
// const subscribers = new Map<SessionId, UserId>()
// const tableUpdates = new Map<TableId, Map<Version, any>>()
// const tables = new Map<TableId, Table>() 
// const rowIdToRowIndex = new Map<RowId, number>()
// // 
// Transient State
var sessionIdToSocket = new Map();
// 
// users.set(root_id, {userId: root_id, userName: root_name, password: root_password})
// function authenticate(userId: UserId, password: Password) {
//   if (users.has(userId)) {
//       return users.get(userId).password === password
//   }
//   else {
//     return false
//   }
// }
function publish(msg, callback) {
    db.getSubscribers(function (sessionIds) {
        if (sessionIds) {
            sessionIds.forEach(function (sessionId) {
                if (sessionIdToSocket.has(sessionId)) {
                    sessionIdToSocket.get(sessionId).send(msg);
                    callback();
                }
                else {
                    console.log("can't find socket for " + sessionId);
                }
            });
        }
        else {
            console.log("empty subscribers");
        }
    });
}
// function publishTableUpdate(update) {
//   subscribers.forEach((userId, sessionId) => {
//     if (sessionIdToSocket.has(sessionId)) {
//       sessionIdToSocket.get(sessionId).send(sendTableUpdate(sessionId, userId, update))
//     }
//   })
// }
// function publishTableSnap(table) {
//   subscribers.forEach((userId, sessionId) => {
//     if (sessionIdToSocket.has(sessionId)) {
//       sessionIdToSocket.get(sessionId).send(sendTableSnap(sessionId, userId, table))
//     }
//   })
// }
var db = new RedisStorage_1.RedisStorage();
function Reply(ws) {
    return function (msg) {
        console.log(msg);
        ws.send(msg);
    };
}
function isRoot(userId, password) {
    return (userId === 'root') && (password === 'root');
}
function handleLogin(ws, reply, userId, password) {
    console.log("login: " + userId + " " + password);
    db.getUser(userId, function (user) {
        if (!user && !isRoot(userId, password)) {
            reply(Messages_1.loginFailure("user " + userId + " not found"));
        }
        else if (isRoot(userId, password) || (user.password === password)) {
            db.getSessionId(userId, function (sessionId) {
                if (!sessionId) {
                    var sessionId_1 = uuid();
                    sessionIdToSocket.set(sessionId_1, ws);
                    db.setSessionId(userId, sessionId_1, function () {
                        reply(Messages_1.loginSuccess(sessionId_1));
                    });
                }
                else {
                    reply(Messages_1.loginFailure("user " + userId + " already login"));
                }
            });
        }
        else {
            reply(Messages_1.loginFailure("user " + userId + " wrong password"));
        }
    });
}
function handleLogout(reply, userId) {
    console.log("logout: " + userId);
    db.getSessionId(userId, function (sessionId) {
        if (sessionId) {
            db.removeSessionId(userId, function (res) {
                sessionIdToSocket.delete(sessionId);
                reply(Messages_1.logoutSuccess());
            });
        }
        else {
            reply(Messages_1.logoutFailure("unknown user: " + userId));
        }
    });
}
function handleCreateUser(reply, sessionId, userId, userName, password, creatorId) {
    db.getSessionId(creatorId, function (sessionId) {
        if (sessionId) {
            db.getUser(userId, function (user) {
                if (user) {
                    reply(Messages_1.createUserFailure("user " + userId + " exists"));
                }
                else {
                    // users.set(userId, {
                    //   userId: userId,
                    //   userName: userName,
                    //   password: password
                    // })
                    db.setUser(userId, {
                        userId: userId,
                        userName: userName,
                        password: password
                    }, function () {
                        reply(Messages_1.createUserSuccess());
                    });
                }
            });
        }
        else {
            reply(Messages_1.createUserFailure("unknown creator " + creatorId));
        }
    });
}
function handleAppendRow(reply, message) {
    var pl = message.payLoad;
    var uncheckedSessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var values = pl.values;
    var updatorId = pl.updatorId;
    // console.log(`append row\n${JSON.stringify(table)}\n${tableUpdate}`)
    db.getSessionId(updatorId, function (sessionId) {
        if (sessionId && sessionId == uncheckedSessionId) {
            db.getTableSnap(tableId, function (table) {
                if (table) {
                    table.version = table.version + 1;
                    table.rows.push({
                        rowId: rowId,
                        values: values
                    });
                    db.setTableSnap(tableId, table, function () {
                        db.setRowIndex(rowId, table.rows.length - 1, function () {
                            db.setTableUpdate(tableId, table.version, message, function () {
                                var update = {
                                    updateType: message.msgType,
                                    tableId: tableId,
                                    rowId: rowId,
                                    values: values
                                };
                                var msg = Messages_1.sendTableUpdate(sessionId, updatorId, update);
                                publish(msg, function () {
                                    reply(Messages_1.appendTableRowSuccess(rowId));
                                });
                            });
                        });
                    });
                }
                else {
                    reply(Messages_1.appendTableRowFailure(rowId, "table " + tableId + " not exists"));
                }
            });
        }
        else {
            reply(Messages_1.appendTableRowFailure(rowId, 'unknown session'));
        }
    });
}
function handleRemoveRow(reply, message) {
    var pl = message.payLoad;
    var uncheckedSessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var updatorId = pl.updatorId;
    db.getSessionId(updatorId, function (sessionId) {
        if (sessionId && sessionId === uncheckedSessionId) {
            db.getTableSnap(tableId, function (table) {
                if (table) {
                    db.getRowIndex(rowId, function (rowIndex) {
                        if (rowIndex != null) {
                            table.rows.splice(rowIndex, 1);
                            table.version = table.version + 1;
                            db.setTableSnap(tableId, table, function () {
                                db.setTableUpdate(tableId, table.version, message, function () {
                                    db.removeRowIndex(rowId, function () {
                                        var update = {
                                            updateType: message.msgType,
                                            tableId: tableId,
                                            rowId: rowId,
                                        };
                                        var msg = Messages_1.sendTableUpdate(sessionId, updatorId, update);
                                        publish(msg, function () {
                                            reply(Messages_1.removeTableRowSuccess(rowId));
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            reply(Messages_1.removeTableRowFailure(rowId, "table " + rowId + " not exists"));
                        }
                    });
                }
                else {
                    reply(Messages_1.removeTableRowFailure(rowId, "table " + tableId + " not exists"));
                }
            });
        }
        else {
            reply(Messages_1.appendTableRowFailure(rowId, 'unknown session'));
        }
    });
}
function handleUpdateCell(reply, message) {
    var pl = message.payLoad;
    var uncheckedSessionId = pl.sessionId;
    var tableId = pl.tableId;
    var rowId = pl.rowId;
    var columnName = pl.columnName;
    var value = pl.value;
    var updatorId = pl.updatorId;
    db.getSessionId(updatorId, function (sessionId) {
        if (sessionId && sessionId === uncheckedSessionId) {
            db.getTableSnap(tableId, function (table) {
                if (table) {
                    db.getRowIndex(rowId, function (rowIndex) {
                        if (rowIndex != null) {
                            var columnIndex_1 = table.columns.indexOf(columnName);
                            if (columnIndex_1 === -1) {
                                reply(Messages_1.updateCellFailure(tableId, rowId, columnName, "column " + columnName + " not exists"));
                            }
                            else {
                                table.version = table.version + 1;
                                var row = table.rows[rowIndex];
                                row.values[columnIndex_1] = value;
                                db.setTableSnap(tableId, table, function () {
                                    db.setTableUpdate(tableId, table.version, message, function () {
                                        var update = {
                                            updateType: message.msgType,
                                            tableId: tableId,
                                            rowId: rowId,
                                            columnIndex: columnIndex_1,
                                            value: value,
                                        };
                                        var msg = Messages_1.sendTableUpdate(sessionId, updatorId, update);
                                        publish(msg, function () {
                                            reply(Messages_1.updateCellSuccess(tableId, rowId, columnName));
                                        });
                                    });
                                });
                            }
                        }
                        else {
                            reply(Messages_1.updateCellFailure(tableId, rowId, columnName, "row " + rowId + " not exists"));
                        }
                    });
                }
                else {
                    reply(Messages_1.updateCellFailure(tableId, rowId, columnName, "table " + tableId + " not exists"));
                }
            });
        }
        else {
            reply(Messages_1.updateCellFailure(tableId, rowId, columnName, 'unknown session'));
        }
    });
}
function handleCreateTable(reply, message) {
    var pl = message.payLoad;
    var sessionId = pl.sessionId;
    var tableId = pl.tableId;
    var tableName = pl.tableName;
    var columns = pl.columns;
    var creatorId = pl.creatorId;
    db.getSessionId(creatorId, function (storedSessionId) {
        if (storedSessionId != sessionId) {
            db.getTableSnap(tableId, function (tableSnap) {
                if (!tableSnap) {
                    db.setTableUpdate(tableId, 0, JSON.stringify(message), function (_) {
                        var table = {
                            tableId: tableId,
                            tableName: tableName,
                            version: 0,
                            columns: columns,
                            rows: new Array(),
                            creatorId: creatorId,
                        };
                        db.setTableSnap(tableId, table, function () {
                            var userId = null;
                            var tableUpdate = Messages_1.sendTableUpdate(sessionId, userId, message);
                            publish(tableUpdate, function () {
                                publish(table, function () {
                                    reply(Messages_1.createTableSuccess(tableId));
                                });
                            });
                        });
                    });
                }
                else {
                    reply(Messages_1.createTableFailure(tableId, "table " + tableId + " exists"));
                }
            });
        }
        else {
            reply(Messages_1.createTableFailure(tableId, sessionId + " unknown session"));
        }
    });
    /*
    if (checkSessionId(creatorId, sessionId)) {
      if (!tableUpdates.has(tableId)) {
        tableUpdates.set(tableId, new Map<Version, any>())
  
        const version = 0
        const tableUpdate = tableUpdates.get(tableId)
        tableUpdate.set(version, message)
  
        const table: Table = {
          tableId: tableId,
          tableName: tableName,
          version: version,
          columns: columns,
          rows:  new Array<Row>(),
          creatorId: creatorId,
        }
  
        tables.set(tableId, table)
  
        console.log(`create table\n${JSON.stringify(table)}\n${tableUpdate}`)
  
        publishTableUpdate(message)
        publishTableSnap(table)
        return createTableSuccess(tableId)
      }
      else {
        return createTableFailure(tableId, `table ${tableId} exists`)
      }
    }
    else {
      return createTableFailure(tableId, 'unknown session')
    }
    */
}
function handleSubscribeTables(reply, message) {
    var pl = message.payLoad;
    var uncheckedSessionId = pl.sessionId;
    var subscriberId = pl.subscriberId;
    db.getSessionId(subscriberId, function (sessionId) {
        if (sessionId && sessionId === uncheckedSessionId) {
            db.setSubscriber(sessionId, subscriberId, function () {
                db.getTables(function (tables) {
                    if (tables) {
                        tables.forEach(function (table, _) {
                            console.log(table);
                            reply(Messages_1.sendTableSnap(sessionId, subscriberId, table));
                            reply(Messages_1.subscribeTablesSuccess(sessionId, subscriberId));
                        });
                    }
                });
            });
        }
        else {
            reply(Messages_1.subscribeTablesFailure(sessionId, subscriberId, "subscriberId: " + subscriberId + " not login"));
        }
    });
}
// function checkSessionId(userId: UserId, sessionId: SessionId) {
//   return (userIdToSessionId.has(userId) && userIdToSessionId.get(userId) === sessionId)
// }
function handleMessage(ws, message) {
    var reply = Reply(ws);
    switch (message.msgType) {
        case Messages_1.MsgType.Login:
            handleLogin(ws, reply, message.payLoad.userId, message.payLoad.password);
            break;
        case Messages_1.MsgType.Logout:
            handleLogout(reply, message.payLoad.userId);
            break;
        case Messages_1.MsgType.CreateUser:
            handleCreateUser(reply, message.payLoad.sessionId, message.payLoad.userId, message.payLoad.userName, message.payLoad.password, message.payLoad.creatorId);
            break;
        case Messages_1.MsgType.CreateTable:
            handleCreateTable(reply, message);
            break;
        case Messages_1.MsgType.AppendRow:
            handleAppendRow(reply, message);
            break;
        case Messages_1.MsgType.RemoveRow:
            handleRemoveRow(reply, message);
            break;
        case Messages_1.MsgType.UpdateCell:
            handleUpdateCell(reply, message);
            break;
        case Messages_1.MsgType.SubscribeTables:
            handleSubscribeTables(reply, message);
        default:
            console.log("Unknown Msg");
            break;
    }
}
function handleConnection(ws) {
    ws.on('message', function (msg) {
        var message = JSON.parse(msg.toString());
        var return_message = handleMessage(ws, message);
        // if (!return_message) {
        //   ws.send(return_message)
        // }
    });
}
wss.on('connection', handleConnection);
//# sourceMappingURL=server.js.map