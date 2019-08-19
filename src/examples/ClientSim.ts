import { ErrorCode, Table, TableId, TableName, ColumnName, RowId, ColumnValue, SessionId } from '../TableFlowMessages'
import { ClientCallback, Client } from '../TableFlowClient'

function createTableUtil(tableId: TableId, tableName: TableName, columns: ColumnName[]) {
  const tables = document.getElementById("tables")
  const table = document.createElement("table")

  const paragraph = document.createElement("p")
  paragraph.setAttribute("id", `${tableId}-p`)
  paragraph.appendChild(document.createTextNode(tableName))
  tables.appendChild(paragraph)
  
  table.setAttribute("id", tableId)
  table.border = '1'
  tables.appendChild(table)

  table.createTHead()

  for (const column of columns) {
    const c = table.tHead.appendChild(document.createElement("th"))
    c.innerHTML = column
  }
}

function clearTablesUtil() {
  const tables = document.getElementById("tables")

  while (tables.firstChild) {
    tables.removeChild(tables.firstChild)
  }
}

function removeTableUtil(tableId: TableId) {
  const table = document.getElementById(tableId)
  const tableName = document.getElementById(`${tableId}-p`)

  if (table) {
    table.parentNode.removeChild(table)
  }

  if (tableName) {
    tableName.parentNode.removeChild(tableName)
  }
}

function appendRowUtil(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
  const table: HTMLTableElement = document.getElementById(tableId) as HTMLTableElement

  const rowCount = table.rows.length
  const row = table.insertRow(rowCount)
  row.setAttribute("id", rowId)

  values.forEach((value, i) => {
    row.insertCell(i).innerHTML = value.toString()
  })
}

// FIXME:
function insertRowUtil(tableId: TableId, rowId: RowId, afterRowId: RowId, values: ColumnValue[]) {
  const table: HTMLTableElement = document.getElementById(tableId) as HTMLTableElement

  const rowCount = table.rows.length
  const row = table.insertRow(rowCount)
  row.setAttribute("id", rowId)

  values.forEach((value, i) => {
    row.insertCell(i).innerHTML = value.toString()
  })
}

function removeRowUtil(rowId: RowId) {
  const row = document.getElementById(rowId)
  row.parentNode.removeChild(row)
}

function updateCellUtil(rowId: RowId, columnIndex: number, value: ColumnValue) {
  const row = document.getElementById(rowId);
  (row.childNodes[columnIndex] as HTMLElement).innerHTML = value.toString()
}

class Callback implements ClientCallback {

  connectSuccess(client: Client): void {
    this.logMessage('connect success')
  }

  connectFailure(): void {
    this.logMessage('connect failure')
  }

  logoutFailure(reason: string): void {
    this.logMessage(`login failure ${reason}`)
  }

  createUserFailure(errorCode: ErrorCode, reason: string): void {
    this.logMessage(`create user failure ${reason} ${errorCode}`)
  }

  removeUserSuccess(): void {
    this.logMessage(`remove user success`)
  }

  removeUserFailure(errorCode: ErrorCode, reason: string): void {
    this.logMessage(`remove user failure ${reason} ${errorCode}`)
  }

  createTableFailure(tableId: string, errorCode: ErrorCode, reason: string): void {
    this.logMessage(`create table failure ${tableId} ${reason} ${errorCode}`)
  }

  removeTableSuccess(tableId: string): void {
    this.logMessage(`remove table success ${tableId}`)
  }

  removeTableFailure(tableId: string, errorCode: ErrorCode, reason: string): void {
    this.logMessage(`remove table failure ${tableId} ${reason} ${errorCode}`)
  }

  appendRowFailure(rowId: string, errorCode: ErrorCode, reason: string): void {
    this.logMessage(`append row failure ${rowId} ${reason} ${errorCode}`)
  }

  insertRowFailure(rowId: string, errorCode: ErrorCode, reason: string) {
    this.logMessage(`insert row failure ${rowId} ${reason} ${errorCode}`)
  } 

  removeRowFailure(rowId: string, errorCode: ErrorCode, reason: string): void {
    this.logMessage(`remove row failure ${rowId} ${reason} ${errorCode}`)
  }

  updateCellFailure(tableId: string, rowId: string, columnName: string, errorCode: ErrorCode, reason: string): void {
    this.logMessage(`update cell failure ${tableId} ${rowId} ${reason} ${errorCode}`)
  }

  loginSuccess(sessionId: SessionId) {
    this.logMessage(`login success ${sessionId}`)
  }

  loginFailure(errorCode: ErrorCode, reason: string): void {
    this.logMessage(`login failure ${reason} ${errorCode}`)
  }

  logoutSuccess() {
    this.logMessage(`logout success`)
  }

  createUserSuccess() {
    this.logMessage(`create user success`)
  }

  createTableSuccess(tableId: TableId) {
    this.logMessage(`create table success ${tableId}`)
  }

  subscribeTablesSuccess() {
    this.logMessage(`subscribe tables success`)
  }

  appendRowSuccess(rowId: RowId) {
    this.logMessage(`append row success: ${rowId}`)
  }

  insertRowSuccess(rowId: string) {
    this.logMessage(`insert row success: ${rowId}`)
  }

  removeRowSuccess(rowId: RowId) {
    this.logMessage(`remove row success: ${rowId}`)
  }

