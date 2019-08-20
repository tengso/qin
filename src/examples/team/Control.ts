import { ErrorCode, SessionId, TableId, RowId, ColumnName, Table, ColumnValue } from '../../TableFlowMessages'
import { ClientCallback, Client } from '../../TableFlowClient'
import { View } from './View'
import { Model } from './Model'
import { Title, Description, TaskId, TaskGroupId, ProjectId, TaskRow, ProjectRow, TaskGroupRow, taskGroupTableId, taskTableId, projectTableId } from './Core'

class Control implements ClientCallback {
  view = new View(document, this.afterSortingCallback)
  model = new Model()

  client

  // note: order matters
  expectedTables = [projectTableId, taskGroupTableId, taskTableId]
  receivedTables = new Map<TableId, Table>()

  onRemoveRowSuccess: () => void

  tableSnap(table: Table) {
    this.logMessage(`table - ${JSON.stringify(table)}`)

    if (this.expectedTables.includes(table.tableId)) {
      this.receivedTables.set(table.tableId, table)
    }

    if (this.expectedTables.length == this.receivedTables.size) {
      for (const tableId of this.expectedTables) {
        const table = this.receivedTables[tableId]
        table.rows.forEach((row, index) => {
          this.appendRow(tableId, row.rowId, row.values)
        })
      }
    }
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')
    
    if (tableId === taskTableId) {
      const row = this.createTaskRow(values)
      const [_, taskGroup, task] = this.model.appendTask(row)
      this.view.appendTask(taskGroup, task)
    }
    else if (tableId === taskGroupTableId) {
      const row = this.createTaskGroupRow(values) 
      const [project, taskGroup] = this.model.appendTaskGroup(row)
      this.view.appendTaskGroup(project, taskGroup)
    }
    else if (tableId === projectTableId) {
      const row = this.createProjectRow(values)
      const project = this.model.appendProject(row)
      this.view.appendProject(project)
    }
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    if (tableId === taskTableId) {
      // row id === task id
      const row = this.createTaskRow(values)
      const [_, taskGroup, task, index] = this.model.insertTask(afterRowId, row)
      this.view.insertTask(taskGroup, task, index)
    }
    else if (tableId === taskGroupTableId) {
      // row id === task group id
      const row = this.createTaskGroupRow(values)
      const [project, taskGroup, index] = this.model.insertTaskGroup(afterRowId, row) 
      this.view.insertTaskGroup(project, taskGroup, index)
    }
    else if (tableId === projectTableId) {
      // row id === project id
      const row = this.createProjectRow(values)
      throw new Error('insert project not supported yet')
    }
  } 

  removeRow(rowId: RowId, tableId: TableId, values: ColumnValue[]) {
    this.logMessage(`remove row - rowId [${rowId}]`, 'tableUpdate')

    if (tableId == taskTableId) {
      const row = this.createTaskRow(values)
      this.model.removeTask(row.projectId, row.taskGroupId, row.id)
      this.view.removeTask(row.id)
    }
    else if (tableId === taskGroupTableId) {
      const row = this.createTaskGroupRow(values)
      this.model.removeTaskGroup(row.projectId, row.id)
      this.view.removeTaskGroup(row.id)
    }
    else if (tableId === projectTableId) {
      const row = this.createProjectRow(values)
      throw new Error('remove project not supported yet')
    }
  }

  createTaskRow(values: ColumnValue[]): TaskRow {
    const row: TaskRow = {
      id: values[0] as TaskId,
      title: values[1] as Title,
      description: values[2] as Description,
      dueDate: values[3] as Date,
      projectId: values[4] as ProjectId,
      taskGroupId: values[5] as TaskGroupId,
    }

    return row
  }

  createTaskGroupRow(values: ColumnValue[]): TaskGroupRow {
    const row: TaskGroupRow = {
      id: values[0] as TaskGroupId,
      title: values[1] as Title,
      description: values[2] as Description,
      projectId: values[3] as ProjectId,
    }

    return row
  }

  createProjectRow(values: ColumnValue[]): ProjectRow {
    const row: ProjectRow = {
      id: values[0] as ProjectId,
      title: values[1] as Title,
      description: values[2] as Description,
      dueDate: values[3] as Date,
    }

    return row
  }

  moveRowAndUpdateCell(tableId: string, rowId: string, afterRowId: string, columnIndex: number, value: Object) {
    if (tableId === taskGroupTableId) {
      const taskGroupId = rowId
      const afterTaskGroupId = afterRowId

      const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
      if (projectId) {
        this.model.moveTaskGroup(projectId, taskGroupId, afterTaskGroupId)
        this.view.moveTaskGroup(projectId, taskGroupId, afterTaskGroupId)
      }
      else {
        throw new Error(`task group ${taskGroupId} not found`)
      }
    }
    else if (tableId === taskTableId) {
      const taskId = rowId
      const afterTaskId = afterRowId

      const projectId = this.model.getProjectIdByTaskId(taskId)
      if (projectId) {
        const taskGroupId = value ? value as string : undefined
        this.model.moveTask(projectId, taskId, taskGroupId, afterTaskId)
        this.view.moveTask(projectId, taskId, taskGroupId, afterTaskId)
      }
      else {
        throw new Error(`task ${rowId} not found`)
      }
    }
    else {
      throw new Error(`unknown table id ${tableId}`)
    }
  }

