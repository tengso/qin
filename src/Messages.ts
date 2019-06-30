export type Version = number

export type UserId = string
export type UserName = string
export type Password = string

export type CreatorId = string
export type UpdatorId = string

export type TableId = string
export type TableName = string

export type ColumnName = string
export type ColumnValue = String

export type SessionId = string

export type RowId = string

export type SubscriberId = string

export interface UserInfo {
  userId: UserId,
  userName: UserName,
  password: Password
}

export interface Row {
  rowId: RowId
  values: Object[]
}

export interface Table {
  tableId: TableId
  tableName: TableName
  version: Version
  columns: ColumnName[]
  rows:  Row[]
  creatorId: CreatorId
}

export enum MsgType {

  CreateUser = 'createUser',
  CreateUserSuccess = 'createUserSuccess',
  CreateUserFailure = 'createUserFailure',

  CreateTable = 'createTable',
  CreateTableSuccess = 'createTableSuccess',
  CreateTableFailure = 'createTableFailure',

  AppendRow = 'appendRow',
  AppendRowSuccess = 'appendRowSuccess',
  AppendRowFailure = 'appendRowFailure',

  RemoveRow = 'removeRow',
  RemoveRowSuccess = 'removeRowSuccess',
  RemoveRowFailure = 'removeRowFailure',

  UpdateCell = 'updateCell',
  UpdateCellSuccess = 'updateCellSuccess',
  UpdateCellFailure = 'updateCellFailure',

  Login = 'login',
  LoginSuccess = 'loginSuccess',
  LoginFailure = 'loginFailure',

  Logout = 'logout',
  LogoutSuccess = 'logoutSuccess',
  LogoutFailure = 'logoutFailure',

  SubscribeTables = 'subscribeTables',
  SubscribeTablesSuccess = 'subscribeTablesSuccess',
  SubscribeTablesFailure = 'subscribeTablesFailure',

  TableUpdate = 'tableUpdate',
  TableSnap = 'tableSnap',
}


export function createUser(
  sessionId: SessionId,
  userId: UserId,
  userName: UserName,
  password: Password,
  creatorId: CreatorId
) {
  const msg = {
    msgType: MsgType.CreateUser,
    payLoad: {
        sessionId: sessionId,
        userId: userId,
        password: password,
        userName: userName,
        creatorId: creatorId,
    } 
  }

  return JSON.stringify(msg)
}

export function createTable(
  sessionId: SessionId,
  tableId: TableId,
  tableName: TableName,
  columns: ColumnName[],
  creatorId: CreatorId
) {
  const msg = {
    msgType: MsgType.CreateTable,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      tableName: tableName,
      columns: columns,
      creatorId: creatorId
    }
  }

  return JSON.stringify(msg)
}

export function appendTableRow(
  sessionId: SessionId,
  tableId: TableId,
  rowId: RowId,
  values: ColumnValue[],
  updatorId: UpdatorId
) {
  const msg = {
    msgType: MsgType.AppendRow,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      values: values,
      updatorId: updatorId
    }
  }

  return JSON.stringify(msg)
}

export function removeTableRow(sessionId: SessionId, tableId: TableId, rowId: RowId, updatorId: UpdatorId) {
  const msg = {
    msgType: MsgType.RemoveRow,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      updatorId: updatorId
    }
  }

  return JSON.stringify(msg)
}

export function updateCell(
  sessionId: SessionId,
  tableId: TableId,
  rowId: RowId,
  columnName: ColumnName,
  value: ColumnValue,
  updatorId: UpdatorId
) {
  const msg = {
    msgType: MsgType.UpdateCell,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      columnName: columnName,
      value: value,
      updatorId: updatorId
    }
  }

  return JSON.stringify(msg)
}

export function subscribeTables(
  sessionId: SessionId,
  subscriberId: SubscriberId
) {
  const msg = {
    msgType: MsgType.SubscribeTables,
    payLoad: {
      sessionId: sessionId,
      subscriberId: subscriberId
    }
  }

  return JSON.stringify(msg)
}