  updateCellSuccess(tableId: TableId, rowId: RowId, columnName: ColumnName) {
    this.logMessage(`update cell success: ${tableId} ${rowId} ${columnName}`)
  }

  tableSnap(table: Table) {
    const t = document.getElementById("tableSnap") as HTMLInputElement
    t.value += `${JSON.stringify(table)}\n`

    createTableUtil(table.tableId, table.tableName, table.columns)
    table.rows.forEach(row => {
      appendRowUtil(table.tableId, row.rowId, row.values)
    })
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')

    appendRowUtil(tableId, rowId, values)
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    insertRowUtil(tableId, rowId, afterRowId, values)
  } 


  removeRow(rowId: RowId) {
    this.logMessage(`remove row - rowId [${rowId}]`, 'tableUpdate')

    removeRowUtil(rowId)
  }

  updateCell(tableId: TableId, rowId: RowId, columnIndex: number, value: ColumnValue) {
    this.logMessage(`update cell - rowId [${rowId}] column [${columnIndex}] value [${value}]`, 'tableUpdate')

    updateCellUtil(rowId, columnIndex, value)
  }

  removeTable(tableId: TableId) {
    this.logMessage(`remove table: ${tableId}`, 'tableUpdate')

    removeTableUtil(tableId)
  }

  createTable(tableId: string, tableName: string, columns: string[], creatorId: string) {
    this.logMessage(`create table: ${tableId} ${tableName} ${columns} ${creatorId}`, 'tableUpdate')
  }

  moveRowAndUpdateCell(tableId: string, rowId: string, afterRowId: string, columnIndex: number, value: Object) {

  }
  moveRowAndUpdateCellSuccess(tableId: string, rowId: string, afterRowId: string, columnName: string) {

  }

  moveRowAndUpdateCellFailure(tableId: string, rowId: string, afterRowId: string, columnName: string, errorCode: ErrorCode, reason: string) {
  }


  private logMessage(msg: string, elementId = 'logs') {
    const logs = document.getElementById(elementId) as HTMLTextAreaElement
    logs.value += msg + '\n' 
  }
}


let client: Client

export function getClient(host: string, port: number) {
  if (!client) {
    client = new Client(WebSocket)
    client.addCallback(new Callback())
    client.connect(host, port)
    return client
  }
  else {
    return client
  }
}

function getValue(elementId) {
  return (document.getElementById(elementId) as HTMLInputElement).value
}

function getUserId() {
  return getValue('userId')
}

function getPassword() {
  return getValue('password')
}

function getNewUserId() {
  return getValue('newUserId')
}

function getNewUserName() {
  return getValue('newUserName')
}

function getNewUserPassword() {
  return getValue('newUserPassword')
}

function getRemoveUserId() {
  return getValue('removeUserId')
}

function getNewTableName() {
  return getValue('tableNameCT')
}

function getNewTableId() {
  return getValue('tableIdCT')
}

function getNewTableColumns() {
  return JSON.parse(getValue('tableColumnsCT'))
}

function getAppendRowTableId() {
  return getValue('tableIdAR')
}

function getAppendRowRowId() {
  return getValue('rowIdAR')
}

function getAppendRowValues() {
  return JSON.parse(getValue('valuesAR'))
}

function getRemoveRowTableId() {
  return getValue('tableIdDR')
}

function getRemoveRowRowId() {
  return getValue('rowIdDR') 
}
function getUpdateCellTableId() {
  return getValue('tableIdUC')
}

function getUpdateCellRowId() {
  return getValue('rowIdUC') 
}

function getUpdateCellColumnName() {
  return getValue('columnUC')
}

function getUpdateCellValue() {
  return getValue('valueUC') 
}

client = getClient('localhost', 8080)

function bindListeners() {
    document.getElementById('loginBn').addEventListener('click', () => {
      client.login(getUserId(), getPassword())
    })

    document.getElementById('logoutBn').addEventListener('click', () => {
      client.logout()
    })

    document.getElementById('createUserBn').addEventListener('click', () => {
      client.createUser(getNewUserId(), getNewUserName(), getNewUserPassword())
    })

    document.getElementById('removeUserBn').addEventListener('click', () => {
        client.removeUser(getRemoveUserId())
    })

    document.getElementById('createTableBn').addEventListener('click', () => {
        client.createTable(getNewTableId(), getNewTableName(), getNewTableColumns())
    })

    document.getElementById('removeTableBn').addEventListener('click', () => {
        client.removeTable(getValue('tableIdRT'))
    })

    document.getElementById('appendRowBn').addEventListener('click', () => {
      client.appendRow(getAppendRowTableId(), getAppendRowRowId(), getAppendRowValues())
    })

    document.getElementById('removeRowBn').addEventListener('click', () => {
      client.removeRow(getRemoveRowTableId(), getRemoveRowRowId())
    })

    document.getElementById('updateCellBn').addEventListener('click', () => {
      client.updateCell(getUpdateCellTableId(), getUpdateCellRowId(), getUpdateCellColumnName(), getUpdateCellValue())
    })

    document.getElementById('subscribeTablesBn').addEventListener('click', () => {
      clearTablesUtil()
      client.subscribeTables()
    })
  }

// @ts-ignore
window.getClient = getClient

// @ts-ignore
window.bindListeners = bindListeners