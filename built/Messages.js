"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MsgType;
(function (MsgType) {
    MsgType["CreateUser"] = "createUser";
    MsgType["CreateUserSuccess"] = "createUserSuccess";
    MsgType["CreateUserFailure"] = "createUserFailure";
    MsgType["CreateTable"] = "createTable";
    MsgType["CreateTableSuccess"] = "createTableSuccess";
    MsgType["CreateTableFailure"] = "createTableFailure";
    MsgType["AppendRow"] = "appendRow";
    MsgType["AppendRowSuccess"] = "appendRowSuccess";
    MsgType["AppendRowFailure"] = "appendRowFailure";
    MsgType["RemoveRow"] = "removeRow";
    MsgType["RemoveRowSuccess"] = "removeRowSuccess";
    MsgType["RemoveRowFailure"] = "removeRowFailure";
    MsgType["UpdateCell"] = "updateCell";
    MsgType["UpdateCellSuccess"] = "updateCellSuccess";
    MsgType["UpdateCellFailure"] = "updateCellFailure";
    MsgType["Login"] = "login";
    MsgType["LoginSuccess"] = "loginSuccess";
    MsgType["LoginFailure"] = "loginFailure";
    MsgType["Logout"] = "logout";
    MsgType["LogoutSuccess"] = "logoutSuccess";
    MsgType["LogoutFailure"] = "logoutFailure";
})(MsgType = exports.MsgType || (exports.MsgType = {}));
function createUser(sessionId, userId, userName, password, creatorId) {
    var msg = {
        msgType: MsgType.CreateUser,
        payLoad: {
            sessionId: sessionId,
            userId: userId,
            password: password,
            userName: userName,
            creatorId: creatorId,
        }
    };
    return JSON.stringify(msg);
}
exports.createUser = createUser;
function createTable(sessionId, tableId, tableName, columns, creatorId) {
    var msg = {
        msgType: MsgType.CreateTable,
        payLoad: {
            sessionId: sessionId,
            tableId: tableId,
            tableName: tableName,
            columns: columns,
            creatorId: creatorId
        }
    };
    return JSON.stringify(msg);
}
exports.createTable = createTable;
function appendTableRow(sessionId, tableId, rowId, values, updatorId) {
    var msg = {
        msgType: MsgType.AppendRow,
        payLoad: {
            sessionId: sessionId,
            tableId: tableId,
            rowId: rowId,
            values: values,
            updatorId: updatorId
        }
    };
    return JSON.stringify(msg);
}
exports.appendTableRow = appendTableRow;
function removeTableRow(sessionId, tableId, rowId, updatorId) {
    var msg = {
        msgType: MsgType.RemoveRow,
        payLoad: {
            sessionId: sessionId,
            tableId: tableId,
            rowId: rowId,
            updatorId: updatorId
        }
    };
    return JSON.stringify(msg);
}
exports.removeTableRow = removeTableRow;
function updateCell(sessionId, tableId, rowId, columnName, value, updatorId) {
    var msg = {
        msgType: MsgType.UpdateCell,
        payLoad: {
            sessionId: sessionId,
            tableId: tableId,
            rowId: rowId,
            columnName: columnName,
            value: value,
            updatorId: updatorId
        }
    };
    return JSON.stringify(msg);
}
exports.updateCell = updateCell;
function login(userId, password) {
    var msg = {
        msgType: MsgType.Login,
        payLoad: {
            userId: userId,
            password: password
        }
    };
    return JSON.stringify(msg);
}
exports.login = login;
function logout(userId) {
    var msg = {
        msgType: MsgType.Logout,
        payLoad: {
            userId: userId
        }
    };
    return JSON.stringify(msg);
}
exports.logout = logout;
function loginSuccess(sessionId) {
    var msg = {
        msgType: MsgType.LoginSuccess,
        payLoad: {
            sessionId: sessionId
        }
    };
    return JSON.stringify(msg);
}
exports.loginSuccess = loginSuccess;
function loginFailure(reason) {
    var msg = {
        msgType: MsgType.LoginFailure,
        payLoad: {
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.loginFailure = loginFailure;
function logoutSuccess() {
    var msg = {
        msgType: MsgType.LogoutSuccess,
    };
    return JSON.stringify(msg);
}
exports.logoutSuccess = logoutSuccess;
function logoutFailure(reason) {
    var msg = {
        msgType: MsgType.LogoutFailure,
        payLoad: {
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.logoutFailure = logoutFailure;
function createUserSuccess() {
    var msg = {
        msgType: MsgType.CreateUserSuccess,
    };
    return JSON.stringify(msg);
}
exports.createUserSuccess = createUserSuccess;
function createUserFailure(reason) {
    var msg = {
        msgType: MsgType.CreateUserFailure,
        payLoad: {
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.createUserFailure = createUserFailure;
function createTableSuccess(tableId) {
    var msg = {
        msgType: MsgType.CreateTableSuccess,
        payLoad: {
            tableId: tableId
        }
    };
    return JSON.stringify(msg);
}
exports.createTableSuccess = createTableSuccess;
function createTableFailure(tableId, reason) {
    var msg = {
        msgType: MsgType.CreateTableFailure,
        payLoad: {
            tableId: tableId,
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.createTableFailure = createTableFailure;
function appendTableRowSuccess(rowId) {
    var msg = {
        msgType: MsgType.AppendRowSuccess,
        payLoad: {
            rowId: rowId
        }
    };
    return JSON.stringify(msg);
}
exports.appendTableRowSuccess = appendTableRowSuccess;
function appendTableRowFailure(rowId, reason) {
    var msg = {
        msgType: MsgType.AppendRowFailure,
        payLoad: {
            rowId: rowId,
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.appendTableRowFailure = appendTableRowFailure;
function removeTableRowSuccess(rowId) {
    var msg = {
        msgType: MsgType.RemoveRowSuccess,
        payLoad: {
            rowId: rowId
        }
    };
    return JSON.stringify(msg);
}
exports.removeTableRowSuccess = removeTableRowSuccess;
function removeTableRowFailure(rowId, reason) {
    var msg = {
        msgType: MsgType.RemoveRowFailure,
        payLoad: {
            rowId: rowId,
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.removeTableRowFailure = removeTableRowFailure;
function updateCellSuccess(tableId, rowId, columnName) {
    var msg = {
        msgType: MsgType.UpdateCellSuccess,
        payLoad: {
            tableId: tableId,
            rowId: rowId,
            columnName: columnName
        }
    };
    return JSON.stringify(msg);
}
exports.updateCellSuccess = updateCellSuccess;
function updateCellFailure(tableId, rowId, columnName, reason) {
    var msg = {
        msgType: MsgType.UpdateCellFailure,
        payLoad: {
            tableId: tableId,
            rowId: rowId,
            columnName: columnName,
            reason: reason
        }
    };
    return JSON.stringify(msg);
}
exports.updateCellFailure = updateCellFailure;
//# sourceMappingURL=Messages.js.map