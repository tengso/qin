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

  // return the index of the new element
  insertTaskGroup(taskGroup: TaskGroup, afterTaskGroupId: TaskGroupId | undefined): number | undefined {
    if (afterTaskGroupId) {
      let index = -1
      for(let i = 0; i < taskGroup.project.taskGroups.length; i++) {
        if (taskGroup.project.taskGroups[i].id === afterTaskGroupId) {
          index = i 
          break
        }
      }

      if (index != -1) {
        index++
        this.taskGroups.splice(index, 0, taskGroup)
        return index
      }
      else {
        console.error(`${afterTaskGroupId} not found`)
        return undefined
      }
    }
    // insert at first
    else {
      this.taskGroups.splice(0, 0, taskGroup)
      return 0
    }
  }

  removeTaskGroup(taskGroupId: TaskGroupId) {
    for(let i = 0; i < this.taskGroups.length; i++) {
      if (this.taskGroups[i].id === taskGroupId) {
        this.taskGroups.splice(i, 1)
      }
    }
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

  // return the index of the new task
  insertTask(task: Task, afterTaskId: TaskId | undefined): number | undefined {
    if (afterTaskId) {
      let index = -1
      for(let i = 0; i < task.taskGroup.tasks.length; i++) {
        if (task.taskGroup.tasks[i].id === afterTaskId) {
          index = i 
          break
        }
      }

      if (index != -1) {
        index++
        this.tasks.splice(index, 0, task)
        return index
      }
      else {
        console.error(`${afterTaskId} not found`)
        return undefined
      }
    }
    // insert at first
    else {
      this.tasks.splice(0, 0, task)
      return 0
    }
  }

  removeTask(taskId: TaskId) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === taskId) {
        this.tasks.splice(i, 1)
      }
    }
  }
}

class Task {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
  taskGroup: TaskGroup
}


class KanbanView {
  /*
  <div id='app'>
    <div class="Project" id="ProjectId">
      <div class="ProjectHead">
        <div class="Title"></div>
        <div class="Description"></div>
        <div class="DueDate"></div>
      </div>
      <div class="TaskGroupList">
        <div class="TaskGroup" id="TaskGroupId">
          <div class="TaskGroupHead">
            <div class="Title"></div>
            <div class="Description"></div>
          </div>
          <div class="TaskList>
            <div class="Task" id="TaskId">
              ...
            </div>
            <div class="Task" id="TaskId">
              ...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  */

  createTaskElement(task: Task) {
    const taskElement = document.createElement('div')
    taskElement.setAttribute('class', 'Task')
    taskElement.setAttribute('id', task.id)
    return taskElement
  }

  createTaskGroupElement(project: Project, taskGroup: TaskGroup) {
    const taskGroupElement = document.createElement('div')
    taskGroupElement.setAttribute('id', taskGroup.id)
    taskGroupElement.setAttribute('class', 'TaskGroup')

    const taskGroupHeadElement = document.createElement('div')

    const titleElement = document.createElement('div')
    titleElement.setAttribute('class', 'Title')

    const descElement = document.createElement('div')
    descElement.setAttribute('class', 'Description')

    taskGroupHeadElement.appendChild(titleElement)
    taskGroupHeadElement.appendChild(descElement)

    const taskGroupListElement = document.createElement('div')
    taskGroupListElement.setAttribute('class', 'TaskList')

    new Sortable(taskGroupListElement, {
      group: project.id,
      animation: 150,
      onEnd: onSortingEnd
    })

    taskGroupElement.appendChild(taskGroupHeadElement)
    taskGroupElement.appendChild(taskGroupListElement)

    return taskGroupElement
  }

  createProjectElement(project: Project) {
    const projectElement = document.createElement('div')
    projectElement.setAttribute('class', 'Project')
    projectElement.setAttribute('id', project.id)

    const projectHeadElement = document.createElement('div')
    projectHeadElement.setAttribute('class', 'ProjectHead')

    const titleElement = document.createElement('div')
    titleElement.setAttribute('class', 'Title')

    const descElement = document.createElement('div')
    descElement.setAttribute('class', 'Description')

    projectHeadElement.appendChild(titleElement)
    projectHeadElement.appendChild(descElement)

    const taskGroupListElement = document.createElement('div')
    taskGroupListElement.setAttribute('class', 'TaskGroupList')

    new Sortable(taskGroupListElement, {
      group: `${project.id}-TaskGroup`,
      animation: 150,
      onEnd: onSortingEnd
    })

    projectElement.appendChild(projectHeadElement)
    projectElement.appendChild(taskGroupListElement)

    return projectElement
  }

