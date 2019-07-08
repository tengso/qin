import { Server } from 'ws'
import { MsgType, SessionId, UserId, UserName, Password, loginFailure, loginSuccess, logoutSuccess, logoutFailure,
         createUserFailure, createUserSuccess, TableId, TableName, CreatorId, ColumnName, RowId,
         createTableSuccess, createTableFailure, appendTableRowFailure, appendTableRowSuccess,
         removeTableRowFailure, removeTableRowSuccess, updateCellSuccess, updateCellFailure,
         SubscriberId, subscribeTablesSuccess, UserInfo, Version, Table, Row, sendTableSnap, sendTableUpdate,
         subscribeTablesFailure } from './Messages'

import {Storage} from './Storage'
import {RedisStorage} from './RedisStorage'

// FIXME: enforce one user one session

const uuid = require('uuid/v4')

const wss = new Server({ port: 8080 })

const root_id = 'root'
const root_name = 'super'
const root_password = 'root'

// Persistent State
// const sessionIdToUserId = new Map<SessionId, UserId>()
const userIdToSessionId = new Map<UserId, SessionId>()

const users = new Map<UserId, UserInfo>()
const subscribers = new Map<SessionId, UserId>()

const tableUpdates = new Map<TableId, Map<Version, any>>()
const tables = new Map<TableId, Table>() 

const rowIdToRowIndex = new Map<RowId, number>()

// 

// Transient State
const sessionIdToSocket = new Map<SessionId, WebSocket>()
// 

users.set(root_id, {userId: root_id, userName: root_name, password: root_password})

// function authenticate(userId: UserId, password: Password) {
//   if (users.has(userId)) {
//       return users.get(userId).password === password
//   }
//   else {
//     return false
//   }
// }

function publish(msg, callback): void {
  db.getSubscribers(sessionIds => {
    if (sessionIds) {
      sessionIds.forEach(sessionId => {
        if (sessionIdToSocket.has(sessionId)) {
          sessionIdToSocket.get(sessionId).send(msg)
          callback()
        }
        else {
          console.log(`can't find socket for ${sessionId}`)
        }
      })
    }
    else {
      console.log(`empty subscribers`)
    }
  })
}

// function publishTableUpdate(update) {
//   subscribers.forEach((userId, sessionId) => {
//     if (sessionIdToSocket.has(sessionId)) {
//       sessionIdToSocket.get(sessionId).send(sendTableUpdate(sessionId, userId, update))
//     }
//   })
// }

// function publishTableSnap(table) {
//   subscribers.forEach((userId, sessionId) => {
//     if (sessionIdToSocket.has(sessionId)) {
//       sessionIdToSocket.get(sessionId).send(sendTableSnap(sessionId, userId, table))
//     }
//   })
// }

const db: Storage = new RedisStorage()

function Reply(ws) {
  return msg => {
    console.log(msg)
    ws.send(msg)
  }
}

function isRoot(userId: UserId, password: Password) {
  return (userId === 'root') && (password === 'root')
}

function handleLogin(ws, reply, userId: UserId, password: Password) {
  console.log(`login: ${userId} ${password}`)

  db.getUser(userId, (user: UserInfo | undefined) => {
    if (!user && !isRoot(userId, password)) {
      reply(loginFailure(`user ${userId} not found`))
    }
    else if (isRoot(userId, password) || (user.password === password)) {
      db.getSessionId(userId, (sessionId: SessionId) => {
        if (!sessionId) {
          const sessionId = uuid()
          sessionIdToSocket.set(sessionId, ws)
          db.setSessionId(userId, sessionId, () => {
            reply(loginSuccess(sessionId))
          })
        }
        else {
          reply(loginFailure(`user ${userId} already login`))
        }
      })
    }
    else {
      reply(loginFailure(`user ${userId} wrong password`))
    }
  })
}

function handleLogout(reply, userId: UserId) {
  console.log(`logout: ${userId}`)
  db.getSessionId(userId, (sessionId) => {
    if (sessionId) {
      db.removeSessionId(userId, (res) => {
          sessionIdToSocket.delete(sessionId)
          reply(logoutSuccess())
      })
    }
    else {
      reply(logoutFailure(`unknown user: ${userId}`))
    }
  })
}

function handleCreateUser(reply, sessionId: SessionId, userId: UserId, userName: UserName, password: Password, creatorId: CreatorId) {
  db.getSessionId(creatorId, (sessionId) => {
    if (sessionId) {
      db.getUser(userId, user => {
        if (user) {
          reply(createUserFailure(`user ${userId} exists`))
        }
        else {
          // users.set(userId, {
          //   userId: userId,
          //   userName: userName,
          //   password: password
          // })
          db.setUser(userId, {
            userId: userId,
            userName: userName,
            password: password
          }, () => {
            reply(createUserSuccess())
          })
        }
      })
    }
    else {
      reply(createUserFailure(`unknown creator ${creatorId}`))
    }
  })
}

