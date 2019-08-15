import { Row, ErrorCode, SessionId, TableId, RowId, ColumnName, Table, ColumnValue } from '../TableFlowMessages'
import { ClientCallback, Client } from '../TableFlowClient'

import { v4 } from 'uuid'
import uuid = require('uuid');
import Sortable from 'sortablejs'

const projectTableId = 'project_table_id'
const taskGroupTableId = 'task_group_table_id'
const taskTableId = 'task_table_id'

type ProjectId = string
type TaskGroupId = string
type TaskId = string

type Title = string
type Description = string

type GroupIndex = number

interface ProjectRow {
  id: ProjectId,
  title: Title,
  description: Description,
  dueDate: Date,
}

interface TaskGroupRow {
  id: TaskGroupId,
  title: Title,
  description: Description,
  projectId: ProjectId,
}

interface TaskRow {
  id: TaskId,
  title: Title,
  description: Description,
  dueDate: Date, 
  projectId: ProjectId
  taskGroupId: TaskGroupId,
}

class Project {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date

  private taskGroups: TaskGroup[]
  private taskGroupsMap = new Map<TaskGroupId, TaskGroup>()

  getOrCreateTaskGroup(taskGroupId: TaskGroupId): TaskGroup {
    const taskGroup = this.taskGroupsMap.get(taskGroupId)
    if (!taskGroup) {
      const taskGroup = new TaskGroup()
      taskGroup.id = taskGroupId
      this.appendTaskGroup(taskGroup)
      return taskGroup
    }
    else {
      return taskGroup
    }
  }

  appendTaskGroup(taskGroup: TaskGroup): void {
    this.taskGroups.push(taskGroup)
    this.taskGroupsMap.set(taskGroup.id, taskGroup)
  }
}

class TaskGroup {
  id: TaskGroupId
  project: Project
  title: Title
  description: Description
  tasks: Task[]
  
  private taskMap = new Map<TaskId, Task>()

  appendTask(task: Task) {
    this.taskMap.set(task.id, task)
    this.tasks.push(task)
  }

  getTask(taskId: TaskId): Task {
    return this.taskMap.get(taskId)
  }
}

class Task {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
  taskGroup: TaskGroup
}

class KanbanCallback implements ClientCallback {
  onRemoveRowSuccess: () => void 

  projects = new Array<Project>()
  projectMap = new Map<ProjectId, Project>()

  getOrCreateProject(projectId: ProjectId): Project {
    const project = this.projectMap.get(projectId)
    if (!project) {
      const project = new Project()
      project.id = projectId
      return project
    }
    else {
      return project
    }
  }

  addTask(values: ColumnValue[]): [Project, TaskGroup, Task] {
    const taskId = values[0] as TaskId
    const taskTitle = values[1] as Title
    const description = values[2] as Description
    const dueDate = values[3] as Date
    const projectId = values[4] as ProjectId
    const taskGroupId = values[5] as TaskGroupId

    const task = new Task() 
    task.id = taskId
    task.title = taskTitle
    task.description = description
    task.dueDate = dueDate
    const project = this.getOrCreateProject(projectId)
    const taskGroup = project.getOrCreateTaskGroup(taskGroupId)
    task.taskGroup = taskGroup
    taskGroup.appendTask(task)

    return [project, taskGroup, task]
  }

  addTaskGroup(values: ColumnValue[]): [Project, TaskGroup] {
    const taskGroupId = values[0] as TaskGroupId
    const title = values[1] as Title
    const description = values[2] as Description
    const projectId = values[3] as ProjectId
    const project = this.getOrCreateProject(projectId)
    const taskGroup = project.getOrCreateTaskGroup(taskGroupId)
    taskGroup.title = title
    taskGroup.description = description
    taskGroup.project = project
    project.appendTaskGroup(taskGroup)

    return [project, taskGroup]
  }

  addProject(values: ColumnValue[]): Project {
    const projectId = values[0] as ProjectId
    const title = values[1] as Title
    const description = values[2] as Description
    const dueDate = values[3] as Date 
    const project = this.getOrCreateProject(projectId)
    project.title = title
    project.description = description
    project.dueDate = dueDate

    return project
  }

  tableSnap(table: Table) {
    this.logMessage(`table - ${JSON.stringify(table)}`)

    if (table.tableId === taskTableId) {
      table.rows.forEach((row, index) => {
        this.addTask(row.values)
      })
    }
    else if (table.tableId == taskGroupTableId) {
      table.rows.forEach((row, index) => {
        this.addTaskGroup(row.values)
      })
    }
    else if (table.tableId == projectTableId) {
      table.rows.forEach((row, index) => {
        this.addProject(row.values)
      })
    }
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')
    
    if (tableId === taskTableId) {
      const [project, taskGroup, task] = this.addTask(values)
    }
    else if (tableId === taskGroupTableId) {
      const [project, taskGroup] = this.addTaskGroup(values)
    }
    else if (tableId === projectTableId) {
      const project = this.addProject(values)
    }

    const task = toTask(values)
    const group = getGroup(task)
    insertTask(task, group, undefined)
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    const task = toTask(values)
    const group = getGroup(task)
    const index = afterRowId ? getIndex(group, afterRowId) : -1
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
    // const logs = document.getElementById(elementId) as HTMLTextAreaElement
    // logs.value += msg + '\n' 
    console.log(msg)
  }
}


