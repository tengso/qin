/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./built/client.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./built/Messages.js":
/*!***************************!*\
  !*** ./built/Messages.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar MsgType;\r\n(function (MsgType) {\r\n    MsgType[\"CreateUser\"] = \"createUser\";\r\n    MsgType[\"CreateUserSuccess\"] = \"createUserSuccess\";\r\n    MsgType[\"CreateUserFailure\"] = \"createUserFailure\";\r\n    MsgType[\"CreateTable\"] = \"createTable\";\r\n    MsgType[\"CreateTableSuccess\"] = \"createTableSuccess\";\r\n    MsgType[\"CreateTableFailure\"] = \"createTableFailure\";\r\n    MsgType[\"AppendRow\"] = \"appendRow\";\r\n    MsgType[\"AppendRowSuccess\"] = \"appendRowSuccess\";\r\n    MsgType[\"AppendRowFailure\"] = \"appendRowFailure\";\r\n    MsgType[\"RemoveRow\"] = \"removeRow\";\r\n    MsgType[\"RemoveRowSuccess\"] = \"removeRowSuccess\";\r\n    MsgType[\"RemoveRowFailure\"] = \"removeRowFailure\";\r\n    MsgType[\"UpdateCell\"] = \"updateCell\";\r\n    MsgType[\"UpdateCellSuccess\"] = \"updateCellSuccess\";\r\n    MsgType[\"UpdateCellFailure\"] = \"updateCellFailure\";\r\n    MsgType[\"Login\"] = \"login\";\r\n    MsgType[\"LoginSuccess\"] = \"loginSuccess\";\r\n    MsgType[\"LoginFailure\"] = \"loginFailure\";\r\n    MsgType[\"Logout\"] = \"logout\";\r\n    MsgType[\"LogoutSuccess\"] = \"logoutSuccess\";\r\n    MsgType[\"LogoutFailure\"] = \"logoutFailure\";\r\n    MsgType[\"SubscribeTables\"] = \"subscribeTables\";\r\n    MsgType[\"SubscribeTablesSuccess\"] = \"subscribeTablesSuccess\";\r\n    MsgType[\"SubscribeTablesFailure\"] = \"subscribeTablesFailure\";\r\n    MsgType[\"TableUpdate\"] = \"tableUpdate\";\r\n    MsgType[\"TableSnap\"] = \"tableSnap\";\r\n})(MsgType = exports.MsgType || (exports.MsgType = {}));\r\nfunction createUser(sessionId, userId, userName, password, creatorId) {\r\n    var msg = {\r\n        msgType: MsgType.CreateUser,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            userId: userId,\r\n            password: password,\r\n            userName: userName,\r\n            creatorId: creatorId,\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createUser = createUser;\r\nfunction createTable(sessionId, tableId, tableName, columns, creatorId) {\r\n    var msg = {\r\n        msgType: MsgType.CreateTable,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            tableId: tableId,\r\n            tableName: tableName,\r\n            columns: columns,\r\n            creatorId: creatorId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createTable = createTable;\r\nfunction appendTableRow(sessionId, tableId, rowId, values, updatorId) {\r\n    var msg = {\r\n        msgType: MsgType.AppendRow,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            tableId: tableId,\r\n            rowId: rowId,\r\n            values: values,\r\n            updatorId: updatorId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.appendTableRow = appendTableRow;\r\nfunction removeTableRow(sessionId, tableId, rowId, updatorId) {\r\n    var msg = {\r\n        msgType: MsgType.RemoveRow,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            tableId: tableId,\r\n            rowId: rowId,\r\n            updatorId: updatorId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.removeTableRow = removeTableRow;\r\nfunction updateCell(sessionId, tableId, rowId, columnName, value, updatorId) {\r\n    var msg = {\r\n        msgType: MsgType.UpdateCell,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            tableId: tableId,\r\n            rowId: rowId,\r\n            columnName: columnName,\r\n            value: value,\r\n            updatorId: updatorId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.updateCell = updateCell;\r\nfunction subscribeTables(sessionId, subscriberId) {\r\n    var msg = {\r\n        msgType: MsgType.SubscribeTables,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            subscriberId: subscriberId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.subscribeTables = subscribeTables;\r\nfunction subscribeTablesSuccess(sessionId, subscriberId) {\r\n    var msg = {\r\n        msgType: MsgType.SubscribeTablesSuccess,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            subscriberId: subscriberId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.subscribeTablesSuccess = subscribeTablesSuccess;\r\nfunction subscribeTablesFailure(sessionId, subscriberId, reason) {\r\n    var msg = {\r\n        msgType: MsgType.SubscribeTablesFailure,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            subscriberId: subscriberId,\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.subscribeTablesFailure = subscribeTablesFailure;\r\nfunction login(userId, password) {\r\n    var msg = {\r\n        msgType: MsgType.Login,\r\n        payLoad: {\r\n            userId: userId,\r\n            password: password\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.login = login;\r\nfunction logout(userId) {\r\n    var msg = {\r\n        msgType: MsgType.Logout,\r\n        payLoad: {\r\n            userId: userId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.logout = logout;\r\nfunction loginSuccess(sessionId) {\r\n    var msg = {\r\n        msgType: MsgType.LoginSuccess,\r\n        payLoad: {\r\n            sessionId: sessionId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.loginSuccess = loginSuccess;\r\nfunction loginFailure(reason) {\r\n    var msg = {\r\n        msgType: MsgType.LoginFailure,\r\n        payLoad: {\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.loginFailure = loginFailure;\r\nfunction logoutSuccess() {\r\n    var msg = {\r\n        msgType: MsgType.LogoutSuccess,\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.logoutSuccess = logoutSuccess;\r\nfunction logoutFailure(reason) {\r\n    var msg = {\r\n        msgType: MsgType.LogoutFailure,\r\n        payLoad: {\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.logoutFailure = logoutFailure;\r\nfunction createUserSuccess() {\r\n    var msg = {\r\n        msgType: MsgType.CreateUserSuccess,\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createUserSuccess = createUserSuccess;\r\nfunction createUserFailure(reason) {\r\n    var msg = {\r\n        msgType: MsgType.CreateUserFailure,\r\n        payLoad: {\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createUserFailure = createUserFailure;\r\nfunction createTableSuccess(tableId) {\r\n    var msg = {\r\n        msgType: MsgType.CreateTableSuccess,\r\n        payLoad: {\r\n            tableId: tableId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createTableSuccess = createTableSuccess;\r\nfunction createTableFailure(tableId, reason) {\r\n    var msg = {\r\n        msgType: MsgType.CreateTableFailure,\r\n        payLoad: {\r\n            tableId: tableId,\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.createTableFailure = createTableFailure;\r\nfunction appendTableRowSuccess(rowId) {\r\n    var msg = {\r\n        msgType: MsgType.AppendRowSuccess,\r\n        payLoad: {\r\n            rowId: rowId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.appendTableRowSuccess = appendTableRowSuccess;\r\nfunction appendTableRowFailure(rowId, reason) {\r\n    var msg = {\r\n        msgType: MsgType.AppendRowFailure,\r\n        payLoad: {\r\n            rowId: rowId,\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.appendTableRowFailure = appendTableRowFailure;\r\nfunction removeTableRowSuccess(rowId) {\r\n    var msg = {\r\n        msgType: MsgType.RemoveRowSuccess,\r\n        payLoad: {\r\n            rowId: rowId\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.removeTableRowSuccess = removeTableRowSuccess;\r\nfunction removeTableRowFailure(rowId, reason) {\r\n    var msg = {\r\n        msgType: MsgType.RemoveRowFailure,\r\n        payLoad: {\r\n            rowId: rowId,\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.removeTableRowFailure = removeTableRowFailure;\r\nfunction updateCellSuccess(tableId, rowId, columnName) {\r\n    var msg = {\r\n        msgType: MsgType.UpdateCellSuccess,\r\n        payLoad: {\r\n            tableId: tableId,\r\n            rowId: rowId,\r\n            columnName: columnName\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.updateCellSuccess = updateCellSuccess;\r\nfunction updateCellFailure(tableId, rowId, columnName, reason) {\r\n    var msg = {\r\n        msgType: MsgType.UpdateCellFailure,\r\n        payLoad: {\r\n            tableId: tableId,\r\n            rowId: rowId,\r\n            columnName: columnName,\r\n            reason: reason\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.updateCellFailure = updateCellFailure;\r\nfunction sendTableSnap(sessionId, subscriberId, table) {\r\n    var msg = {\r\n        msgType: MsgType.TableSnap,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            subscriberId: subscriberId,\r\n            table: table\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.sendTableSnap = sendTableSnap;\r\nfunction sendTableUpdate(sessionId, subscriberId, update) {\r\n    var msg = {\r\n        msgType: MsgType.TableUpdate,\r\n        payLoad: {\r\n            sessionId: sessionId,\r\n            subscriberId: subscriberId,\r\n            update: update\r\n        }\r\n    };\r\n    return JSON.stringify(msg);\r\n}\r\nexports.sendTableUpdate = sendTableUpdate;\r\n//# sourceMappingURL=Messages.js.map\n\n//# sourceURL=webpack:///./built/Messages.js?");

/***/ }),

