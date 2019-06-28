// FIXME: use import
const uuid = require('uuid/v4')
import WebSocket = require('ws');

import { MsgType, createUser, login, logout, SessionId, createTable, appendTableRow, UserId, Password, removeTableRow, 
  updateCell, subscribeTables, TableId, RowId, ColumnName, ColumnValue 
  } from './Messages';

    
class Client {
  userId: UserId
  password: Password
  sessionId: SessionId

  connection: WebSocket

  constructor(host: string, port: number, userId: string, password: string) {
    const url = `ws://${host}:${port}`

    this.connection = new WebSocket(url)
    this.userId = userId
    this.password = password

    this.connection.onopen = () => {
      this.listen()
      console.log('connected')
    }

    this.connection.onerror = (error) => {
      console.log(`WebSocket error: ${error}`)
    }
  }

  login() {
    this.connection.send(login(this.userId, this.password))
  }

  logout() {
    this.connection.send(logout(this.userId))
  }

  createUser(userId: string, userName: string, password: string) {
    this.connection.send(createUser(this.sessionId, userId, userName, password, this.userId))
  }

  createTable(tableName: string, columns: ColumnName[]) {
    const tableId = uuid()
    this.connection.send(createTable(this.sessionId, tableId, tableName, columns, this.userId))
  }

  subscribeTables() {
    this.connection.send(subscribeTables(this.sessionId, this.userId))
  }

  appendRow(tableId: TableId, values: ColumnValue[]) {
    const rowId = uuid()
    this.connection.send(appendTableRow(this.sessionId, tableId, rowId, values, this.userId))
  }

  removeRow(tableId: TableId, rowId: RowId) {
    this.connection.send(removeTableRow(this.sessionId, tableId, rowId, this.userId))
  }

  updateCell(tableId: TableId, rowId: RowId, columnName: ColumnName, newValue: ColumnValue) {
    this.connection.send(updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId))
  }

  listen() {
    this.connection.onmessage = (e) => {
      const returnMsg = JSON.parse(e.data.toString())

      switch (returnMsg.msgType) {
        case MsgType.LoginSuccess: {
          this.sessionId = returnMsg.payLoad.sessionId
          console.log(`login success: ${returnMsg.payLoad.sessionId}`)
          break
        }
        case MsgType.CreateUserSuccess: {
          console.log(`create user success`)
          break
        }
        case MsgType.CreateTableSuccess: {
          console.log(`create table success`)
          break
        }
        case MsgType.SubscribeTablesSuccess: {
          console.log(`subscribe table success`)
          break
        }
        case MsgType.AppendRowSuccess: {
          console.log(`append row success`)
          break
        }
        case MsgType.UpdateCellSuccess: {
          console.log(`update cell success`)
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
        default: {
          console.error(`unknown msg: ${returnMsg}`)
          break
        }
      }
    }
  }
}

const host = 'localhost'
const port = 8080


