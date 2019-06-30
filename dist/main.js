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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar MsgType;\n(function (MsgType) {\n    MsgType[\"CreateUser\"] = \"createUser\";\n    MsgType[\"CreateUserSuccess\"] = \"createUserSuccess\";\n    MsgType[\"CreateUserFailure\"] = \"createUserFailure\";\n    MsgType[\"CreateTable\"] = \"createTable\";\n    MsgType[\"CreateTableSuccess\"] = \"createTableSuccess\";\n    MsgType[\"CreateTableFailure\"] = \"createTableFailure\";\n    MsgType[\"AppendRow\"] = \"appendRow\";\n    MsgType[\"AppendRowSuccess\"] = \"appendRowSuccess\";\n    MsgType[\"AppendRowFailure\"] = \"appendRowFailure\";\n    MsgType[\"RemoveRow\"] = \"removeRow\";\n    MsgType[\"RemoveRowSuccess\"] = \"removeRowSuccess\";\n    MsgType[\"RemoveRowFailure\"] = \"removeRowFailure\";\n    MsgType[\"UpdateCell\"] = \"updateCell\";\n    MsgType[\"UpdateCellSuccess\"] = \"updateCellSuccess\";\n    MsgType[\"UpdateCellFailure\"] = \"updateCellFailure\";\n    MsgType[\"Login\"] = \"login\";\n    MsgType[\"LoginSuccess\"] = \"loginSuccess\";\n    MsgType[\"LoginFailure\"] = \"loginFailure\";\n    MsgType[\"Logout\"] = \"logout\";\n    MsgType[\"LogoutSuccess\"] = \"logoutSuccess\";\n    MsgType[\"LogoutFailure\"] = \"logoutFailure\";\n    MsgType[\"SubscribeTables\"] = \"subscribeTables\";\n    MsgType[\"SubscribeTablesSuccess\"] = \"subscribeTablesSuccess\";\n    MsgType[\"SubscribeTablesFailure\"] = \"subscribeTablesFailure\";\n    MsgType[\"TableUpdate\"] = \"tableUpdate\";\n    MsgType[\"TableSnap\"] = \"tableSnap\";\n})(MsgType = exports.MsgType || (exports.MsgType = {}));\nfunction createUser(sessionId, userId, userName, password, creatorId) {\n    var msg = {\n        msgType: MsgType.CreateUser,\n        payLoad: {\n            sessionId: sessionId,\n            userId: userId,\n            password: password,\n            userName: userName,\n            creatorId: creatorId,\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.createUser = createUser;\nfunction createTable(sessionId, tableId, tableName, columns, creatorId) {\n    var msg = {\n        msgType: MsgType.CreateTable,\n        payLoad: {\n            sessionId: sessionId,\n            tableId: tableId,\n            tableName: tableName,\n            columns: columns,\n            creatorId: creatorId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.createTable = createTable;\nfunction appendTableRow(sessionId, tableId, rowId, values, updatorId) {\n    var msg = {\n        msgType: MsgType.AppendRow,\n        payLoad: {\n            sessionId: sessionId,\n            tableId: tableId,\n            rowId: rowId,\n            values: values,\n            updatorId: updatorId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.appendTableRow = appendTableRow;\nfunction removeTableRow(sessionId, tableId, rowId, updatorId) {\n    var msg = {\n        msgType: MsgType.RemoveRow,\n        payLoad: {\n            sessionId: sessionId,\n            tableId: tableId,\n            rowId: rowId,\n            updatorId: updatorId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.removeTableRow = removeTableRow;\nfunction updateCell(sessionId, tableId, rowId, columnName, value, updatorId) {\n    var msg = {\n        msgType: MsgType.UpdateCell,\n        payLoad: {\n            sessionId: sessionId,\n            tableId: tableId,\n            rowId: rowId,\n            columnName: columnName,\n            value: value,\n            updatorId: updatorId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.updateCell = updateCell;\nfunction subscribeTables(sessionId, subscriberId) {\n    var msg = {\n        msgType: MsgType.SubscribeTables,\n        payLoad: {\n            sessionId: sessionId,\n            subscriberId: subscriberId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.subscribeTables = subscribeTables;\nfunction subscribeTablesSuccess(sessionId, subscriberId) {\n    var msg = {\n        msgType: MsgType.SubscribeTablesSuccess,\n        payLoad: {\n            sessionId: sessionId,\n            subscriberId: subscriberId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.subscribeTablesSuccess = subscribeTablesSuccess;\nfunction subscribeTablesFailure(sessionId, subscriberId, reason) {\n    var msg = {\n        msgType: MsgType.SubscribeTablesFailure,\n        payLoad: {\n            sessionId: sessionId,\n            subscriberId: subscriberId,\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.subscribeTablesFailure = subscribeTablesFailure;\nfunction login(userId, password) {\n    var msg = {\n        msgType: MsgType.Login,\n        payLoad: {\n            userId: userId,\n            password: password\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.login = login;\nfunction logout(userId) {\n    var msg = {\n        msgType: MsgType.Logout,\n        payLoad: {\n            userId: userId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.logout = logout;\nfunction loginSuccess(sessionId) {\n    var msg = {\n        msgType: MsgType.LoginSuccess,\n        payLoad: {\n            sessionId: sessionId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.loginSuccess = loginSuccess;\nfunction loginFailure(reason) {\n    var msg = {\n        msgType: MsgType.LoginFailure,\n        payLoad: {\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.loginFailure = loginFailure;\nfunction logoutSuccess() {\n    var msg = {\n        msgType: MsgType.LogoutSuccess,\n    };\n    return JSON.stringify(msg);\n}\nexports.logoutSuccess = logoutSuccess;\nfunction logoutFailure(reason) {\n    var msg = {\n        msgType: MsgType.LogoutFailure,\n        payLoad: {\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.logoutFailure = logoutFailure;\nfunction createUserSuccess() {\n    var msg = {\n        msgType: MsgType.CreateUserSuccess,\n    };\n    return JSON.stringify(msg);\n}\nexports.createUserSuccess = createUserSuccess;\nfunction createUserFailure(reason) {\n    var msg = {\n        msgType: MsgType.CreateUserFailure,\n        payLoad: {\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.createUserFailure = createUserFailure;\nfunction createTableSuccess(tableId) {\n    var msg = {\n        msgType: MsgType.CreateTableSuccess,\n        payLoad: {\n            tableId: tableId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.createTableSuccess = createTableSuccess;\nfunction createTableFailure(tableId, reason) {\n    var msg = {\n        msgType: MsgType.CreateTableFailure,\n        payLoad: {\n            tableId: tableId,\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.createTableFailure = createTableFailure;\nfunction appendTableRowSuccess(rowId) {\n    var msg = {\n        msgType: MsgType.AppendRowSuccess,\n        payLoad: {\n            rowId: rowId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.appendTableRowSuccess = appendTableRowSuccess;\nfunction appendTableRowFailure(rowId, reason) {\n    var msg = {\n        msgType: MsgType.AppendRowFailure,\n        payLoad: {\n            rowId: rowId,\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.appendTableRowFailure = appendTableRowFailure;\nfunction removeTableRowSuccess(rowId) {\n    var msg = {\n        msgType: MsgType.RemoveRowSuccess,\n        payLoad: {\n            rowId: rowId\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.removeTableRowSuccess = removeTableRowSuccess;\nfunction removeTableRowFailure(rowId, reason) {\n    var msg = {\n        msgType: MsgType.RemoveRowFailure,\n        payLoad: {\n            rowId: rowId,\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.removeTableRowFailure = removeTableRowFailure;\nfunction updateCellSuccess(tableId, rowId, columnName) {\n    var msg = {\n        msgType: MsgType.UpdateCellSuccess,\n        payLoad: {\n            tableId: tableId,\n            rowId: rowId,\n            columnName: columnName\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.updateCellSuccess = updateCellSuccess;\nfunction updateCellFailure(tableId, rowId, columnName, reason) {\n    var msg = {\n        msgType: MsgType.UpdateCellFailure,\n        payLoad: {\n            tableId: tableId,\n            rowId: rowId,\n            columnName: columnName,\n            reason: reason\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.updateCellFailure = updateCellFailure;\nfunction sendTableSnap(sessionId, subscriberId, table) {\n    var msg = {\n        msgType: MsgType.TableSnap,\n        payLoad: {\n            sessionId: sessionId,\n            subscriberId: subscriberId,\n            table: table\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.sendTableSnap = sendTableSnap;\nfunction sendTableUpdate(sessionId, subscriberId, update) {\n    var msg = {\n        msgType: MsgType.TableUpdate,\n        payLoad: {\n            sessionId: sessionId,\n            subscriberId: subscriberId,\n            update: update\n        }\n    };\n    return JSON.stringify(msg);\n}\nexports.sendTableUpdate = sendTableUpdate;\n//# sourceMappingURL=Messages.js.map\n\n//# sourceURL=webpack:///./built/Messages.js?");

/***/ }),

