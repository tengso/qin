"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MsgType;
(function (MsgType) {
    MsgType["Login"] = "login";
    MsgType["Logout"] = "logout";
    MsgType["CreateUser"] = "createUser";
    MsgType["CreateTable"] = "createTable";
    MsgType["AppendRow"] = "appendRow";
    MsgType["RemoveRow"] = "removeRow";
    MsgType["LoginSuccess"] = "loginSuccess";
    MsgType["LoginFailure"] = "loginFailure";
    MsgType["LogoutSuccess"] = "logoutSuccess";
    MsgType["LogoutFailure"] = "logoutFailure";
})(MsgType = exports.MsgType || (exports.MsgType = {}));
function createUser(sessionId, userName, creatorId) {
    var msg = {
        msgType: MsgType.CreateUser,
        payLoad: {
            sessionId: sessionId,
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
            talbeId: tableId,
            rowId: rowId,
            updatorId: updatorId
        }
    };
    return JSON.stringify(msg);
}
exports.removeTableRow = removeTableRow;
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
//# sourceMappingURL=Messages.js.map