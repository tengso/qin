import { ErrorCode, Table, MsgType, createUser, login, logout, SessionId, createTable, appendRow, UserId, Password, removeRow, removeAllRows,
  updateCell, subscribeTables, TableId, RowId, ColumnName, ColumnValue,
  removeUser, removeTable, Row, TableName, CreatorId, insertRow, moveRowAndUpdateCell
  } from './TableFlowMessages';


// FIXME: use import
const uuid = require('uuid/v4')
    
export interface ClientCallback {
  connectSuccess: (client: Client) => void
  connectFailure: () => void

  loginSuccess: (sessionId: SessionId) => void
  loginFailure: (errorCode: ErrorCode, reason: string) => void

  logoutSuccess: () => void
  logoutFailure: (reason: string) => void

  createUserSuccess: () => void
  createUserFailure: (errorCode: ErrorCode, reason: string) => void

  removeUserSuccess: () => void
  removeUserFailure: (errorCode: ErrorCode, reason: string) => void

  createTable: (tableId: TableId, tableName: TableName, columns: ColumnName[], creatorId: CreatorId) => void
  createTableSuccess: (tableId: TableId) => void
  createTableFailure: (tableId: TableId, errorCode: ErrorCode, reason: string) => void

  removeTable: (tableId: TableId) => void
  removeTableSuccess: (tableId: TableId) => void
  removeTableFailure: (tableId: TableId, errorCode: ErrorCode, reason: string) => void

  tableSnap: (table: Table) => void
  subscribeTablesSuccess: () => void

  appendRow: (tableId: TableId, rowId: RowId, values: Object[]) => void 
  appendRowSuccess: (rowId: RowId) => void
  appendRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void

  insertRow: (tableId: TableId, rowId: RowId, afterRowId: RowId, values: Object[]) => void 
  insertRowSuccess: (rowId: RowId) => void
  insertRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void

  removeRow: (rowId: RowId, tableId: TableId, values: ColumnValue[]) => void
  removeRowSuccess: (rowId: RowId) => void
  removeRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void

  removeAllRows: (tableId: TableId) => void
  removeAllRowsSuccess: () => void
  removeAllRowsFailure: (errorCode: ErrorCode, reason: string) => void

  updateCell: (tableId: TableId, rowId: RowId, columnIndex: number, value: Object) => void
  updateCellSuccess: (tableId: TableId, rowId: RowId, columnName: ColumnName) => void
  updateCellFailure: (tableId: TableId, rowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void

  moveRowAndUpdateCell: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnIndex: number, value: Object) => void
  moveRowAndUpdateCellSuccess: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName) => void
  moveRowAndUpdateCellFailure: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void
}

export class DefaultClientCallback {
  connectSuccess: (client: Client) => void = (client) => {}
  connectFailure: () => void = () => {}

  loginSuccess: (sessionId: SessionId) => void  = sessionId => {}
  loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {}

  logoutSuccess: () => void = () => {}
  logoutFailure: (reason: string) => void = reason => {}

  createUserSuccess: () => void = () => {}
  createUserFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {}

  removeUserSuccess: () => void = () => {}
  removeUserFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {}

  createTable: (tableId: TableId, tableName: TableName, columns: ColumnName[], creatorId: CreatorId) => void = (tableId, tableName, columns, creatorId) => {}
  createTableSuccess: (tableId: TableId) => void = tableId => {}
  createTableFailure: (tableId: TableId, errorCode: ErrorCode, reason: string) => void = (tableId, errorCode, reason) => {}

  removeTable: (tableId: TableId) => void = tableId => {}
  removeTableSuccess: (tableId: TableId) => void = tableId => {}
  removeTableFailure: (tableId: TableId, errorCode: ErrorCode, reason: string) => void = (tableId, errorCode, reason) => {}

  tableSnap: (table: Table) => void = table => {}
  subscribeTablesSuccess: () => void = () => {}

  appendRowSuccess: (rowId: RowId) => void = rowId => {}
  appendRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void = rowId => {}
  appendRow: (tableId: TableId, rowId: RowId, values: Object[]) => void = (tableId, rowId, values) => {}

  insertRowSuccess: (rowId: RowId) => void = rowId => {}
  insertRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void = rowId => {}
  insertRow: (tableId: TableId, rowId: RowId, afterRowId: RowId, values: Object[]) => void = (tableId, rowId, values) => {}