const callback = new KanbanCallback()

function removeTask(taskId: TaskId) {
  const taskElement = document.getElementById(taskId)
  if (taskElement) {
    taskElement.parentNode.removeChild(taskElement)
  }
  else {
    console.log(`task ${taskId} not found`)
  }
}

function createOrGetGroupElement(group: TaskGroup) {
  const board = document.getElementById('board')

  let groupElement = document.getElementById(`${group}-container`)
  if (groupElement) {
    return document.getElementById(`${group}`)
  }

  groupElement = document.createElement('div')
  groupElement.setAttribute('id', `${group}-container`)
  groupElement.setAttribute('class', `${group}-container`)
  board.appendChild(groupElement)

  const groupName = document.createElement('h3')
  groupName.setAttribute('class', 'container-title')
  groupName.innerHTML = group
  const addTaskButton = document.createElement('button')
  addTaskButton.addEventListener('click', () => {
    appendTask(group)
  })
  addTaskButton.innerHTML = '+'
  groupName.appendChild(addTaskButton)

  groupElement.appendChild(groupName)

  const groupList = document.createElement('div')
  groupList.setAttribute('id', `${group}`)
  groupElement.appendChild(groupList)

  const param = {
    group: 'share'
  }

  new Sortable(groupList, {
    group: 'shared',
    animation: 150,
    onEnd: onSortingEnd
  })

  return groupList
}

function insertTask(task: Task, group: TaskGroup, index: GroupIndex | undefined) {
  if (document.getElementById(task.id)) {
    console.log(`${task} exists`)
  }
  else {
    const groupElement = createOrGetGroupElement(group)

    const taskElement = document.createElement('div')
    taskElement.setAttribute('id', task.id)
    taskElement.setAttribute('name', task.name)
    taskElement.setAttribute('status', task.status)
    taskElement.setAttribute('class', `${group}-task`)
    // taskElement.innerHTML = task.name

    const removeTask = document.createElement('button')
    removeTask.setAttribute('class', 'remove-task')
    removeTask.addEventListener('click', () => {
      client.removeRow(defaultTableId, task.id)  
    })

    removeTask.innerHTML = '-'
    taskElement.appendChild(removeTask)

    if (index !== undefined) {
      if (index < groupElement.children.length) {
        const refElement = groupElement.children[index]
        groupElement.insertBefore(taskElement, refElement)
      }
      else if (index === groupElement.children.length) {
        groupElement.appendChild(taskElement)
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

export function appendTask(group: TaskGroup, tableId: TableId = defaultTableId, id: TaskId = uuid(), name: TaskName = id.substring(0, 8)) {
  // FIXME: hard-coded group as status here
  client.appendRow(tableId, id, [id, name, group])
}

function onSortingEnd(event) {
  const taskId = event.item.id
  const taskName = event.item.getAttribute('name')
  const taskStatus = event.item.getAttribute('status')

  console.log(`moved task: ${taskId} ${taskName} ${taskStatus}`)

  const fromGroup = event.from.id
  const fromGroupIndex = event.oldIndex 

  console.log(`from: ${fromGroup} ${fromGroupIndex}`)

  const toGroup = event.to.id
  const toGroupIndex = event.newIndex

  console.log(`to: ${toGroup} ${toGroupIndex}`)

  // client.onRemoveRowSuccess = () => {
  //   const groupElement = document.getElementById(toGroupId)
  //   const afterElement = groupElement.children[toGroupIndex - 1]
  //   this.insertRow(defaultTableId, taskId, afterElement.id, [taskId, taskName, taskStatus]) 
  // }
  client.removeRow(defaultTableId, taskId)

  const onRemoveRowSuccess = () => {
    const groupElement = document.getElementById(toGroup)

    let afterElementId
    if (toGroupIndex != 0) {
      const afterElement = groupElement.children[toGroupIndex - 1]
      afterElementId = afterElement.id
    }
    else {
      afterElementId = undefined
    }

    // FIXME: hard-coded group by status here
    const newTaskStatus = toGroup
    client.insertRow(defaultTableId, taskId, afterElementId, [taskId, taskName, newTaskStatus]) 
  }

  callback.onRemoveRowSuccess = onRemoveRowSuccess
}

function getIndex(group: TaskGroup, rowId: RowId): number | undefined {
  const groupElement = document.getElementById(`${group}`)
  for (let i = 0; i < groupElement.children.length; i++) {
    if (groupElement.children[i].getAttribute('id') === rowId) {
      return i
    }
  }

  return undefined
}

let client = getClient('localhost', 8080)

function getClient(host: string, port: number) {
  if (!client) {
    client = new Client(WebSocket)
    client.addCallback(callback)
    client.connect(host, port)
    return client
  }
  else {
    return client
  }
}

// @ts-ignore
// window.eventHandler = onSortingEnd
// @ts-ignore
// window.appendTask = appendTask
window.client = client
