import { Server } from 'ws'
import { MsgType, SessionId, UserId, UserName, Password, loginFailure, loginSuccess, logoutSuccess, logoutFailure,
         createUserFailure, createUserSuccess, TableId, TableName, CreatorId, ColumnName, RowId,
         createTableSuccess, createTableFailure, appendRowFailure, appendRowSuccess,
         removeRowFailure, removeRowSuccess, updateCellSuccess, updateCellFailure,
         SubscriberId, subscribeTablesSuccess, UserInfo, Version, Table, Row, sendTableSnap, sendTableUpdate,
         subscribeTablesFailure, ErrorCode, RemoverId,
         removeUserFailure, removeUserSuccess,
         removeAllRowsFailure, removeAllRowsSuccess,
         removeTableSuccess, removeTableFailure, insertRowFailure, insertRowSuccess, moveRowAndUpdateCellFailure, moveRowAndUpdateCellSuccess } from './TableFlowMessages'

import {Storage} from './Storage'
import {RedisStorage} from './RedisStorage'

// FIXME: enforce one user one session

const uuid = require('uuid/v4')
const yargs = require('yargs')

const root_id = 'root'
const root_name = 'super'
const root_password = 'root'

const dbName = yargs.argv.dbName ? yargs.argv.dbName : 'test'
const redisHost = yargs.argv.redisHost ? yargs.argv.redisHost : 'localhost'
const redisPort = yargs.argv.redisPort ? yargs.argv.redisPort: 6383

const host = yargs.argv.host ? yargs.argv.host : 'localhost'
const port = yargs.argv.port ? yargs.argv.port : 8080

// Transient State
const sessionIdToSocket = new Map<SessionId, WebSocket>()

const db: Storage = new RedisStorage(dbName, redisHost, redisPort)

function publish(msg, callback): void {
  db.getSubscribers(sessionIds => {
    if (sessionIds) {
      sessionIds.forEach(sessionId => {
        if (sessionIdToSocket.has(sessionId)) {
          sessionIdToSocket.get(sessionId).send(msg)
          // console.log(`published: ${msg}`)
        }
        else {
          // console.log(`can't find socket for ${sessionId}`)
        }
      })
    }
    else {
      console.log(`empty subscribers`)
    }
  })
  callback()
}

function Reply(ws) {
  return msg => {
    // console.log(`reply: ${msg}`)
    ws.send(msg)
  }
}

function isRoot(userId: UserId, password: Password) {
  return (userId === 'root') && (password === 'root')
}

function handleLogin(ws, reply, userId: UserId, password: Password) {
  db.getUser(userId, (user: UserInfo | undefined) => {
    if (!user && !isRoot(userId, password)) {
      reply(loginFailure(ErrorCode.UnknownUser, `user ${userId} not found`))
    }
    else if (isRoot(userId, password) || (user.password === password)) {
      db.getSessionId(userId, (sessionId: SessionId) => {
        // console.log(sessionId)
        if (!sessionId) {
          const sessionId = uuid()
          sessionIdToSocket.set(sessionId, ws)
          db.setSessionId(userId, sessionId, () => {
            reply(loginSuccess(sessionId))
          })
        }
        else {
          reply(loginFailure(ErrorCode.UserAlreadyLogin, `user ${userId} already login`))
        }
      })
    }
    else {
      reply(loginFailure(ErrorCode.InvalidPassword, `user ${userId} wrong password`))
    }
  })
}

// FIXME: check sessionId
function handleLogout(reply, userId: UserId) {
  // console.log(`logout: ${userId}`)
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

function handleCreateUser(reply, uncheckedSessionId: SessionId, userId: UserId, userName: UserName, password: Password, creatorId: CreatorId) {
  db.getSessionId(creatorId, (sessionId) => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getUser(userId, user => {
        if (user) {
          reply(createUserFailure(ErrorCode.UserExists, `user ${userId} exists`))
        }
        else {
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
      reply(createUserFailure(ErrorCode.UnknownUser, `unknown creator ${creatorId}`))
    }
  })
}

function handleRemoveUser(reply, uncheckedSessionId: SessionId, userId: UserId, removerId: RemoverId) {
  db.getSessionId(removerId, (sessionId) => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getUser(userId, user => {
        if (!user) {
          reply(removeUserFailure(ErrorCode.UserNotExists, `unknown user ${userId}`))
        }
        else {
          db.removeUser(userId, () => {
            reply(removeUserSuccess())
          })
        }
      })
    }
    else {
      reply(removeUserFailure(ErrorCode.UnknownUser, `unknown remover ${removerId}`))
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
            db.setTableUpdate(tableId, table.version, message, () => {
              const update = {
                updateType: message.msgType,
                tableId: tableId,
                rowId: rowId,
                values: values
              }
              const msg = sendTableUpdate(sessionId, updatorId, update)
              publish(msg, () => {
                reply(appendRowSuccess(rowId))
              })
            })
          })
        }
        else {
          reply(appendRowFailure(rowId, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(appendRowFailure(rowId, 'unknown session'))
    }
  })
}