/***/ "./built/client.js":
/*!*************************!*\
  !*** ./built/client.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Messages_1 = __webpack_require__(/*! ./Messages */ \"./built/Messages.js\");\n// FIXME: use import\nvar uuid = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n// const WebSocket = require('ws');\nvar Client = /** @class */ (function () {\n    function Client(host, port, callback) {\n        var _this = this;\n        var url = \"ws://\" + host + \":\" + port;\n        this.connection = new WebSocket(url);\n        this.callback = callback;\n        this.connection.onopen = function () {\n            _this.listen();\n            console.log('connected');\n        };\n        this.connection.onerror = function (error) {\n            console.log(\"WebSocket error: \" + error);\n        };\n    }\n    Client.prototype.login = function (userId, password) {\n        this.userId = userId;\n        this.password = password;\n        this.connection.send(Messages_1.login(this.userId, this.password));\n    };\n    Client.prototype.logout = function () {\n        this.connection.send(Messages_1.logout(this.userId));\n    };\n    Client.prototype.createUser = function (userId, userName, password) {\n        this.connection.send(Messages_1.createUser(this.sessionId, userId, userName, password, this.userId));\n    };\n    Client.prototype.createTable = function (tableName, columns) {\n        var tableId = uuid();\n        this.connection.send(Messages_1.createTable(this.sessionId, tableId, tableName, columns, this.userId));\n    };\n    Client.prototype.subscribeTables = function () {\n        this.connection.send(Messages_1.subscribeTables(this.sessionId, this.userId));\n    };\n    Client.prototype.appendRow = function (tableId, values) {\n        var rowId = uuid();\n        this.connection.send(Messages_1.appendTableRow(this.sessionId, tableId, rowId, values, this.userId));\n    };\n    Client.prototype.removeRow = function (tableId, rowId) {\n        this.connection.send(Messages_1.removeTableRow(this.sessionId, tableId, rowId, this.userId));\n    };\n    Client.prototype.updateCell = function (tableId, rowId, columnName, newValue) {\n        this.connection.send(Messages_1.updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId));\n    };\n    Client.prototype.listen = function () {\n        var _this = this;\n        this.connection.onmessage = function (e) {\n            var returnMsg = JSON.parse(e.data.toString());\n            switch (returnMsg.msgType) {\n                case Messages_1.MsgType.LoginSuccess: {\n                    _this.sessionId = returnMsg.payLoad.sessionId;\n                    _this.callback.loginSuccess(_this.sessionId);\n                    break;\n                }\n                case Messages_1.MsgType.CreateUserSuccess: {\n                    _this.callback.createUserSuccess();\n                    break;\n                }\n                case Messages_1.MsgType.CreateTableSuccess: {\n                    _this.callback.createTableSuccess(returnMsg.payLoad.tableId);\n                    break;\n                }\n                case Messages_1.MsgType.SubscribeTablesSuccess: {\n                    _this.callback.subscribeTablesSuccess();\n                    break;\n                }\n                case Messages_1.MsgType.AppendRowSuccess: {\n                    _this.callback.appendRowSuccess(returnMsg.payLoad.rowId);\n                    break;\n                }\n                case Messages_1.MsgType.RemoveRowSuccess: {\n                    _this.callback.removeRowSuccess(returnMsg.payLoad.rowId);\n                    break;\n                }\n                case Messages_1.MsgType.UpdateCellSuccess: {\n                    _this.callback.updateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId, returnMsg.payLoad.columnName);\n                    break;\n                }\n                case Messages_1.MsgType.LogoutSuccess: {\n                    _this.sessionId = undefined;\n                    _this.userId = undefined;\n                    _this.password = undefined;\n                    _this.callback.logoutSuccess();\n                    break;\n                }\n                case Messages_1.MsgType.TableSnap: {\n                    _this.callback.tableSnap(returnMsg.payLoad.table);\n                    break;\n                }\n                case Messages_1.MsgType.TableUpdate: {\n                    var update = returnMsg.payLoad.update;\n                    switch (update.updateType) {\n                        case Messages_1.MsgType.AppendRow:\n                            _this.callback.appendRow(update.tableId, update.rowId, update.values);\n                            break;\n                        case Messages_1.MsgType.RemoveRow:\n                            _this.callback.removeRow(update.rowId);\n                            break;\n                        case Messages_1.MsgType.UpdateCell:\n                            _this.callback.updateCell(update.rowId, update.columnIndex, update.value);\n                            break;\n                        default:\n                            console.log(\"unknown update type: \" + update.updateType);\n                    }\n                    break;\n                }\n                case Messages_1.MsgType.AppendRowFailure: {\n                    console.error(\"append row failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.LoginFailure: {\n                    console.error(\"login failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.CreateUserFailure: {\n                    console.error(\"create user failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.CreateTableFailure: {\n                    console.error(\"create table failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.UpdateCellFailure: {\n                    console.error(\"update cell failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.RemoveRowFailure: {\n                    console.error(\"remove row failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.LogoutFailure: {\n                    console.error(\"logout failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                case Messages_1.MsgType.SubscribeTablesFailure: {\n                    console.error(\"subscribe table failure: \" + returnMsg.payLoad.reason);\n                    break;\n                }\n                default: {\n                    console.error(\"unknown msg: \" + returnMsg);\n                    break;\n                }\n            }\n        };\n    };\n    return Client;\n}());\n// @ts-ignore\nwindow.Client = Client;\n//# sourceMappingURL=client.js.map\n\n//# sourceURL=webpack:///./built/client.js?");

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