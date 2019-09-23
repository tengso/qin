export type Version = number

export type UserId = string
export type UserName = string
export type Password = string

export type CreatorId = string
export type UpdatorId = string
export type RemoverId = string 
export type TableId = string
export type TableName = string

export type ColumnName = string
export type ColumnValue = Object

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

  Transaction = 'transaction',

  CreateUser = 'createUser',
  CreateUserSuccess = 'createUserSuccess',
  CreateUserFailure = 'createUserFailure',

  RemoveUser = 'removeUser',
  RemoveUserSuccess = 'removeUserSuccess',
  RemoveUserFailure = 'removeUserFailure',

  CreateTable = 'createTable',
  CreateTableSuccess = 'createTableSuccess',
  CreateTableFailure = 'createTableFailure',

  RemoveTable = 'removeTable',
  RemoveTableSuccess = 'removeTableSuccess',
  RemoveTableFailure = 'removeTableFailure',

  AppendRow = 'appendRow',
  AppendRowSuccess = 'appendRowSuccess',
  AppendRowFailure = 'appendRowFailure',

  InsertRow = 'insertRow',
  InsertRowSuccess = 'insertRowSuccess',
  InsertRowFailure = 'insertRowFailure',

  RemoveRow = 'removeRow',
  RemoveRowSuccess = 'removeRowSuccess',
  RemoveRowFailure = 'removeRowFailure',

  UpdateCell = 'updateCell',
  UpdateCellSuccess = 'updateCellSuccess',
  UpdateCellFailure = 'updateCellFailure',

  MoveRowAndUpdateCell = 'moveRowAndUpdateCell',
  MoveRowAndUpdateCellSuccess = 'moveRowAndUpdateCellSuccess',
  MoveRowAndUpdateCellFailure = 'moveRowAndUpdateCellFailure',

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

export enum ErrorCode {
  UserAlreadyLogin,
  UnknownUser,
  InvalidPassword,
  UserExists,
  UserNotExists,
  TableExists,
  TableNotExists,
  RowNotExists,
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

export function createUserSuccess() {
  const msg = {
    msgType: MsgType.CreateUserSuccess,
  }

  return JSON.stringify(msg)
}

export function createUserFailure(errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.CreateUserFailure,
    payLoad: {
      reason: reason,
      errorCode: errorCode
    }
  }

  return JSON.stringify(msg)
}

export function removeUser(
  sessionId: SessionId,
  userId: UserId,
  removerId: RemoverId
) {
  const msg = {
    msgType: MsgType.RemoveUser,
    payLoad: {
        sessionId: sessionId,
        userId: userId,
        removerId: removerId,
    } 
  }

  return JSON.stringify(msg)
}

export function removeUserSuccess() {
  const msg = {
    msgType: MsgType.RemoveUserSuccess,
  }

  return JSON.stringify(msg)
}

export function removeUserFailure(errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.RemoveUserFailure,
    payLoad: {
      reason: reason,
      errorCode: errorCode
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

export function createTableSuccess(tableId: TableId) {
  const msg = {
    msgType: MsgType.CreateTableSuccess,
    payLoad: {
      tableId: tableId
    }
  }

  return JSON.stringify(msg)
}

export function createTableFailure(tableId: TableId, errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.CreateTableFailure,
    payLoad: {
      tableId: tableId,
      reason: reason,
      errorCode: errorCode,
    }
  }

  return JSON.stringify(msg)
}

export function removeTable(
  sessionId: SessionId,
  tableId: TableId,
  removerId: RemoverId
) {
  const msg = {
    msgType: MsgType.RemoveTable,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      removerId: removerId
    }
  }

  return JSON.stringify(msg)
}

export function removeTableSuccess(tableId: TableId) {
  const msg = {
    msgType: MsgType.RemoveTableSuccess,
    payLoad: {
      tableId: tableId
    }
  }

  return JSON.stringify(msg)
}