function handleInsertRow(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const values = pl.values
  const updatorId = pl.updatorId
  const afterRowId = pl.afterRowId

  // console.log(`append row\n${JSON.stringify(table)}\n${tableUpdate}`)

  // console.log(`after row id: ${afterRowId}`)

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId == uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          let i = -1
          if (afterRowId) {
            // console.log(`${table.rows.length}`)
            let index 
            for (index = 0; index < table.rows.length; index++) {
              // console.log(`row: ${table.rows[index].rowId}`)
              if (table.rows[index].rowId === afterRowId) {
                i = index
                break
              }
            }
            if (i === -1) {
              reply(insertRowFailure(rowId, ErrorCode.RowNotExists, `row ${afterRowId} not found`))
              return
            }
          }
          table.version = table.version + 1
          table.rows.splice(i + 1, 0, {rowId: rowId, values: values})

          // console.log(table)

          db.setTableSnap(tableId, table, () => {
            // console.log('saved table')
            db.setTableUpdate(tableId, table.version, message, () => {
            // console.log('saved updated')
              const update = {
                updateType: message.msgType,
                tableId: tableId,
                rowId: rowId,
                afterRowId: afterRowId,
                values: values
              }
              const msg = sendTableUpdate(sessionId, updatorId, update)
              publish(msg, () => {
                reply(insertRowSuccess(rowId))
                // console.log('sent response')
              })
            })
          })
        }
        else {
          reply(insertRowFailure(rowId, ErrorCode.TableNotExists, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(insertRowFailure(rowId, ErrorCode.UnknownUser, 'unknown session'))
    }
  })
}

function handleRemoveRow(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const updatorId = pl.updatorId

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          // console.log(JSON.stringify(table))
          // console.log(rowId)
          const rowIndex = getRowIndex(table, rowId) 
          // console.log(rowIndex)
          if (rowIndex != -1) {
            const row = table.rows.splice(rowIndex, 1)[0]
            table.version = table.version + 1
            db.setTableSnap(tableId, table, () => {
              db.setTableUpdate(tableId, table.version, message, () => {
                const update = {
                  updateType: message.msgType,
                  tableId: tableId,
                  rowId: rowId,
                  values: row.values
                }
                const msg = sendTableUpdate(sessionId, updatorId, update)
                publish(msg, () => {
                  reply(removeRowSuccess(rowId))
                })
              })
            }) 
          }
          else {
            reply(removeRowFailure(rowId, `row ${rowId} not exists`))
          }
        }
        else {
          reply(removeRowFailure(rowId, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(removeRowFailure(rowId, 'unknown session'))
    }
  }) 
}

