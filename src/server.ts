import { Server } from 'ws'
import { MsgType, SessionId, UserId, UserName, Password, loginFailure, loginSuccess, logoutSuccess, logoutFailure,
         createUserFailure, createUserSuccess, TableId, TableName, CreatorId, ColumnName, RowId,
         createTableSuccess, createTableFailure, appendTableRowFailure, appendTableRowSuccess,
         removeTableRowFailure, removeTableRowSuccess, updateCellSuccess, updateCellFailure,
         SubscriberId, subscribeTablesSuccess, UserInfo, Version, Table, Row, sendTableSnap, sendTableUpdate } from './Messages'

const uuid = require('uuid/v4')

const wss = new Server({ port: 8080 })

const root_id = 'root'
const root_name = 'super'
const root_password = 'root'



// Persistent State
const sessionIdToUserId = new Map<SessionId, UserId>()

const userIdToSessionId = new Map<UserId, SessionId>()

const users = new Map<UserId, UserInfo>()

const tableUpdates = new Map<TableId, Map<Version, any>>()

const tables = new Map<TableId, Table>() 

const rowIdToRowIndex = new Map<RowId, number>()

const subscribers = new Map<SessionId, UserId>()
// 

// Transient State
const sessionIdToSocket = new Map<SessionId, WebSocket>()
// 

users.set(root_id, {userId: root_id, userName: root_name, password: root_password})

function authenticate(userId: UserId, password: Password) {
  if (users.has(userId)) {
      return users.get(userId).password === password
  }
  else {
    return false
  }
}

function updateSubscribers(update) {
  subscribers.forEach((userId, sessionId) => {
    if (sessionIdToSocket.has(sessionId)) {
      sessionIdToSocket.get(sessionId).send(sendTableUpdate(sessionId, userId, update))
    }
  })
}

function handleLogin(ws, userId: UserId, password: Password) {
  if (authenticate(userId, password)) {
    if (userIdToSessionId.has(userId)) {
      const sessionId = userIdToSessionId.get(userId)
      sessionIdToSocket.set(sessionId, ws)
      return loginSuccess(sessionId)
    }
    else {
      const sessionId = uuid()
      sessionIdToUserId.set(sessionId, userId)
      userIdToSessionId.set(userId, sessionId)
      sessionIdToSocket.set(sessionId, ws)
      return loginSuccess(sessionId)
    }
  }
  else {
    return loginFailure('wrong user or password')
  }
}

function handleLogout(userId: UserId) {
    if (userIdToSessionId.has(userId)) {
      const sessionId = userIdToSessionId.get(userId)
      sessionIdToUserId.delete(sessionId)
      userIdToSessionId.delete(userId)
      return logoutSuccess()
    }
    else {
      return logoutFailure(`unknown user: ${userId}`)
    }
}

function handleCreateUser(userId: UserId, userName: UserName, password: Password) {
  if (users.has(userId)) {
      return createUserFailure(`user ${userId} exists`)
  }
  else {
    users.set(userId, {
      userId: userId,
      userName: userName,
      password: password
    })

    return createUserSuccess()
  }
}

function handleAppendRow(message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const values = pl.values
  const updatorId = pl.updatorId

  if (checkSessionId(updatorId, sessionId)) {
    if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
      return appendTableRowFailure(rowId, `table ${tableId} not exists`)
    }
    else {
      const table = tables.get(tableId)
      table.version = table.version + 1
      table.rows.push({
        rowId: rowId,
        values: values
      })
      tables.set(tableId, table)
      rowIdToRowIndex.set(rowId, table.rows.length - 1)

      tableUpdates.get(tableId).set(table.version, message)

      // console.log(tableUpdates)
      // console.log(tables)

      updateSubscribers(message)
      return appendTableRowSuccess(rowId)
    }
  }
  else {
    return appendTableRowFailure(rowId, 'unknown session')
  }
}

