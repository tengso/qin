// FIXME: use import
import { MsgType, createUser, login, logout, loginSuccess, SessionId, createTable, appendTableRow,
removeTableRow, updateCell, updateCellSuccess, updateCellFailure, subscribeTables } from './Messages';

const uuid = require('uuid/v4')

let userId = 'root'
let password = 'root'

let newUserId = 'song'
let newUserName = 'Song Teng' 
let newUserPassword = 'java' 

// let userId = newUserId
// let password = newUserPassword

const tableId = uuid()
const tableName = 'table_name'
const columns = ['col_1', 'col_2', 'col_3']

const rowId = uuid()
const values = ['val_1', 'val_2', 'val_3']

const WebSocket = require('ws');

const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
  connection.send(login(userId, password))
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

let sessionId: SessionId

connection.onmessage = (e) => {
  const returnMsg = JSON.parse(e.data.toString())

  switch (returnMsg.msgType) {
    case MsgType.LoginSuccess: {
      sessionId = returnMsg.payLoad.sessionId
      console.log(`login success: ${returnMsg.payLoad.sessionId}`)
      // connection.send(createUser(sessionId, newUserId, newUserName, newUserPassword, userId))
      connection.send(createTable(sessionId, tableId, tableName, columns, userId))
      break
    }
    case MsgType.CreateUserSuccess: {
      console.log(`create user success`)
      break
    }
    case MsgType.CreateTableSuccess: {
      console.log(`create table success`)
      connection.send(subscribeTables(sessionId, userId))
      break
    }
    case MsgType.SubscribeTablesSuccess: {
      console.log(`subscribe table success`)
      connection.send(appendTableRow(sessionId, tableId, rowId, values, userId))
      break
    }
    case MsgType.AppendRowSuccess: {
      console.log(`append row success`)
      connection.send(updateCell(sessionId, tableId, rowId, 'col_3', 'new_vaue', userId))
      break
    }
    case MsgType.UpdateCellSuccess: {
      console.log(`update cell success`)
      connection.send(removeTableRow(sessionId, tableId, rowId, userId))
      break
    }
    case MsgType.RemoveRowSuccess: {
      console.log(`remove row success`)
      break
    }
    case MsgType.TableSnap: {
      console.log(`table snap`)
      console.log(`${JSON.stringify(returnMsg)}`)
      break
    }
    case MsgType.TableUpdate: {
      console.log(`table update`)
      console.log(`${JSON.stringify(returnMsg)}`)
      break
    }
    case MsgType.AppendRowFailure: {
      console.error(`append row failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.LogoutSuccess: {
      console.log(`logout success`)
      break
    }
    case MsgType.LoginFailure: {
      console.error(`login failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.CreateUserFailure: {
      console.error(`create user failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.CreateTableFailure: {
      console.error(`create table failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.UpdateCellFailure: {
      console.error(`update cell failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.RemoveRowFailure: {
      console.error(`remove row failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.LogoutFailure: {
      console.error(`logout failure: ${returnMsg.payLoad.reason}`)
      break
    }
    default:
      // console.log(typeof returnMsg)
      // console.log(returnMsg['msgType'])
      // console.log(MsgType.LoginSuccess)
      console.error(`unknown msg: ${returnMsg}`)
      break
  }
  // console.log(e.data)
}