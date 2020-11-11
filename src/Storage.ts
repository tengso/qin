import {UserId, SessionId, TableId, UserInfo, Table, Version, RowId } from './TableFlowMessages'

export interface Storage {
  beginTransaction(callback): void
  endTransaction(callback): void

  setSessionId(userId: UserId, sessionId: SessionId, callback): void 
  getSessionId(userId: UserId, callback): void
  removeSessionId(userId: UserId, callback): void

  setUser(userId: UserId, userInfo: UserInfo, callback): void
  getUser(userId: UserId, callback): void
  removeUser(userId: UserId, callback): void

  setSubscriber(sessionId: SessionId, userId: UserId, callback): void
  removeSubscriber(sessionI: SessionId, userId: UserId, callback): void
  getSubscribers(callback): void 

  setTableSnap(tableId: TableId, table: Table, callback): void
  getTableSnap(tableId: TableId, callback): void
  removeTableSnap(tableId: TableId, callback): void
  getTables(callback): void

  setTableUpdate(tableId: TableId, version: Version, update: any, callback): void
  getTableUpdate(tableId: TableId, version: Version, callback): void

  close(): void
}