function handleRemoveRow(message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const updatorId = pl.updatorId

  if (checkSessionId(updatorId, sessionId)) {
    if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
      return removeTableRowFailure(rowId, `table ${tableId} not exists`)
    }
    else {
      if (!rowIdToRowIndex.has(rowId)) {
        return removeTableRowFailure(rowId, `row ${rowId} not exists`)
      }
      else {
        const table = tables.get(tableId)
        table.rows.splice(rowIdToRowIndex.get(rowId), 1)
        table.version = table.version + 1
        tables.set(tableId, table)
        tableUpdates.get(tableId).set(table.version, message)

        // console.log(tableUpdates)
        // console.log(tables)

        updateSubscribers(message)
        return removeTableRowSuccess(rowId)
      }
    }
  }
  else {
    return appendTableRowFailure(rowId, 'unknown session')
  }
}

function handleUpdateCell(message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const columnName = pl.columnName
  const value = pl.value
  const updatorId = pl.updatorId

  if (checkSessionId(updatorId, sessionId)) {
    if (!tableUpdates.has(tableId) || !tables.has(tableId)) {
      return updateCellFailure(tableId, rowId, columnName, `table ${tableId} not exists`)
    }
    else {
      if (!rowIdToRowIndex.has(rowId)) {
        return updateCellFailure(tableId, rowId, columnName, `row ${rowId} not exists`)
      }
      else {
        const table = tables.get(tableId)
        const columnIndex = table.columns.indexOf(columnName)
        if (columnIndex === -1) {
          return updateCellFailure(tableId, rowId, columnName, `column ${columnName} not exists`)
        }
        else {
          table.version = table.version + 1
          const row = table.rows[rowIdToRowIndex.get(rowId)]
          row.values[columnIndex] = value

          tables.set(tableId, table)
          tableUpdates.get(tableId).set(table.version, message)

          // console.log(tableUpdates)
          // console.log(tables)

          // console.log(tables.get(tableId).rows[0].values)

          updateSubscribers(message)
          return updateCellSuccess(tableId, rowId, columnName)
        }
      }
    }
  }
  else {
    return updateCellFailure(tableId, rowId, columnName, 'unknown session')
  }
}


function handleCreateTable(message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const tableName = pl.tableName 
  const columns = pl.columns
  const creatorId = pl.creatorId

  if (checkSessionId(creatorId, sessionId)) {
    if (!tableUpdates.has(tableId)) {
      tableUpdates.set(tableId, new Map<Version, any>())

      const version = 0
      tableUpdates.get(tableId).set(version, message)

      const table: Table = {
        tableId: tableId,
        tableName: tableName,
        version: version,
        columns: columns,
        rows:  new Array<Row>(),
        creatorId: creatorId,
      }

      tables.set(tableId, table)

      // console.log(tableUpdates)
      // console.log(tables)

      return createTableSuccess(tableId)
    }
    else {
      return createTableFailure(tableId, `table ${tableId} exists`)
    }
  }
  else {
    return createTableFailure(tableId, 'unknown session')
  }
}

function handleSubscribeTables(ws, message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const subscriberId = pl.subscriberId

  subscribers.set(sessionId, subscriberId)

  const wws: WebSocket = sessionIdToSocket.get(sessionId)

  tables.forEach((table, _) =>{
    console.log(table)
    wws.send(sendTableSnap(sessionId, subscriberId, table))
  })

  // FIXME: should send response before sending table
  return subscribeTablesSuccess(sessionId, subscriberId)
}


function checkSessionId(userId: UserId, sessionId: SessionId) {
  return (userIdToSessionId.has(userId) && userIdToSessionId.get(userId) === sessionId)
}

function handleMessage(ws, message) {
  switch (message.msgType) {
    case MsgType.Login:
      return handleLogin(ws, message.payLoad.userId, message.payLoad.password)
    case MsgType.Logout:
      return handleLogout(message.payLoad.userId)
    case MsgType.CreateUser:
      return handleCreateUser(message.payLoad.userId, message.payLoad.userName, message.payLoad.password)
    case MsgType.CreateTable:
      return handleCreateTable(message)
    case MsgType.AppendRow:
      return handleAppendRow(message)
    case MsgType.RemoveRow:
      return handleRemoveRow(message)
    case MsgType.UpdateCell:
      return handleUpdateCell(message)
    case MsgType.SubscribeTables:
      return handleSubscribeTables(ws, message)
    default:
      console.log(`Unknown Msg`)
      break
  }
}

function handleConnection(ws) {
  ws.on('message', msg => {
    const message = JSON.parse(msg.toString())
    const return_message = handleMessage(ws, message)
    ws.send(return_message)
  })
}

wss.on('connection', handleConnection)