  removeRowSuccess: (rowId: RowId) => void = rowId => {}
  removeRowFailure: (rowId: RowId, errorCode: ErrorCode, reason: string) => void = (rowId, errorCode, reason) => {}
  removeRow: (rowId: RowId, tableId: TableId, values: ColumnValue[]) => void = rowId => {}

  removeAllRows: (tableId: TableId) => void = tableId => {}
  removeAllRowsSuccess: () => void = () => {}
  removeAllRowsFailure: (errorCode: ErrorCode, reason: string) => void = (errorCode, reason) => {}

  updateCellSuccess: (tableId: TableId, rowId: RowId, columnName: ColumnName) => void = (tableId, rwoId, columnName) => {}
  updateCellFailure: (tableId: TableId, rowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void = (tableId, rwoId, columnName, errorCode, reason) => {}
  updateCell: (tableId: TableId, rowId: RowId, columnIndex: number, value: Object) => void = (tableId, rowId, columnIndex, value) => {}

  moveRowAndUpdateCellSuccess: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName) => void = (tableId, rwoId, columnName) => {}
  moveRowAndUpdateCellFailure: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void = (tableId, rwoId, columnName, errorCode, reason) => {}
  moveRowAndUpdateCell: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnIndex: number, value: Object) => void = (rowId, columnIndex, value) => {}
}

export class Client {
  userId: UserId | undefined
  password: Password | undefined
  sessionId: SessionId | undefined

  connection: WebSocket
  webSocketFactory: any

  callback: ClientCallback

  constructor(webSocketFactory: any) {
    this.webSocketFactory = webSocketFactory
  }

  addCallback(callback: ClientCallback) {
    this.callback = callback
  }

  connect(host: string, port: number) {
    const url = `ws://${host}:${port}`
    this.connection = new this.webSocketFactory(url)

    this.connection.onopen = () => {
      console.log('connected')
      this.listen()
      this.callback.connectSuccess(this)
    }

    this.connection.onerror = (error) => {
      this.callback.connectFailure()
      console.log(`connect error: ${error['message']}`)
    }
  }

  disconnect() {
    this.connection.close()
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
    const msg = createUser(this.sessionId, userId, userName, password, this.userId)
    // console.log(msg)
    this.connection.send(msg)
  }

  removeUser(userId: string) {
    const msg = removeUser(this.sessionId, userId, this.userId)
    // console.log(msg)
    this.connection.send(msg)
  }

  createTable(tableId: TableId, tableName: string, columns: ColumnName[]) {
    this.connection.send(createTable(this.sessionId, tableId, tableName, columns, this.userId))
  }

  removeTable(tableId: TableId) {
    this.connection.send(removeTable(this.sessionId, tableId, this.userId))
  }

