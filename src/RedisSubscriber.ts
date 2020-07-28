import { DefaultClientCallback, Client } from './TableFlowClient'
import { TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue } from './TableFlowMessages'

const WebSocket = require('ws');
// const redis = require('redis')

// const subscriber = redis.createClient()

const strategy = 'test'

const pnl_channel = `${strategy}_pnl_channel`
const position_channel = `${strategy}_position_channel`



class MyClientCallback extends DefaultClientCallback {
  connectSuccess: (client: Client) => void = (client) => {
      console.log('connected!!')
        client.login('hv', 'hv')
  }
  connectFailure: () => void = () => {
  }

  loginSuccess: (sessionId: SessionId) => void  = sessionId => {
      console.log('login success')
  }
  loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
      console.log('login failure')
  }

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

  // tableSnap: (table: Table) => void = table => {}
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

  updateCellSuccess: (tableId: TableId, rowId: RowId, columnName: ColumnName) => void = (tableId, rwoId, columnName) => {}
  updateCellFailure: (tableId: TableId, rowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void = (tableId, rwoId, columnName, errorCode, reason) => {
      console.log('update cell failure')
  }
  updateCell: (tableId: TableId, rowId: RowId, columnIndex: number, value: Object) => void = (rowId, columnIndex, value) => {}

  moveRowAndUpdateCellSuccess: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName) => void = (tableId, rwoId, columnName) => {}
  moveRowAndUpdateCellFailure: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void = (tableId, rwoId, columnName, errorCode, reason) => {}
  moveRowAndUpdateCell: (tableId: TableId, rowId: RowId, afterRowId: RowId, columnIndex: number, value: Object) => void = (rowId, columnIndex, value) => {}
}

const client = new Client(WebSocket)
client.addCallback(new MyClientCallback())
client.connect('127.0.0.1', 8080)


const tableId = 'strategy_table_id'
const rowId = 'test_row_id'

// subscriber.on("message", function(channel, message) {
//     const data = JSON.parse(message)
//     // console.log("Message '" + data + "' on channel '" + channel + "' arrived!")

//     if (channel == pnl_channel) {
//         const pnl = data[1]['HK.HSI2007']
//         // console.log('pnl', pnl)
//         client.updateCell(tableId, rowId, 'pnl', pnl)
//     }
//     if (channel == position_channel) {
//         const position = data[1]['HK.HSI2007']
//         // console.log('position', position)
//         client.updateCell(tableId, rowId, 'position', position)
//     }
// });

// subscriber.subscribe(pnl_channel, position_channel);