  appendProject(project: Project) {
    const appElement = document.getElementById('app')
    const projectElement = this.createProjectElement(project)
    appElement.appendChild(projectElement)
  }

  appendTaskGroup(project: Project, taskGroup: TaskGroup) {
    const projectElement = document.getElementById(project.id)
    if (projectElement) {
      const taskGroupElement = this.createTaskGroupElement(project, taskGroup)
      projectElement.children[1].appendChild(taskGroupElement)
    }
    else {
      console.error(`${project.id} not found`)
    }
  }

  removeTaskGroup(taskGroup: TaskGroup) {
    const taskGroupElement = document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      taskGroupElement.parentNode.removeChild(taskGroupElement)
    }
    else {
      console.error(`${taskGroup.id} not found`)
    }
  }

  insertTaskGroup(project: Project, taskGroup: TaskGroup, index: number) {
    const projectElement = document.getElementById(project.id)
    if (projectElement) {
      if (index < projectElement.children.length - 1) {
        const taskGroupElement = this.createTaskGroupElement(project, taskGroup)
        const refElement = projectElement.children[1].children[index]
        projectElement.children[1].insertBefore(taskGroupElement, refElement)
      }
      else {
        this.appendTaskGroup(project, taskGroup)
      }
    }
    else {
      console.error(`${project.id} not found`)
    }
  }

  appendTask(taskGroup: TaskGroup, task: Task) {
    const taskElement = this.createTaskElement(task)
    const taskGroupElement = document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      taskGroupElement.children[1].appendChild(taskElement)
    }
    else {
      console.error(`${taskGroup.id} not found`)
    }
  }

  removeTask(task: Task) {
    const taskElement = document.getElementById(task.id)
    if (taskElement) {
      taskElement.parentNode.removeChild(taskElement)
    }
    else {
      console.error(`${task.id} not found`)
    }
  }

  insertTask(taskGroup: TaskGroup, task: Task, index: number) {
    const taskGroupElement = document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      if (index < taskGroupElement.children[1].children.length - 1) {
          const taskElement = this.createTaskElement(task)
          const refElement = taskGroupElement.children[1].children[index] 
          taskGroupElement.children[1].insertBefore(taskElement, refElement)
       }
      else {
        this.appendTask(taskGroup, task)
      }
    }
    else {
      console.error(`${taskGroup.id} not found`)
    }
  }
}

class KanbanModel {
  projectMap = new Map<ProjectId, Project>()
  taskMap = new Map<TaskId, Task>()
  taskGroupMap = new Map<TaskId, TaskGroup>()

  getTaskById(taskId: TaskId): Task | undefined {
    return this.taskMap.get(taskId)
  }

  getTaskGroupById(taskGroupId: TaskGroupId): TaskGroup | undefined {
    return this.taskGroupMap.get(taskGroupId)
  }

  getOrCreateProject(projectId: ProjectId): Project {
    const project = this.projectMap.get(projectId)
    if (!project) {
      const project = new Project()
      project.id = projectId
      this.projectMap.set(project.id, project)

      return project
    }
    else {
      return project
    }
  }

  createTask(values: ColumnValue[]): Task {
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
 
    this.taskMap.set(task.id, task)
    return task
  }

  createTaskGroup(values: ColumnValue[]): TaskGroup {
    const taskGroupId = values[0] as TaskGroupId
    const title = values[1] as Title
    const description = values[2] as Description
    const projectId = values[3] as ProjectId
    const project = this.getOrCreateProject(projectId)
    const taskGroup = project.getOrCreateTaskGroup(taskGroupId)
    taskGroup.title = title
    taskGroup.description = description
    taskGroup.project = project

    this.taskGroupMap.set(taskGroup.id, taskGroup)
    return taskGroup
  }

  appendTask(values: ColumnValue[]): Task {
    const task = this.createTask(values)
    task.taskGroup.appendTask(task)

    return task
  }