function handleAppendRow(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const values = pl.values
  const updatorId = pl.updatorId

  // console.log(`append row\n${JSON.stringify(table)}\n${tableUpdate}`)

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId == uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          table.version = table.version + 1
          table.rows.push({
            rowId: rowId,
            values: values
          })

          db.setTableSnap(tableId, table, () => {
            db.setRowIndex(rowId, table.rows.length -1, () => {
              db.setTableUpdate(tableId, table.version, message, () => {
                const update = {
                  updateType: message.msgType,
                  tableId: tableId,
                  rowId: rowId,
                  values: values
                }
                const msg = sendTableUpdate(sessionId, updatorId, update)
                publish(msg, () => {
                  reply.send(appendTableRowSuccess(rowId))
                })
              })
            })
          })
        }
        else {
          reply.send(appendTableRowFailure(rowId, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply.send(appendTableRowFailure(rowId, 'unknown session'))
    }
  })
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

        rowIdToRowIndex.delete(rowId)
        // console.log(tableUpdates)
        // console.log(tables)

        publishTableUpdate({
          updateType: message.msgType,
          tableId: tableId,
          rowId: rowId,
        })
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

          publishTableUpdate({
            updateType: message.msgType,
            tableId: tableId,
            rowId: rowId,
            columnIndex: columnIndex,
            value: value,
          })
          // FIXME: pass column index instead
          return updateCellSuccess(tableId, rowId, columnName)
        }
      }
    }
  }
  else {
    return updateCellFailure(tableId, rowId, columnName, 'unknown session')
  }
}

function handleCreateTable(reply, message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const tableName = pl.tableName 
  const columns = pl.columns
  const creatorId = pl.creatorId

  db.getSessionId(creatorId, (storedSessionId) => {
    if (storedSessionId != sessionId) {
      db.getTableSnap(tableId, (tableSnap) => {
        if (!tableSnap) {
          db.setTableUpdate(tableId, 0, JSON.stringify(message), (_) => {
            const table: Table = {
              tableId: tableId,
              tableName: tableName,
              version: 0,
              columns: columns,
              rows:  new Array<Row>(),
              creatorId: creatorId,
            }
            db.setTableSnap(tableId, table, () => {
              const userId = null
              const tableUpdate = sendTableUpdate(sessionId, userId, message)
              publish(tableUpdate, () => {
                publish(table, () => {
                  reply(createTableSuccess(tableId))
                })
              })
            })
          })
        }
        else {
          reply(createTableFailure(tableId, `table ${tableId} exists`))
        }
      })
    }
    else {
      reply(createTableFailure(tableId, `${sessionId} unknown session`))
    }
  })
  /*
  if (checkSessionId(creatorId, sessionId)) {
    if (!tableUpdates.has(tableId)) {
      tableUpdates.set(tableId, new Map<Version, any>())

      const version = 0
      const tableUpdate = tableUpdates.get(tableId)
      tableUpdate.set(version, message)

      const table: Table = {
        tableId: tableId,
        tableName: tableName,
        version: version,
        columns: columns,
        rows:  new Array<Row>(),
        creatorId: creatorId,
      }

      tables.set(tableId, table)

      console.log(`create table\n${JSON.stringify(table)}\n${tableUpdate}`)

      publishTableUpdate(message)
      publishTableSnap(table)
      return createTableSuccess(tableId)
    }
    else {
      return createTableFailure(tableId, `table ${tableId} exists`)
    }
  }
  else {
    return createTableFailure(tableId, 'unknown session')
  }
  */
}

function handleSubscribeTables(ws, message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const subscriberId = pl.subscriberId

  if (checkSessionId(subscriberId, sessionId)) {
    if (sessionIdToSocket.has(sessionId)) {
      const wws: WebSocket = sessionIdToSocket.get(sessionId)

      subscribers.set(sessionId, subscriberId)

      tables.forEach((table, _) =>{
        console.log(table)
        wws.send(sendTableSnap(sessionId, subscriberId, table))
      })

      // FIXME: should send response before sending table
      return subscribeTablesSuccess(sessionId, subscriberId)
    }
    else {
      return subscribeTablesFailure(sessionId, subscriberId, `${subscriberId} sessionId: ${sessionId} socket not found`)
    }
  }
  else {
    return subscribeTablesFailure(sessionId, subscriberId, `subscriberId: ${subscriberId} not login`)
  }
}


function checkSessionId(userId: UserId, sessionId: SessionId) {
  return (userIdToSessionId.has(userId) && userIdToSessionId.get(userId) === sessionId)
}

function handleMessage(ws, message) {
  const reply = Reply(ws)
  switch (message.msgType) {
    case MsgType.Login:
      handleLogin(ws, reply, message.payLoad.userId, message.payLoad.password)
      break
    case MsgType.Logout:
      handleLogout(reply, message.payLoad.userId)
      break
    case MsgType.CreateUser:
      handleCreateUser(reply, message.payLoad.sessionId, message.payLoad.userId, message.payLoad.userName, message.payLoad.password, message.payLoad.creatorId)
      break
    case MsgType.CreateTable:
      handleCreateTable(reply, message)
      break
    case MsgType.AppendRow:
      return handleAppendRow(reply, message)
      break
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
    // if (!return_message) {
    //   ws.send(return_message)
    // }
  })
}

wss.on('connection', handleConnection)