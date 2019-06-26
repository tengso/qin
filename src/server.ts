import { Server } from 'ws'
import { MsgType, SessionId, UserId, UserName, Password, loginFailure, loginSuccess, logoutSuccess, logoutFailure,
         createUserFailure, createUserSuccess, TableId, TableName, CreatorId, ColumnName, RowId,
         createTableSuccess, createTableFailure, appendTableRowFailure, appendTableRowSuccess,
         removeTableRowFailure, removeTableRowSuccess } from './Messages'

const uuid = require('uuid/v4')

const wss = new Server({ port: 8080 })

const root_id = 'root'
const root_name = 'super'
const root_password = 'root'

type Version = number

interface UserInfo {
  userId: UserId,
  userName: UserName,
  password: Password
}

interface Row {
  rowId: RowId
  values: Object[]
}

interface Table {
  tableId: TableId
  tableName: TableName
  version: Version
  columns: ColumnName[]
  rows:  Row[]
  creatorId: CreatorId
}

// State
const sessionIdToUserId = new Map<SessionId, UserId>()

const userIdToSessionId = new Map<UserId, SessionId>()

const users = new Map<UserId, UserInfo>()

const tableUpdates = new Map<TableId, Map<Version, Object>>()

const tables = new Map<TableId, Table>() 

const rowIdToRowIndex = new Map<RowId, number>()
// State

users.set(root_id, {userId: root_id, userName: root_name, password: root_password})

function authenticate(userId: UserId, password: Password) {
  if (users.has(userId)) {
      return users.get(userId).password === password
  }
  else {
    return false
  }
}

function handleLogin(userId: UserId, password: Password) {
  if (authenticate(userId, password)) {
    if (userIdToSessionId.has(userId)) {
      return loginSuccess(userIdToSessionId.get(userId))
    }
    else {
      const sessionId = uuid()
      sessionIdToUserId.set(sessionId, userId)
      userIdToSessionId.set(userId, sessionId)
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
  const updator = pl.updatorId

  if (checkSessionId(sessionId)) {
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

      console.log(tableUpdates)
      console.log(tables)

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
  const updator = pl.updatorId

  if (checkSessionId(sessionId)) {
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

        console.log(tableUpdates)
        console.log(tables)

        return removeTableRowSuccess(rowId)
      }
    }
  }
  else {
    return appendTableRowFailure(rowId, 'unknown session')
  }
}


function handleCreateTable(message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const tableName = pl.tableName 
  const columns = pl.columns
  const creatorId = pl.creatorId

  if (checkSessionId(sessionId)) {
    if (!tableUpdates.has(tableId)) {
      tableUpdates.set(tableId, new Map<Version, Object>())

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

      console.log(tableUpdates)
      console.log(tables)

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

function checkSessionId(sessionId: SessionId) {
  return true
}

function handle_message(message) {
  switch (message.msgType) {
    case MsgType.Login:
      return handleLogin(message.payLoad.userId, message.payLoad.password)
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
    default:
      console.log(`Unknown Msg`)
      break
  }
}

function handle_connection(ws) {
  ws.on('message', msg => {
    const message = JSON.parse(msg.toString())
    const return_message = handle_message(message)
    ws.send(return_message)
  })
}

wss.on('connection', handle_connection)