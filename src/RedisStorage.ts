import { Storage } from './Storage'
import { TableId, UserId, SessionId, UserInfo, Table, Version } from './Messages'

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
  private client = redis.createClient()
  private hash: Hash

  constructor(namespace: string = 'test') {
    this.client.on('error', function (err) {
      console.log('Error' + err)
    })
    this.hash = new Hash(namespace)
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

  setSubscriber(sessionId: string, userId: string, callback: any): void {
    this.client.hset(this.hash.Subscribers, sessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set subscriber ${sessionId} ${userId}`)
      }
    })
  }

  removeSubscriber(sessionId: string, userId: string, callback: any): void {
    this.client.hdel(this.hash.Subscribers, sessionId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove subscriber ${sessionId} ${userId}`)
      }
    })
  }

  getSubscribers(callback: any): void {
    this.client.hgetall(this.hash.Subscribers, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to get subscribers`)
      }
    })
  }

  setTableSnap(tableId: string, table: Table, callback: any): void {
    this.client.hset(this.hash.Tables, tableId, table, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set table snap ${table}`)
      }
    })
  }

  getTableSnap(tableId: string, callback: any): void {
    this.client.hget(this.hash.Tables, tableId, (err, res) => {
      if (!err) {
        callback(JSON.parse(res))
      }
    })
  }

  getTables(callback): void {
    this.client.hgetall(this.hash.Tables, (err, res) => {
      if (!err) {
        // FIXME: parse result
        callback(res)
      }
    })
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

  // getTableUpdate(tableId: string, callback: any): Map<number, any> {
  //     throw new Error("Method not implemented.");
  // }

  setRowIndex(rowId: string, rowIndex: number, callback: any): void {
      throw new Error("Method not implemented.");
  }

  getRowIndex(rowId: string, callback: any): number {
      throw new Error("Method not implemented.");
  }
}