export function removeTableFailure(tableId: TableId, errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.RemoveTableFailure,
    payLoad: {
      tableId: tableId,
      reason: reason,
      errorCode: errorCode
    }
  }

  return JSON.stringify(msg)
}

export function appendRow(
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

export function appendRowSuccess(rowId: RowId) { 
  const msg = {
    msgType: MsgType.AppendRowSuccess,
    payLoad: {
      rowId: rowId
    }
  }

  return JSON.stringify(msg)
}

export function appendRowFailure(rowId: RowId, reason: string) {
  const msg = {
    msgType: MsgType.AppendRowFailure,
    payLoad: {
      rowId: rowId,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}

export function insertRow(
  sessionId: SessionId,
  tableId: TableId,
  rowId: RowId,
  afterRowId: RowId | undefined,
  values: ColumnValue[],
  updatorId: UpdatorId
) {
  const msg = {
    msgType: MsgType.InsertRow,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      afterRowId: afterRowId,
      values: values,
      updatorId: updatorId
    }
  }

  return JSON.stringify(msg)
}

export function insertRowSuccess(rowId: RowId) { 
  const msg = {
    msgType: MsgType.InsertRowSuccess,
    payLoad: {
      rowId: rowId
    }
  }

  return JSON.stringify(msg)
}

export function insertRowFailure(rowId: RowId, errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.InsertRowFailure,
    payLoad: {
      rowId: rowId,
      errorCode: errorCode,
      reason: reason
    }
  }

  return JSON.stringify(msg)
}
export function removeRow(sessionId: SessionId, tableId: TableId, rowId: RowId, updatorId: UpdatorId) {
  const msg = {
    msgType: MsgType.RemoveRow,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      updatorId: updatorId,
    }
  }

  return JSON.stringify(msg)
}

export function removeRowSuccess(rowId: RowId) { 
  const msg = {
    msgType: MsgType.RemoveRowSuccess,
    payLoad: {
      rowId: rowId
    }
  }

  return JSON.stringify(msg)
}

export function removeRowFailure(rowId: RowId, reason: string) {
  const msg = {
    msgType: MsgType.RemoveRowFailure,
    payLoad: {
      rowId: rowId,
      reason: reason
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

export function moveRowAndUpdateCell(
  sessionId: SessionId,
  tableId: TableId,
  rowId: RowId,
  afterRowId: RowId | undefined,
  columnName: ColumnName | undefined,
  value: ColumnValue | undefined,
  updatorId: UpdatorId,
) {
  const msg = {
    msgType: MsgType.MoveRowAndUpdateCell,
    payLoad: {
      sessionId: sessionId,
      tableId: tableId,
      rowId: rowId,
      afterRowId: afterRowId,
      columnName: columnName,
      value: value,
      updatorId: updatorId,
    }
  }

  return JSON.stringify(msg)
}

export function moveRowAndUpdateCellSuccess(tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName) { 
  const msg = {
    msgType: MsgType.MoveRowAndUpdateCellSuccess,
    payLoad: {
      tableId: tableId,
      rowId: rowId,
      afterRowId: afterRowId,
      columnName: columnName
    }
  }

  return JSON.stringify(msg)
}

export function moveRowAndUpdateCellFailure(tableId: TableId, rowId: RowId, afterRowId: RowId, columnName: ColumnName, reason: string) {
  const msg = {
    msgType: MsgType.MoveRowAndUpdateCellFailure,
    payLoad: {
      tableId: tableId,
      rowId: rowId,
      afterRowId: afterRowId,
      columnName: columnName,
      reason: reason
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

export function loginSuccess(sessionId: SessionId) {
  const msg = {
    msgType: MsgType.LoginSuccess,
    payLoad: {
      sessionId: sessionId
    }
  }

  return JSON.stringify(msg)
}

export function loginFailure(errorCode: ErrorCode, reason: string) {
  const msg = {
    msgType: MsgType.LoginFailure,
    payLoad: {
      errorCode: errorCode,
      reason: reason
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