  afterSortingCallback(event) {
    // const itemId = event.item.id
    // const from = event.from.id
    // const fromIndex = event.oldIndex 
    // const to = event.to.id
    // const toIndex = event.newIndex

    // console.log(`moved item: ${itemId}`)
    // console.log(`from: ${from} ${fromIndex}`)
    // console.log(`to: ${to} ${toIndex}`)

    const elementClass = event.item.getAttribute('class')
    if (elementClass === 'TaskGroup') {
      const tableId = taskGroupTableId    
      const taskGroupId = event.item.id
      const toTaskGroupIndex = event.newIndex

      const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
      if (projectId) {
        if (toTaskGroupIndex === 0) {
          client.moveRowAndUpdateCell(tableId, taskGroupId, undefined, undefined, undefined) 
        }
        else {
          const afterTaskGroup = this.model.getTaskGroupByIndex(projectId, toTaskGroupIndex -1)
          if (afterTaskGroup) {
            client.moveRowAndUpdateCell(tableId, taskGroupId, afterTaskGroup.id, undefined, undefined) 
          }
          else {
            throw new Error(`task group index ${toTaskGroupIndex} not found`)
          }
        }
      }
      else {
        throw new Error(`task group id ${taskGroupId} not found`)
      }
    }
    else if (elementClass === 'Task') {
      const tableId = taskTableId    
      const taskId = event.item.id

      const fromTaskGroupId = event.from.parentElement.id
      const fromTaskIndex = event.oldIndex 
      const toTaskGroupId = event.to.parentElement.id
      const toTaskIndex = event.newIndex

      const columnName = fromTaskGroupId != toTaskGroupId ? 'taskGroupId' : undefined
      const columnValue = columnName ? toTaskGroupId : undefined

      const projectId = this.model.getProjectIdByTaskId(taskId)
      if (projectId) {
        if (toTaskIndex == 0) {
          client.moveRowAndUpdateCell(tableId, taskId, undefined, columnName, columnValue) 
        }
        else {
          const afterTask = this.model.getTaskByIndex(projectId, toTaskGroupId, toTaskIndex -1)
          if (afterTask) {
            client.moveRowAndUpdateCell(tableId, taskId, afterTask.id, columnName, columnValue) 
          }
          else {
            throw new Error(`task index ${toTaskIndex} not found`)
          }
        }
      }
    }
  }

  connectSuccess(client: Client): void {
    this.logMessage('connect success')
  }

  connectFailure(): void {
    this.logMessage('connect failure')
  }

  logoutFailure(reason: string): void {
    this.logMessage(`logout failure ${reason}`)
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

  moveRowAndUpdateCellFailure(tableId: string, rowId: string, afterRowId: string, columnName: string, errorCode: ErrorCode, reason: string) {
    this.logMessage(`move row and update cell failure ${tableId} ${rowId} ${reason} ${errorCode}`)
  }

  loginSuccess(sessionId: SessionId) {
    this.logMessage(`login success ${sessionId}`)
    client.subscribeTables()
  }

  loginFailure(errorCode: ErrorCode, reason: string): void {
    this.logMessage(`login failure ${reason} ${errorCode}`)

    if (errorCode === ErrorCode.UserAlreadyLogin) {
      client.logout()
    }
  }

  logoutSuccess() {
    this.logMessage(`logout success`)
    client.login(client.userId, client.password)
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

  moveRowAndUpdateCellSuccess(tableId: string, rowId: string, afterRowId: string, columnName: string) {
    this.logMessage(`move row and update cell success: ${tableId} ${rowId} ${columnName}`)
  }

  updateCell(tableId: TableId, rowId: RowId, columnIndex: number, value: ColumnValue) {
    this.logMessage(`update cell - rowId [${rowId}] column [${columnIndex}] value [${value}]`, 'tableUpdate')
  }

  removeTable(tableId: TableId) {
    this.logMessage(`remove table: ${tableId}`, 'tableUpdate')
  }

  createTable(tableId: string, tableName: string, columns: string[], creatorId: string) {
    this.logMessage(`create table: ${tableId} ${tableName} ${columns} ${creatorId}`, 'tableUpdate')
  }

  private logMessage(msg: string, elementId = 'logs') {
    // const logs = document.getElementById(elementId) as HTMLTextAreaElement
    // logs.value += msg + '\n' 
    console.log(msg)
  }
}

function getClient(host: string, port: number) {
  if (!client) {
    client = new Client(WebSocket)
    const control = new Control()
    client.addCallback(control)
    client.connect(host, port)
    return client
  }
  else {
    return client
  }
}

let client = getClient('localhost', 8080)



// export function appendTask(group: TaskGroup, tableId: TableId = defaultTableId, id: TaskId = uuid(), name: TaskName = id.substring(0, 8)) {
//   // FIXME: hard-coded group as status here
//   client.appendRow(tableId, id, [id, name, group])
// }

// // @ts-ignore
// // window.eventHandler = onSortingEnd
// // @ts-ignore
// // window.appendTask = appendTask
// @ts-ignore
window.client = client