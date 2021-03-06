import { Storage } from './Storage'
import { TableId, UserId, RowId, SessionId, UserInfo, Table, Version } from './TableFlowMessages'

const redis = require('redis')

class Hash {
  constructor(private namespace='test') {}

  ClientIdToSessionId = `${this.namespace}.ClientIdToSessionId`
  Users = `${this.namespace}.Users`
  Subscribers = `${this.namespace}.Subscribers`
  Tables = `${this.namespace}.Tables`
  TableUpdates = `${this.namespace}.TableUpdates`
}

export class RedisStorage implements Storage {
  private client
  private hash: Hash

  private tables = {}

  constructor(namespace: string = 'test', host = 'localhost', port = 6379) {
    this.client = redis.createClient(port, host)
    console.log(`using db: ${namespace}`, host, port)

    this.client.on('error', function (err) {
      console.log('Error' + err)
    })
    this.hash = new Hash(namespace)
  }
 
  close(): void {
    Object.entries(this.tables).forEach(([tableId, table]) => {
      console.log(`save table ${tableId}`)
      this.client.hset(this.hash.Tables, tableId, JSON.stringify(table), (err, res) => {
        if (!err) {
        }
        else {
          console.log(`failed to save table snap ${tableId}`)
        }
      })
    });
    // this.client.quit()
  }

  beginTransaction(callback: any): void {
      throw new Error("Method not implemented.")
  }      

  endTransaction(callback: any): void {
      throw new Error("Method not implemented.")
  }

  setSessionId(userId: UserId, sessionId: SessionId, callback: any): void {
    this.client.hset(this.hash.ClientIdToSessionId, userId, sessionId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set ${userId} ${sessionId}`)
        callback(undefined)
      }
    })
  }

  getSessionId(userId: UserId, callback: any): void {
    this.client.hget(this.hash.ClientIdToSessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to get ${userId}`)
        callback(undefined)
      }
    })
  }

  removeSessionId(userId: UserId, callback: any): void {
    this.client.hdel(this.hash.ClientIdToSessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove ${userId}`)
        callback(undefined)
      }
    })
  }

  setUser(userId: UserId, userInfo: UserInfo, callback: any): void {
    this.client.hset(this.hash.Users, userId, JSON.stringify(userInfo), (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to get ${userId}`)
        callback(undefined)
      }
    })
  }

  getUser(userId: UserId, callback: any): void {
    this.client.hget(this.hash.Users, userId, (err, res) => {
      if (!err) {
        callback(JSON.parse(res))
      }
      else {
        console.log(`failed to get ${userId}`)
        callback(undefined)
      }
    })
  }

  removeUser(userId: UserId, callback: any): void {
    this.client.hdel(this.hash.Users, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove ${userId} ${err}`)
        callback(undefined)
      }
    })
  }

  setSubscriber(sessionId: string, userId: string, callback: any): void {
    this.client.hset(this.hash.Subscribers, sessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set subscriber ${sessionId} ${userId}`)
        callback(undefined)
      }
    })
  }

  removeSubscriber(sessionId: string, callback: any): void {
    this.client.hdel(this.hash.Subscribers, sessionId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove subscriber ${sessionId}`)
        callback(undefined)
      }
    })
  }

  getSubscribers(callback: any): void {
    this.client.hgetall(this.hash.Subscribers, (err, res) => {
      if (!err) {
        if (res) {
          callback(Object.keys(res))
        }
        else {
          callback(null)
        }
      }
      else {
        console.log(`failed to get subscribers`)
        callback(undefined)
      }
    })
  }

  setTableSnap(tableId: string, table: Table, callback: any): void {
    this.tables[tableId] = table
    if (table.rows.length == 0) {
      this.client.hset(this.hash.Tables, tableId, JSON.stringify(table), (err, res) => {
        if (!err) {
          callback(res)
        }
        else {
          console.log(`failed to set table snap ${tableId}`)
          callback(undefined)
        }
      })
    }
    else {
      callback('')
    }
  }

  getTableSnap(tableId: string, callback: any): void {
    if (tableId in this.tables) {
      callback(this.tables[tableId])
    }
    else {
      this.client.hget(this.hash.Tables, tableId, (err, res) => {
        if (!err) {
          const table = JSON.parse(res)
          this.tables[tableId] = table
          callback(table)
        }
        else {
          console.log(`failed to get table snap ${tableId}`)
          callback(undefined)
        }
      })
    }
  }

  removeTableSnap(tableId: string, callback: any): void {
    this.client.hdel(this.hash.Tables, tableId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove table snap ${tableId}`)
        callback(undefined)
      }
    })
  }

  getTables(callback): void {
    if (Object.keys(this.tables).length === 0) {
      this.client.hgetall(this.hash.Tables, (err, res) => {
        if (!err) {
          if (res) {
            Object.keys(res).forEach(key => {
              res[key] = JSON.parse(res[key])
            })
            this.tables = res
            callback(res)
          }
          else {
            callback(null)
          }
        }
        else {
          console.log(`failed to get tables`)
          callback(undefined)
        }
      })
    }
    else {
      callback(this.tables)
    }
  }

  setTableUpdate(tableId: TableId, version: Version, update: any, callback: any): void {
    this.client.hset(this.hash.TableUpdates, JSON.stringify([tableId, version]), 
      JSON.stringify(update), (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set table update ${tableId} ${version}`)
      }
    })
  }

  getTableUpdate(tableId: string, version: Version, callback: any): void {
    this.client.hget(this.hash.TableUpdates, JSON.stringify([tableId, version]), (err, res) => {
      if (!err) {
        if (res) {
          callback(JSON.parse(res))
        }
        else {
          callback(null)
        }
      }
      else {
        console.log(`failed to get for ${tableId} ${version}`)
        callback(undefined)
      }
    })
  }
}