  appendTaskGroup(values: ColumnValue[]): TaskGroup {
    const taskGroup = this.createTaskGroup(values)
    taskGroup.project.appendTaskGroup(taskGroup)

    return taskGroup
  }

  createProject(values: ColumnValue[]): Project {
    const projectId = values[0] as ProjectId
    const title = values[1] as Title
    const description = values[2] as Description
    const dueDate = values[3] as Date 
    const project = this.getOrCreateProject(projectId)
    project.title = title
    project.description = description
    project.dueDate = dueDate

    this.projectMap.set(project.id, project)

    return project
  }

  appendProject(values: ColumnValue[]): Project {
    const project = this.createProject(values)

    // FIXME: add to app
    return project
  }
}

class KanbanCallback implements ClientCallback {
  onRemoveRowSuccess: () => void 

  view = new KanbanView()
  model = new KanbanModel()

  tableSnap(table: Table) {
    this.logMessage(`table - ${JSON.stringify(table)}`)

    if (table.tableId === taskTableId) {
      table.rows.forEach((row, index) => {
        this.model.appendTask(row.values)
      })
    }
    else if (table.tableId == taskGroupTableId) {
      table.rows.forEach((row, index) => {
        this.model.appendTaskGroup(row.values)
      })
    }
    else if (table.tableId == projectTableId) {
      table.rows.forEach((row, index) => {
        this.model.appendProject(row.values)
      })
    }
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')
    
    if (tableId === taskTableId) {
      const task = this.model.appendTask(values)
      this.view.appendTask(task.taskGroup, task)
    }
    else if (tableId === taskGroupTableId) {
      const taskGroup = this.model.appendTaskGroup(values)
      this.view.appendTaskGroup(taskGroup.project, taskGroup)
    }
    else if (tableId === projectTableId) {
      const project = this.model.appendProject(values)
      this.view.appendProject(project)
    }
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    if (tableId === taskTableId) {
      const task = this.model.createTask(values)
      // row id === task id
      const index = task.taskGroup.insertTask(task, afterRowId)
      this.view.insertTask(task.taskGroup, task, index)
    }
    else if (tableId === taskGroupTableId) {
      const taskGroup = this.model.createTaskGroup(values)
      // row id === task group id
      const index = taskGroup.project.insertTaskGroup(taskGroup, afterRowId) 
      this.view.insertTaskGroup(taskGroup.project, taskGroup, index)
    }
    else if (tableId === projectTableId) {
      console.error('insert project not supported yet')
    }
  } 

  removeRow(rowId: RowId, tableId: TableId) {
    this.logMessage(`remove row - rowId [${rowId}]`, 'tableUpdate')

    if (tableId === taskTableId) {
      const task = this.model.getTaskById(rowId)
      if (task) {
        task.taskGroup.removeTask(task.id)
        this.view.removeTask(task)
      }
    }
    else if (tableId === taskGroupTableId) {
      const taskGroup = this.model.getTaskGroupById(rowId)
      if (taskGroup) {
        taskGroup.project.removeTaskGroup(taskGroup.id)
        this.view.removeTaskGroup(taskGroup)
      }
    }
    else if (tableId === projectTableId) {
      console.error('remove project not supported yet')
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

export function appendTask(group: TaskGroup, tableId: TableId = defaultTableId, id: TaskId = uuid(), name: TaskName = id.substring(0, 8)) {
  // FIXME: hard-coded group as status here
  client.appendRow(tableId, id, [id, name, group])
}

function onSortingEnd(event) {
  const elementClass = event.item.getAttribute('class')
  if (elementClass ==== ) {
    
  }
  const taskId = event.item.id

  console.log(`moved task: ${taskId} ${taskName} ${taskStatus}`)

  const fromGroup = event.from.id
  const fromGroupIndex = event.oldIndex 

  console.log(`from: ${fromGroup} ${fromGroupIndex}`)

  const toGroup = event.to.id
  const toGroupIndex = event.newIndex

  console.log(`to: ${toGroup} ${toGroupIndex}`)

  client.removeRow(taskTableId, taskId)

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
    client.insertRow(taskTableId, taskId, afterElementId, [taskId, taskName, newTaskStatus]) 
  }

  callback.onRemoveRowSuccess = onRemoveRowSuccess
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
