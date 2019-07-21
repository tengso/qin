import { Row, ErrorCode, SessionId, TableId, RowId, ColumnName, Table, ColumnValue } from '../TableFlowMessages'
import { ClientCallback, Client } from '../TableFlowClient'

import { v4 } from 'uuid'

const tableId = 'tasks_table_id'
let client = getClient('localhost', 8080)

type TaskGroup = string
type TaskId = string
type TaskName = string

enum TaskStatus {
  ToDo = 'To-Do',
  InProgress = 'In-Progress',
  Done = 'Done',
}

type GroupIndex = number

interface Task {
  id: TaskId,
  name: TaskName,
  status: TaskStatus
}

/*
        Important Assumptions

  task element['id']  = task.id = task row id
  task element['name']  = task.name
  task element['status']  = task.status

  task group == group element id 
*/

function removeTask(taskId: TaskId) {
  const taskElement = document.getElementById(taskId)
  if (taskElement) {
    taskElement.parentNode.removeChild(taskElement)
  }
  else {
    console.log(`task ${taskId} not found`)
  }
}

function insertTask(task: Task, group: TaskGroup, index: GroupIndex | undefined) {
  if (document.getElementById(task.id)) {
    console.log(`${task} exists`)
  }
  else {
    let groupElement = document.getElementById(group)
    if (!groupElement) {
      groupElement = document.createElement('div')
      groupElement.setAttribute('id', group)
    }
    const taskElement = document.createElement('div')
    taskElement.setAttribute('id', task.id)
    taskElement.innerHTML = task.name
    if (index) {
      if (index < groupElement.children.length) {
        const refElement = groupElement.children[index]
        groupElement.insertBefore(taskElement, refElement)
      }
      else {
        console.log(`invalid index: ${index}`)
      }
    }
    else {
      groupElement.appendChild(taskElement)
    }
  }
}

function getGroup(task: Task): TaskGroup {
  return task.status
}

function toTask(values: ColumnValue[]): Task {
  const task: Task = {
    id: values[0] as TaskId,
    name: values[1] as TaskName,
    status: values[2] as TaskStatus,
  }

  return task
}

export function appendTask(tableId: TableId, id: TaskId, name: TaskName, status: TaskStatus) {
  client.appendRow(tableId, id, [id, name, status])
}

export function handleSortingEvent(event) {
  const taskId = event.item.id
  const taskName = event.item.name
  const taskStatus = event.item.status

  const fromGroup = event.from.id
  const fromGroupIndex = event.oldIndex 

  const toGroupId = event.to.id
  const toGroupIndex = event.newIndex

  client.removeRow(tableId, taskId)

  // FIXME: need to wait

  client.onRemoveRowSuccess = () => {
    const groupElement = document.getElementById(toGroupId)
    const afterElement = groupElement.children[toGroupIndex - 1]
    this.insertRow(tableId, taskId, afterElement.id, [taskId, taskName, taskStatus]) 
  }
}

function getIndex(group: TaskGroup, rowId: RowId): number | undefined {
  const groupElement = document.getElementById(group)
  for (let i = 0; i < groupElement.children.length; i++) {
    if (groupElement.children[i].id === rowId) {
      return i
    }
  }

  return undefined
}

function clearBoard() {
  var container = document.getElementById("container");
  while (container.firstChild) {
      container.removeChild(container.firstChild);
  }
}

class Callback implements ClientCallback {
  onRemoveRowSuccess: () => void 

  tableSnap(table: Table) {
    this.logMessage(`table - ${JSON.stringify(table)}`)

    clearBoard()

    table.rows.forEach((row, index) => {
      const task = toTask(row.values)
      const group = getGroup(task)
      insertTask(task, group, undefined)
    })
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')

    const task = toTask(values)
    const group = getGroup(task)
    insertTask(task, group, undefined)
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    const task = toTask(values)
    const group = getGroup(task)
    const index = getIndex(group, afterRowId)
    console.log(`insert after ${index}`)
    insertTask(task, group, index + 1)
  } 

  removeRow(rowId: RowId) {
    this.logMessage(`remove row - rowId [${rowId}]`, 'tableUpdate')

    removeTask(rowId)
  }

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

    this.onRemoveRowSuccess()
  }

  updateCellSuccess(tableId: TableId, rowId: RowId, columnName: ColumnName) {
    this.logMessage(`update cell success: ${tableId} ${rowId} ${columnName}`)
  }

  updateCell(rowId: RowId, columnIndex: number, value: ColumnValue) {
    this.logMessage(`update cell - rowId [${rowId}] column [${columnIndex}] value [${value}]`, 'tableUpdate')
  }

  removeTable(tableId: TableId) {
    this.logMessage(`remove table: ${tableId}`, 'tableUpdate')
  }

  createTable(tableId: string, tableName: string, columns: string[], creatorId: string) {
    this.logMessage(`create table: ${tableId} ${tableName} ${columns} ${creatorId}`, 'tableUpdate')
  }


  private logMessage(msg: string, elementId = 'logs') {
    const logs = document.getElementById(elementId) as HTMLTextAreaElement
    logs.value += msg + '\n' 
  }
}

function getClient(host: string, port: number) {
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

// @ts-ignore
// window.tableFlowClient = client
