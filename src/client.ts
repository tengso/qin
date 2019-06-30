import { MsgType, createUser, login, logout, SessionId, createTable, appendTableRow, UserId, Password, removeTableRow, 
  updateCell, subscribeTables, TableId, RowId, ColumnName, ColumnValue 
  } from './Messages';


// FIXME: use import
const uuid = require('uuid/v4')
// const WebSocket = require('ws');
    
class Client {
  userId: UserId | undefined
  password: Password | undefined
  sessionId: SessionId | undefined

  connection: WebSocket

  callback: any

  constructor(host: string, port: number, callback: any) {
    const url = `ws://${host}:${port}`

    this.connection = new WebSocket(url)
    this.callback = callback

    this.connection.onopen = () => {
      this.listen()
      console.log('connected')
    }

    this.connection.onerror = (error) => {
      console.log(`WebSocket error: ${error}`)
    }
  }

  login(userId: string, password: string) {
    this.userId = userId
    this.password = password

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
          this.callback.loginSuccess(this.sessionId)
          break
        }
        case MsgType.CreateUserSuccess: {
          this.callback.createUserSuccess()
          break
        }
        case MsgType.CreateTableSuccess: {
          this.callback.createTableSuccess(returnMsg.payLoad.tableId)
          break
        }
        case MsgType.SubscribeTablesSuccess: {
          this.callback.subscribeTablesSuccess()
          break
        }
        case MsgType.AppendRowSuccess: {
          this.callback.appendRowSuccess(returnMsg.payLoad.rowId)
          break
        }
        case MsgType.RemoveRowSuccess: {
          this.callback.removeRowSuccess(returnMsg.payLoad.rowId)
          break
        }
        case MsgType.UpdateCellSuccess: {
          this.callback.updateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId,
            returnMsg.payLoad.columnName)
          break
        }
        case MsgType.LogoutSuccess: {
          this.sessionId = undefined
          this.userId = undefined
          this.password = undefined
          this.callback.logoutSuccess()
          break
        }
        case MsgType.TableSnap: {
          this.callback.tableSnap(returnMsg.payLoad.table)
          break
        }
        case MsgType.TableUpdate: {
          let update = returnMsg.payLoad.update
          switch (update.updateType) {
            case MsgType.AppendRow:
              this.callback.appendRow(update.tableId, update.rowId, update.values)
              break
            case MsgType.RemoveRow:
              this.callback.removeRow(update.rowId)
              break
            case MsgType.UpdateCell:
              this.callback.updateCell(update.rowId, update.columnIndex, update.value)
              break
            default:
              console.log(`unknown update type: ${update.updateType}`)
          }
          break
        }
        case MsgType.AppendRowFailure: {
          console.error(`append row failure: ${returnMsg.payLoad.reason}`)
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
        case MsgType.SubscribeTablesFailure: {
          console.error(`subscribe table failure: ${returnMsg.payLoad.reason}`)
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

// @ts-ignore
window.Client = Client