/***/ "./built/client.js":
/*!*************************!*\
  !*** ./built/client.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Messages_1 = __webpack_require__(/*! ./Messages */ \"./built/Messages.js\");\r\n// FIXME: use import\r\nvar uuid = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\r\n// const WebSocket = require('ws');\r\nvar Client = /** @class */ (function () {\r\n    function Client(host, port, callback) {\r\n        var _this = this;\r\n        var url = \"ws://\" + host + \":\" + port;\r\n        this.connection = new WebSocket(url);\r\n        this.callback = callback;\r\n        this.connection.onopen = function () {\r\n            _this.listen();\r\n            console.log('connected');\r\n        };\r\n        this.connection.onerror = function (error) {\r\n            console.log(\"WebSocket error: \" + error);\r\n        };\r\n    }\r\n    Client.prototype.login = function (userId, password) {\r\n        this.userId = userId;\r\n        this.password = password;\r\n        this.connection.send(Messages_1.login(this.userId, this.password));\r\n    };\r\n    Client.prototype.logout = function () {\r\n        this.connection.send(Messages_1.logout(this.userId));\r\n    };\r\n    Client.prototype.createUser = function (userId, userName, password) {\r\n        this.connection.send(Messages_1.createUser(this.sessionId, userId, userName, password, this.userId));\r\n    };\r\n    Client.prototype.createTable = function (tableName, columns) {\r\n        var tableId = uuid();\r\n        this.connection.send(Messages_1.createTable(this.sessionId, tableId, tableName, columns, this.userId));\r\n    };\r\n    Client.prototype.subscribeTables = function () {\r\n        this.connection.send(Messages_1.subscribeTables(this.sessionId, this.userId));\r\n    };\r\n    Client.prototype.appendRow = function (tableId, values) {\r\n        var rowId = uuid();\r\n        this.connection.send(Messages_1.appendTableRow(this.sessionId, tableId, rowId, values, this.userId));\r\n    };\r\n    Client.prototype.removeRow = function (tableId, rowId) {\r\n        this.connection.send(Messages_1.removeTableRow(this.sessionId, tableId, rowId, this.userId));\r\n    };\r\n    Client.prototype.updateCell = function (tableId, rowId, columnName, newValue) {\r\n        this.connection.send(Messages_1.updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId));\r\n    };\r\n    Client.prototype.listen = function () {\r\n        var _this = this;\r\n        this.connection.onmessage = function (e) {\r\n            var returnMsg = JSON.parse(e.data.toString());\r\n            switch (returnMsg.msgType) {\r\n                case Messages_1.MsgType.LoginSuccess: {\r\n                    _this.sessionId = returnMsg.payLoad.sessionId;\r\n                    _this.callback.loginSuccess(_this.sessionId);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.CreateUserSuccess: {\r\n                    _this.callback.createUserSuccess();\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.CreateTableSuccess: {\r\n                    _this.callback.createTableSuccess(returnMsg.payLoad.tableId);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.SubscribeTablesSuccess: {\r\n                    _this.callback.subscribeTablesSuccess();\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.AppendRowSuccess: {\r\n                    _this.callback.appendRowSuccess(returnMsg.payLoad.rowId);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.RemoveRowSuccess: {\r\n                    _this.callback.removeRowSuccess(returnMsg.payLoad.rowId);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.UpdateCellSuccess: {\r\n                    _this.callback.updateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId, returnMsg.payLoad.columnName);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.LogoutSuccess: {\r\n                    _this.sessionId = undefined;\r\n                    _this.userId = undefined;\r\n                    _this.password = undefined;\r\n                    _this.callback.logoutSuccess();\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.TableSnap: {\r\n                    _this.callback.tableSnap(returnMsg.payLoad.table);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.TableUpdate: {\r\n                    var update = returnMsg.payLoad.update;\r\n                    switch (update.updateType) {\r\n                        case Messages_1.MsgType.AppendRow:\r\n                            _this.callback.appendRow(update.tableId, update.rowId, update.values);\r\n                            break;\r\n                        case Messages_1.MsgType.RemoveRow:\r\n                            _this.callback.removeRow(update.rowId);\r\n                            break;\r\n                        case Messages_1.MsgType.UpdateCell:\r\n                            _this.callback.updateCell(update.rowId, update.columnIndex, update.value);\r\n                            break;\r\n                        default:\r\n                            console.log(\"unknown update type: \" + update.updateType);\r\n                    }\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.AppendRowFailure: {\r\n                    console.error(\"append row failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.LoginFailure: {\r\n                    console.error(\"login failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.CreateUserFailure: {\r\n                    console.error(\"create user failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.CreateTableFailure: {\r\n                    console.error(\"create table failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.UpdateCellFailure: {\r\n                    console.error(\"update cell failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.RemoveRowFailure: {\r\n                    console.error(\"remove row failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.LogoutFailure: {\r\n                    console.error(\"logout failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                case Messages_1.MsgType.SubscribeTablesFailure: {\r\n                    console.error(\"subscribe table failure: \" + returnMsg.payLoad.reason);\r\n                    break;\r\n                }\r\n                default: {\r\n                    console.error(\"unknown msg: \" + returnMsg);\r\n                    break;\r\n                }\r\n            }\r\n        };\r\n    };\r\n    return Client;\r\n}());\r\n// @ts-ignore\r\nwindow.Client = Client;\r\n//# sourceMappingURL=client.js.map\n\n//# sourceURL=webpack:///./built/client.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4\n  return ([bth[buf[i++]], bth[buf[i++]], \n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]]]).join('');\n}\n\nmodule.exports = bytesToUuid;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/bytesToUuid.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Unique ID creation requires a high quality random # generator.  In the\n// browser this is a little complicated due to unknown quality of Math.random()\n// and inconsistent support for the `crypto` API.  We do the best we can via\n// feature-detection\n\n// getRandomValues needs to be invoked in a context where \"this\" is a Crypto\n// implementation. Also, find the complete implementation of crypto on IE11.\nvar getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||\n                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));\n\nif (getRandomValues) {\n  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto\n  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef\n\n  module.exports = function whatwgRNG() {\n    getRandomValues(rnds8);\n    return rnds8;\n  };\n} else {\n  // Math.random()-based (RNG)\n  //\n  // If all else fails, use Math.random().  It's fast, but is of unspecified\n  // quality.\n  var rnds = new Array(16);\n\n  module.exports = function mathRNG() {\n    for (var i = 0, r; i < 16; i++) {\n      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;\n      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;\n    }\n\n    return rnds;\n  };\n}\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/rng-browser.js?");

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var rng = __webpack_require__(/*! ./lib/rng */ \"./node_modules/uuid/lib/rng-browser.js\");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ \"./node_modules/uuid/lib/bytesToUuid.js\");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == 'string') {\n    buf = options === 'binary' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/v4.js?");

/***/ })

/******/ });