export function subscribeTablesSuccess(sessionId: SessionId, subscriberId: SubscriberId) {
  const msg = {
    msgType: MsgType.SubscribeTablesSuccess,
    payLoad: {
      sessionId: sessionId,
      subscriberId: subscriberId
    }
  }

  return JSON.stringify(msg)
}

export function subscribeTablesFailure(sessionId: SessionId, subscriberId: SubscriberId, reason: string) {
  const msg = {
    msgType: MsgType.SubscribeTablesFailure,
    payLoad: {
      sessionId: sessionId,
      subscriberId: subscriberId,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function login(userId: UserId, password: Password) {
  const msg = {
    msgType: MsgType.Login,
    payLoad: {
      userId: userId,
      password: password
    }
  }

  return JSON.stringify(msg)
}

export function logout(userId: UserId) {
  const msg = {
    msgType: MsgType.Logout,
    payLoad: {
      userId: userId
    }
  }

  return JSON.stringify(msg)
}

export function loginSuccess(sessionId: SessionId) {
  const msg = {
    msgType: MsgType.LoginSuccess,
    payLoad: {
      sessionId: sessionId
    }
  }

  return JSON.stringify(msg)
}

export function loginFailure(reason: string) {
  const msg = {
    msgType: MsgType.LoginFailure,
    payLoad: {
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function logoutSuccess() {
  const msg = {
    msgType: MsgType.LogoutSuccess,
  }

  return JSON.stringify(msg)
}

export function logoutFailure(reason: string) {
  const msg = {
    msgType: MsgType.LogoutFailure,
    payLoad: {
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function createUserSuccess() {
  const msg = {
    msgType: MsgType.CreateUserSuccess,
  }

  return JSON.stringify(msg)
}

export function createUserFailure(reason: string) {
  const msg = {
    msgType: MsgType.CreateUserFailure,
    payLoad: {
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function createTableSuccess(tableId: TableId) {
  const msg = {
    msgType: MsgType.CreateTableSuccess,
    payLoad: {
      tableId: tableId
    }
  }

  return JSON.stringify(msg)
}

export function createTableFailure(tableId: TableId, reason: string) {
  const msg = {
    msgType: MsgType.CreateTableFailure,
    payLoad: {
      tableId: tableId,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function appendTableRowSuccess(rowId: RowId) { 
  const msg = {
    msgType: MsgType.AppendRowSuccess,
    payLoad: {
      rowId: rowId
    }
  }

  return JSON.stringify(msg)
}

export function appendTableRowFailure(rowId: RowId, reason: string) {
  const msg = {
    msgType: MsgType.AppendRowFailure,
    payLoad: {
      rowId: rowId,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function removeTableRowSuccess(rowId: RowId) { 
  const msg = {
    msgType: MsgType.RemoveRowSuccess,
    payLoad: {
      rowId: rowId
    }
  }

  return JSON.stringify(msg)
}

export function removeTableRowFailure(rowId: RowId, reason: string) {
  const msg = {
    msgType: MsgType.RemoveRowFailure,
    payLoad: {
      rowId: rowId,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function updateCellSuccess(tableId: TableId, rowId: RowId, columnName: ColumnName) { 
  const msg = {
    msgType: MsgType.UpdateCellSuccess,
    payLoad: {
      tableId: tableId,
      rowId: rowId,
      columnName: columnName
    }
  }

  return JSON.stringify(msg)
}

export function updateCellFailure(tableId: TableId, rowId: RowId, columnName: ColumnName, reason: string) {
  const msg = {
    msgType: MsgType.UpdateCellFailure,
    payLoad: {
      tableId: tableId,
      rowId: rowId,
      columnName: columnName,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function sendTableSnap(sessionId: SessionId, subscriberId: SubscriberId, table: Table) {
  const msg = {
    msgType: MsgType.TableSnap,
    payLoad: {
      sessionId: sessionId,
      subscriberId: subscriberId,
      table: table
    }
  }
  return JSON.stringify(msg)
}

export function sendTableUpdate(sessionId: SessionId, subscriberId: SubscriberId, update) {
  const msg = {
    msgType: MsgType.TableUpdate,
    payLoad: {
      sessionId: sessionId,
      subscriberId: subscriberId,
      update: update
    }
  }
  return JSON.stringify(msg)
}