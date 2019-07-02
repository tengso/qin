export type SessionId = string
export type UserId = string
export type UserName = string
export type RequestId = string
export type Password = string
export type TableId = string
export type TableName = string
export type Reason = string
export type RowId = string
export type OwnerId = UserId
export type UpdaterId = UserId
export type TableVersion = number
export type UpdaterName = UserName

export type ColumnName = string
export type ColumnType = string | number | null | boolean | [] | Object

export type ColumnIndex = number

export enum MessageType {
    // Request
    Login,
    Logout,
    AddUser,
    RemoveUser,
    AddTable,
    RemoveTable,
    AddRow,
    RemoveRow,
    UpdateCell,

    // Response
    LoginSuccess,
    LogoutSuccess,
    AddUserSuccess,
    RemoveUserSuccess,
    AddTableSuccess,
    RemoveTableSuccess,
    AddRowSuccess,
    RemoveRowSuccess,
    UpdateCellSuccess,

    LoginFailure,
    LogoutFailure,
    AddUserFailure,
    RemoveUserFailure,
    AddTableFailure,
    RemoveTableFailure,
    AddRowFailure,
    RemoveRowFailure,
    UpdateCellFailure,

    // Feedback
    TableAddRow,
    TableRemoveRow,
    TableUpdateCell,
}

export interface Message {
    type: MessageType
    payLoad: any
}

export interface TableRow {
    rowId: RowId
    values: ColumnType
}

export interface TableColumn {
    name: ColumnName
    type: ColumnType
}

export interface Request {
    sessionId: SessionId
    requestId: RequestId
}

export interface LoginRequest {
    userId: UserId
    password: Password
}

export interface LoginSuccess {
    sessionId: SessionId
}

export interface LoginFailure {
    reason: Reason
}

export interface LogoutRequest {
    sessionId: SessionId
    userId: UserId
}

export interface LogoutSuccess {}

export interface LogoutFailure {
    reason: Reason
}


export interface Response {
    requestId: RequestId
}

export interface AddUserRequest extends Request {
    newUserId: UserId
    newUserName: UserName
    newUserPassword: Password
}

export interface AddUserSuccess extends Response {}
export interface AddUserFailure extends Response {
    reason: Reason
}

export interface RemoveUserRequest extends Request {
    userId: UserId
}

export interface RemoveUserSuccess extends Response {}
export interface RemoveUserFailure extends Response {
    reason: Reason
}

export interface AddTableRequest extends Request {
    tableId: TableId
    tableName: TableName
    columns: TableColumn[]
    ownerId: OwnerId
}

export interface AddTableSuccess extends Response {}
export interface AddTableFailure extends Response {
    reason: Reason
}

export interface RemoveTableRequest extends Request {
    tableId: TableId
    tableName: TableName
    columns: TableColumn[]
    rows: TableRow[]
}

export interface RemoveTableSuccess extends Response {}
export interface RemoveTableFailure extends Response {
    reason: Reason
}

export interface AddRowRequest extends Request {
    row: TableRow
}

export interface AddRowSuccess extends Response {}
export interface AddRowFailure extends Response {
    reason: Reason
}

export interface RemoveRowRequest extends Request {
    rowId: RowId
}

export interface RemoveRowSuccess extends Response {}
export interface RemoveRowFailure extends Response {
    reason: Reason
}

export interface UpdateCellRequest extends Request {
    tableId: TableId
    rowId: RowId
    columnIndex: ColumnIndex
    newValue: ColumnType
}

export interface UpdateCellSuccess extends Response {}
export interface UpdateCellFailure extends Response {
    reason: Reason
}

export interface Table {
    tableId: TableId
    tableName: TableName
    version: TableVersion
    columns: TableColumn[]
    rows: TableRow[]
    owner: OwnerId
}

export interface TableFeedback {
    tableId: TableId
    tableName: TableName
}

export interface TableSnap extends TableFeedback {
    table: Table
}

export interface TableUpdate extends TableFeedback {
    updaterId: UpdaterId
    updaterName: UpdaterName
}

export interface TableAddRow extends TableFeedback {
    row: TableRow
}
export interface TableRemoveRow extends TableFeedback {
    rowId: RowId
}

export interface TableUpdateCell extends TableFeedback {
    rowId: RowId
    columnIndex: ColumnIndex
    newValue: ColumnType
}

export interface EventListener {
    loginSuccess(sessionId: SessionId): void
    loginFailure(reason: Reason): void

    logoutSuccess(): void
    logoutFailure(reason: Reason): void

    addUserSuccess(requestId: RequestId): void
    addUserFailure(requestId: RequestId, reason: Reason): void

    removeUserSuccess(requestId: RequestId): void
    removeUserFailure(requestId: RequestId, reason: Reason): void

    addRowSuccess(requestId: RequestId): void
    addRowFailure(requestId: RequestId, reason: Reason): void

    removeRowSuccess(requestId: RequestId): void
    removeRowFailure(requestId: RequestId, reason: Reason): void

    updateCellSuccess(requestId: RequestId): void
    updateCellFailure(requestId: RequestId, reason: Reason): void

    tableSnap(table: Table, updaterId: UpdaterId, updaterName: UpdaterName): void
    tableAddRow(tableId: TableId, row: TableRow, updaterId: UpdaterId, updaterName: UpdaterName): void
    tableRemoveRow(tableId: TableId, rowId: RowId, updaterId: UpdaterId, updaterName: UpdaterName): void
    tableUpdateCell(tableId: TableId, rowId: RowId, columnIndex: ColumnIndex, value: ColumnType, updaterId: UpdaterId, 
        updaterName: UpdaterName): void
}

export interface Interface {
    login(userId: UserId, password: Password): void
    logout(): void

    addUser(userId: UserId, userName: UserName, password: Password): void
    removeUser(userId: UserId): void

    addTable(tableId: TableId, tableName: TableName, tableColumns: TableColumn[], owner: OwnerId): void
    removeTable(tableId: TableId): void

    addRow(row: TableRow): void
    removeRow(rowId: RowId): void
    updateCell(tableId: TableId, rowId: RowId, columnIndex: ColumnIndex, newValue: ColumnType): void
}