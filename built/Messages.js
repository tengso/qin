"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function createUser(userId, userName, creatorId) {
    return "\n        msgType: createUser\n        payLoad: {\n            userId: " + userId + ",\n            userName: " + userName + ",\n            createrId: " + creatorId + ",\n        }\n        ";
}
exports.createUser = createUser;
function createTable(tableId, tableName, columns, createrId) {
    return "\n        msgType: create_table\n        payLoad: {\n            tableId: " + tableId + ",\n            tableName: " + tableName + ",\n            columns: " + __assign({}, columns) + ",\n            createrId: " + createrId + ",\n        }\n    ";
}
exports.createTable = createTable;
function appendTableRow(rowId, values, appenderId) {
    return "\n        msgType: appendRow\n        payLoad: {\n            rowId: " + rowId + ",\n            values: " + __assign({}, values) + ",\n            appenderId: " + appenderId + ",\n        }\n    ";
}
exports.appendTableRow = appendTableRow;
function removeTableRow(rowId, removerId) {
    return "\n        msgType: removeRow\n        payLoad: {\n            rowId: " + rowId + ",\n            removerId: " + removerId + ",\n        }\n    ";
}
exports.removeTableRow = removeTableRow;
