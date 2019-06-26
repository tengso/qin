// FIXME: use import
import { MsgType, createUser, login, logout, loginSuccess, SessionId, createTable } from './Messages';

const uuid = require('uuid/v4')

let userId = 'root'
let password = 'root'

let newUserId = 'song'
let newUserName = 'Song Teng' 
let newUserPassword = 'java' 

// let userId = newUserId
// let password = newUserPassword

let tableId = uuid()
let tableName = 'table_name'
let columns = ['col_1', 'col_2', 'col_3']

import WebSocket = require('ws');

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
      const sessionId = returnMsg.payLoad.sessionId
      console.log(`login success: ${returnMsg.payLoad.sessionId}`)
      // connection.send(createUser(sessionId, newUserId, newUserName, newUserPassword, userId))
      connection.send(createTable(sessionId, tableId, tableName, columns, userId))
      break
    }
    case MsgType.LoginFailure: {
      console.error(`login failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.LogoutFailure: {
      console.error(`logout failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.LogoutSuccess: {
      console.log(`logout success`)
      break
    }
    case MsgType.CreateUserFailure: {
      console.error(`create user failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.CreateUserSuccess: {
      console.log(`create user success`)
      break
    }
    case MsgType.CreateTableFailure: {
      console.error(`create table failure: ${returnMsg.payLoad.reason}`)
      break
    }
    case MsgType.CreateTableSuccess: {
      console.log(`create table success`)
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