  subscribeTables() {
    this.connection.send(subscribeTables(this.sessionId, this.userId))
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[], send: boolean = true) {
    const msg = appendRow(this.sessionId, tableId, rowId, values, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  removeRow(tableId: TableId, rowId: RowId, send: boolean = true) {
    const msg = removeRow(this.sessionId, tableId, rowId, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  removeAllRows(tableId: TableId, send: boolean = true) {
    const msg = removeAllRows(this.sessionId, tableId, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  insertRow(tableId: TableId, rowId: RowId, afterRowId: RowId, values: ColumnValue[], send: boolean = true) {
    const msg = insertRow(this.sessionId, tableId, rowId, afterRowId, values, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  updateCell(tableId: TableId, rowId: RowId, columnName: ColumnName, newValue: ColumnValue, send: boolean = true) {
    const msg = updateCell(this.sessionId, tableId, rowId, columnName, newValue, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  moveRowAndUpdateCell(tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName, newValue: ColumnValue, send: boolean = true) {
    const msg = moveRowAndUpdateCell(this.sessionId, tableId, rowId, afterRowId, columnName, newValue, this.userId)
    if (send) {
      this.connection.send(msg)
    }
    return msg
  }

  executeTransaction(msgs: string[]) {
    const msg = {
      msgType: MsgType.Transaction,
      payLoad: msgs
    }

    this.connection.send(JSON.stringify(msg))
  }

  listen() {
    this.connection.onmessage = (e) => {
      const returnMsg = JSON.parse(e.data.toString())

      // console.log(`received: ${e.data.toString()}`)

      switch (returnMsg.msgType) {
        case MsgType.LoginSuccess: {
          this.sessionId = returnMsg.payLoad.sessionId
          this.callback.loginSuccess(this.sessionId)
          break
        }
        case MsgType.LoginFailure: {
          // console.error(`login failure: ${returnMsg.payLoad.reason}`)
          this.callback.loginFailure(returnMsg.payLoad.errorCode, returnMsg.payLoad.reason)
          break
        }
        case MsgType.LogoutSuccess: {
          this.callback.logoutSuccess()
          this.sessionId = undefined
          break
        }
        case MsgType.LogoutFailure: {
          console.error(`logout failure: ${returnMsg.payLoad.reason}`)
          this.callback.logoutFailure(returnMsg.payLoad.reason)
          break
        }
        case MsgType.CreateUserSuccess: {
          this.callback.createUserSuccess()
          break
        }
        case MsgType.CreateUserFailure: {
          const reason = returnMsg.payLoad.reason
          const errorCode = returnMsg.payLoad.errorCode
          this.callback.createUserFailure(errorCode, reason)
          break
        }
        case MsgType.RemoveUserSuccess: {
          this.callback.removeUserSuccess()
          break
        }
        case MsgType.RemoveUserFailure: {
          const reason = returnMsg.payLoad.reason
          const errorCode = returnMsg.payLoad.errorCode
          this.callback.removeUserFailure(errorCode, reason)
          break
        }
        case MsgType.CreateTableSuccess: {
          this.callback.createTableSuccess(returnMsg.payLoad.tableId)
          break
        }
        case MsgType.CreateTableFailure: {
          const reason = returnMsg.payLoad.reason
          const errorCode = returnMsg.payLoad.errorCode
          this.callback.createTableFailure(returnMsg.payLoad.tableId, errorCode, reason)
          break
        }
        case MsgType.RemoveTableSuccess: {
          this.callback.removeTableSuccess(returnMsg.payLoad.tableId)
          break
        }
        case MsgType.RemoveTableFailure: {
          const reason = returnMsg.payLoad.reason
          const errorCode = returnMsg.payLoad.errorCode
          this.callback.removeTableFailure(returnMsg.payLoad.tableId, errorCode, reason)
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
        case MsgType.InsertRowSuccess: {
          this.callback.insertRowSuccess(returnMsg.payLoad.rowId)
          break
        }
        case MsgType.RemoveRowSuccess: {
          this.callback.removeRowSuccess(returnMsg.payLoad.rowId)
          break
        }
        case MsgType.RemoveAllRowsSuccess: {
          this.callback.removeAllRowsSuccess()
          break
        }
        case MsgType.UpdateCellSuccess: {
          this.callback.updateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId,
            returnMsg.payLoad.columnName)
          break
        }
        case MsgType.MoveRowAndUpdateCellSuccess: {
          this.callback.moveRowAndUpdateCellSuccess(returnMsg.payLoad.tableId, returnMsg.payLoad.rowId, returnMsg.payLoad.afterRowId, returnMsg.payLoad.columnName)
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
            case MsgType.InsertRow:
              this.callback.insertRow(update.tableId, update.rowId, update.afterRowId, update.values)
              break
            case MsgType.RemoveRow:
              this.callback.removeRow(update.rowId, update.tableId, update.values)
              break
            case MsgType.RemoveAllRows:
              this.callback.removeAllRows(update.tableId)
              break
            case MsgType.UpdateCell:
              this.callback.updateCell(update.tableId, update.rowId, update.columnIndex, update.value)
              break
            case MsgType.MoveRowAndUpdateCell:
              this.callback.moveRowAndUpdateCell(update.tableId, update.rowId, update.afterRowId, update.columnIndex, update.value)
              break
            case MsgType.RemoveTable:
              this.callback.removeTable(returnMsg.payLoad.update.tableId)
              break
            case MsgType.CreateTable:
              const {tableId, tableName, columns, creatorId} = returnMsg.payLoad.update
              this.callback.createTable(tableId, tableName, columns, creatorId)
              break
            default:
              console.log(`unknown update type: ${update.updateType}`)
          }
          break
        }
        // FIXME: handle failures
        case MsgType.AppendRowFailure: {
          console.error(`append row failure: ${returnMsg.payLoad.reason}`)
          break
        }
        case MsgType.InsertRowFailure: {
          console.error(`insert row failure: ${returnMsg.payLoad.reason}`)
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
        case MsgType.MoveRowAndUpdateCellFailure: {
          console.error(`move row and update cell failure: ${returnMsg.payLoad.reason}`)
          break
        }
        case MsgType.RemoveRowFailure: {
          console.error(`remove row failure: ${returnMsg.payLoad.reason}`)
          break
        }
        case MsgType.RemoveAllRowsFailure: {
          console.error(`remove all rows failure: ${returnMsg.payLoad.reason}`)
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