function handleRemoveAllRows(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const updatorId = pl.updatorId

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          // console.log(JSON.stringify(table))
          // console.log(rowId)
          // console.log(rowIndex)
          table.rows = []
          table.version = table.version + 1
          db.setTableSnap(tableId, table, () => {
            db.setTableUpdate(tableId, table.version, message, () => {
              const update = {
                updateType: message.msgType,
                tableId: tableId,
              }
              const msg = sendTableUpdate(sessionId, updatorId, update)
              publish(msg, () => {
                reply(removeAllRowsSuccess())
              })
            })
          }) 
        }
        else {
          reply(removeAllRowsFailure(`table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(removeAllRowsFailure('unknown session'))
    }
  }) 
}

function handleUpdateCell(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const columnName = pl.columnName
  const value = pl.value
  const updatorId = pl.updatorId

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          const rowIndex = getRowIndex(table, rowId)
          if (rowIndex != -1) {
            const columnIndex = table.columns.indexOf(columnName)
            if (columnIndex === -1) {
              reply(updateCellFailure(tableId, rowId, columnName, `column ${columnName} not exists`))
            }
            else {
              // console.log(JSON.stringify(table))
              // console.log(rowIndex)
              table.version = table.version + 1
              const row = table.rows[rowIndex]
              row.values[columnIndex] = value

              db.setTableSnap(tableId, table, () => {
                db.setTableUpdate(tableId, table.version, message, () => {
                  const update = {
                    updateType: message.msgType,
                    tableId: tableId,
                    rowId: rowId,
                    columnIndex: columnIndex,
                    value: value,
                  }
                  const msg = sendTableUpdate(sessionId, updatorId, update)
                  publish(msg, () => {
                    reply(updateCellSuccess(tableId, rowId, columnName))
                  })
                })
              })
            }
          }
          else {
            reply(updateCellFailure(tableId, rowId, columnName, `row ${rowId} not exists`))
          }
        }
        else {
          reply(updateCellFailure(tableId, rowId, columnName, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(updateCellFailure(tableId, rowId, columnName, 'unknown session'))
    }
  }) 
}

function handleMoveRowAndUpdateCell(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const rowId = pl.rowId
  const afterRowId = pl.afterRowId
  const columnName = pl.columnName
  const value = pl.value
  const updatorId = pl.updatorId

  db.getSessionId(updatorId, sessionId => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getTableSnap(tableId, table => {
        if (table) {
          const rowIndex = getRowIndex(table, rowId)
          if (rowIndex != -1) {
            const row = table.rows[rowIndex]
            // update cell
            let columnIndex = undefined
            if (columnName) {
              columnIndex = table.columns.indexOf(columnName)
              if (columnIndex === -1) {
                reply(moveRowAndUpdateCellFailure(tableId, rowId, afterRowId, columnName, `column ${columnName} not exists`))
              }
              else {
                // console.log(JSON.stringify(table))
                // console.log(rowIndex)
                row.values[columnIndex] = value
              }
            }

            // move row
            const newRowIndex = afterRowId ? getRowIndex(table, afterRowId) : -1 
            const newRow = table.rows.splice(rowIndex, 1)
            table.rows.splice(newRowIndex + 1, 0, newRow[0])

            table.version = table.version + 1

            db.setTableSnap(tableId, table, () => {
              db.setTableUpdate(tableId, table.version, message, () => {
                const update = {
                  updateType: message.msgType,
                  tableId: tableId,
                  rowId: rowId,
                  afterRowId: afterRowId,
                  columnIndex: columnIndex,
                  value: value,
                }
                const msg = sendTableUpdate(sessionId, updatorId, update)
                publish(msg, () => {
                  reply(moveRowAndUpdateCellSuccess(tableId, rowId, afterRowId, columnName))
                })
              })
            })
          }
          else {
            reply(moveRowAndUpdateCellFailure(tableId, rowId, afterRowId, columnName, `row ${rowId} not exists`))
          }
        }
        else {
          reply(moveRowAndUpdateCellFailure(tableId, rowId, afterRowId, columnName, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(moveRowAndUpdateCellFailure(tableId, rowId, afterRowId, columnName, 'unknown session'))
    }
  }) 
}

function handleCreateTable(reply, message) {
  const pl = message.payLoad
  const sessionId = pl.sessionId
  const tableId = pl.tableId 
  const tableName = pl.tableName 
  const columns = pl.columns
  const creatorId = pl.creatorId

  db.getSessionId(creatorId, (storedSessionId) => {
    if (storedSessionId === sessionId) {
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
              // FIXME: why send user
              const userId = null
              const update = {
                updateType: message.msgType,
                tableId: tableId,
                tableName: tableName,
                columns: columns,
                creatorId: creatorId,
              }
              const tableUpdate = sendTableUpdate(sessionId, userId, update)
              publish(tableUpdate, () => {
                const tableSnap = sendTableSnap(sessionId, creatorId, table)
                publish(tableSnap, () => {
                  reply(createTableSuccess(tableId))
                })
              })
            })
          })
        }
        else {
          reply(createTableFailure(tableId, ErrorCode.TableExists, `table ${tableId} exists`))
        }
      })
    }
    else {
      reply(createTableFailure(tableId, ErrorCode.UnknownUser, `${sessionId} unknown session`))
    }
  })
}

function handleRemoveTable(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const tableId = pl.tableId 
  const removerId = pl.removerId

  db.getSessionId(removerId, (sessionId) => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.getTableSnap(tableId, (tableSnap) => {
        if (tableSnap) {
          db.setTableUpdate(tableId, tableSnap.version + 1, JSON.stringify(message), (_) => {
            db.removeTableSnap(tableId, () => {
              const update = {
                updateType: message.msgType,
                tableId: tableId,
              }
              const tableUpdate = sendTableUpdate(sessionId, removerId, update)
              publish(tableUpdate, () => {
                reply(removeTableSuccess(tableId))
              })
            })
          })
        }
        else {
          reply(removeTableFailure(tableId, ErrorCode.TableNotExists, `table ${tableId} not exists`))
        }
      })
    }
    else {
      reply(removeTableFailure(tableId, ErrorCode.UnknownUser, `${sessionId} unknown session`))
    }
  })
}

function handleSubscribeTables(reply, message) {
  const pl = message.payLoad
  const uncheckedSessionId = pl.sessionId
  const subscriberId = pl.subscriberId

  db.getSessionId(subscriberId, sessionId => {
    if (sessionId && sessionId === uncheckedSessionId) {
      db.setSubscriber(sessionId, subscriberId, () => {
        db.getTables(tables => {
          if (tables) {
            // console.log(tables)
            // console.log(typeof tables)
            Object.entries(tables).forEach(([_, table]: [TableId, Table]) => {
              // console.log(table)
              reply(sendTableSnap(sessionId, subscriberId, table))
              reply(subscribeTablesSuccess(sessionId, subscriberId))
            })
          }
        })
      })
    }
    else {
      reply(subscribeTablesFailure(sessionId, subscriberId, `subscriberId: ${subscriberId} not login`))
    }
  }) 

}

// FIXME: this is slow
function getRowIndex(table: Table, rowId: RowId): number {
  let index =0 
  while (index < table.rows.length) {
    if (table.rows[index].rowId === rowId) {
      return index
    }
    index++
  }

  return -1;
}

export class TableFlowServer {
  constructor() {
    const wss = new Server({ host: host, port: port })
    console.log('listening', host, port)
    wss.on('connection',  ws => {
      console.log('connected')
      ws.on('message', msg => {
        const message = JSON.parse(msg as string)
        console.log(`recv: ${message.msgType}`)
        if (message.msgType === MsgType.Transaction) {
          // console.log('transaction')
          for (const msg of message.payLoad) {
            const message = JSON.parse(msg as string)
            this.handleMessage(ws, message)
          }
        }
        else {
          this.handleMessage(ws, message)
        }
      })
    })
  }

  handleMessage = (ws, message) => {
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
      case MsgType.RemoveUser:
        handleRemoveUser(reply, message.payLoad.sessionId, message.payLoad.userId, message.payLoad.removerId)
        break
      case MsgType.CreateTable:
        handleCreateTable(reply, message)
        break
      case MsgType.RemoveTable:
        handleRemoveTable(reply, message)
        break
      case MsgType.SubscribeTables:
        handleSubscribeTables(reply, message)
        break
      // FIXME: add UnsubscribeTables
      case MsgType.AppendRow:
        handleAppendRow(reply, message)
        break
      case MsgType.InsertRow:
        handleInsertRow(reply, message)
        break
      case MsgType.RemoveRow:
        handleRemoveRow(reply, message)
        break
      case MsgType.RemoveAllRows:
        handleRemoveAllRows(reply, message)
        break
      case MsgType.UpdateCell:
        handleUpdateCell(reply, message)
        break
      case MsgType.MoveRowAndUpdateCell:
        handleMoveRowAndUpdateCell(reply, message)
        break
      default:
        console.log(`Unknown Msg`)
        break
    }
  }
}

if (require.main === module) {
  const s = new TableFlowServer()
  process.once('SIGTERM', function () {
    db.close()
    setTimeout(() => {
      process.exit(1)
    }, 2000)
  })
  process.once('SIGINT', function () {
    db.close()
    setTimeout(() => {
      process.exit(1)
    }, 2000)
  })

  setInterval(() => {
    const mu = process.memoryUsage();
    const mbNow = mu['heapUsed'] / 1024 / 1024 / 1024;
    //console.log(`Total allocated       ${Math.round(mbNow * 100) / 100} GB`);
    console.log(`Allocated since start ${Math.round((mbNow) * 100) / 100} GB`);

  }, 10000)
}