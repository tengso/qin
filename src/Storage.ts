import {UserId, SessionId, TableId, UserInfo, Table, Version, RowId } from './Messages'
import { callbackify } from 'util';

interface Storage {
  beginTransaction(callback): void
  endTransaction(callback): void

  setSessionId(userId: UserId, sessionId: SessionId, callback): void 
  getSessionId(userId: UserId, callback): void
  removeSessionId(userId: UserId, callback): void

  setUser(userId: UserId, userInfo: UserInfo, callback): void
  getUser(userId: UserId, callback): void

  setSubscriber(sessionId: SessionId, userId: UserId, callback): void
  removeSubscriber(sessionI: SessionId, userId: UserId, callback): void
  getSubscribers(callback): void 

  setTableSnap(tableId: TableId, table: Table, callback): void
  getTableSnap(tableId: TableId, callback): void
  getTables(callback): void

  setTableUpdate(tableId: TableId, version: Version, update: any, callback): void
  // getTableUpdate(tableId: TableId, callback): void

  setRowIndex(rowId: RowId, rowIndex: number, callback): void
  getRowIndex(rowId: RowId, callback): void
}

const redis = require('redis')

enum Hash {
    ClientIdToSessionId = 'ClientIdToSessionId',
    Users = 'Users',
    Subscribers = "Subscribers",
    Tables = "Tables",
    TableUpdates = "TableUpdates"
}

export class RedisStorage implements Storage {
  client

  constructor() {
    this.client = redis.createClient();

    this.client.on('error', function (err) {
      console.log('Error' + err);
    });
  }
 
  beginTransaction(callback: any): void {
      throw new Error("Method not implemented.")
  }      

  endTransaction(callback: any): void {
      throw new Error("Method not implemented.")
  }

  setSessionId(userId: UserId, sessionId: SessionId, callback: any): void {
    this.client.hset(Hash.ClientIdToSessionId, userId, sessionId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set ${userId} ${sessionId}`)
      }
    })
  }

  getSessionId(userId: UserId, callback: any): void {
    this.client.hget(Hash.ClientIdToSessionId, userId, (err, res) => {
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
    this.client.hdel(Hash.ClientIdToSessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove ${userId}`)
      }
    })
  }

  setUser(userId: UserId, userInfo: UserInfo, callback: any): void {
    this.client.hset(Hash.Users, userId, JSON.stringify(userInfo), (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to get ${userId}`)
      }
    })
  }

  getUser(userId: UserId, callback: any): void {
    this.client.hget(Hash.Users, userId, (err, res) => {
      if (!err) {
        callback(JSON.parse(res))
      }
      else {
        callback(undefined)
        console.log(`failed to get ${userId}`)
      }
    })
  }

  setSubscriber(sessionId: string, userId: string, callback: any): void {
    this.client.hset(Hash.Subscribers, sessionId, userId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set subscriber ${sessionId} ${userId}`)
      }
    })
  }

  removeSubscriber(sessionId: string, userId: string, callback: any): void {
    this.client.hdel(Hash.Subscribers, sessionId, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to remove subscriber ${sessionId} ${userId}`)
      }
    })
  }

  getSubscribers(callback: any): void {
    this.client.hgetall(Hash.Subscribers, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to get subscribers`)
      }
    })
  }

  setTableSnap(tableId: string, table: Table, callback: any): void {
    this.client.hset(Hash.Tables, tableId, table, (err, res) => {
      if (!err) {
        callback(res)
      }
      else {
        console.log(`failed to set table snap ${table}`)
      }
    })
  }

  getTableSnap(tableId: string, callback: any): void {
    this.client.hget(Hash.Tables, tableId, (err, res) => {
      if (!err) {
        callback(JSON.parse(res))
      }
    })
  }

  getTables(callback): void {
    this.client.hgetall(Hash.Tables, (err, res) => {
      if (!err) {
        // FIXME: parse result
        callback(res)
      }
    })
  }

  setTableUpdate(tableId: TableId, version: Version, update: any, callback: any): void {
    this.client.hset(Hash.TableUpdates, JSON.stringify([tableId, version]), 
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
