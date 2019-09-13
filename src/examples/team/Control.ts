import { ErrorCode, SessionId, TableId, RowId, ColumnName, Table, ColumnValue, UserId, logoutFailure, createUserFailure, removeUserSuccess, removeUserFailure, createTableFailure, removeTableSuccess, removeTableFailure, appendRowFailure, insertRowFailure, removeRowFailure, updateCellFailure, moveRowAndUpdateCellFailure, loginSuccess, loginFailure } from '../../TableFlowMessages'
import { ClientCallback, Client } from '../../TableFlowClient'
import { View } from './View'
import { Model, TaskGroup } from './Model'
import { Title, Description, TaskId, TaskGroupId, ProjectId, TaskRow, ProjectRow, TaskGroupRow, TaskGroupTableId, TaskTableId, ProjectTableId, TaskGroupTableColumns, TaskGroupTableColumnName, TaskTableColumns, TaskTableColumnName, ProjectMemberTableId, ProjectMemberTableColumnName, ProjectMemberTableColumns, MemberTableId, MemberRow, MemberTableColumnName, MemberTableColumns, AssetTableId, AssetRow, AssetId, AssetName, AssetType, ProjectMemberRow, TaskOwnerTableId, TaskOwnerRow, TaskOwnerTableColumns, TaskOwnerTableColumnName, CheckListTableId, CheckListRow, ItemId, ItemStatus, CheckListTableColumns, CheckListTableColumnName, ProjectChatTableId, ProjectChatRow, MessageId, PosterId, Message, TaskChatTableId, TaskChatRow } from './Core'
import uuid = require('uuid');
import { string } from 'yargs';

export class Control implements ClientCallback {
  private view: View 
  private model: Model
  private client: Client

  // note: order matters
  private expectedTables = [AssetTableId, MemberTableId, ProjectTableId, TaskGroupTableId, TaskTableId, ProjectMemberTableId, TaskOwnerTableId, CheckListTableId, ProjectChatTableId, TaskChatTableId]
  private receivedTables = new Map<TableId, Table>()

  constructor(client: Client, document) {
    this.client = client
    const model = new Model()
    this.model = model
    this.view = new View(document)
    const callback = this.createSortingCallBack(model, client, this.view)
    this.view.setSortingCallback(callback)
    this.view.setAddTaskCallback(addTaskCallback)
    this.view.setAddTaskGroupCallback(addTaskGroupCallback)
    this.view.setRemoveTaskCallback(removeTaskCallback)
    this.view.setRemoveTaskGroupCallback(removeTaskGroupCallback)
    this.view.setUpdateTaskGroupTitleCallback(updateTaskGroupTitleCallback)

    this.view.setUpdateTaskTitleCallback(updateTaskTitleCallback)
    this.view.setUpdateTaskDescriptionCallback(updateTaskDescriptionCallback)
    this.view.setUpdateTaskDueDateCallback(updateTaskDueDateCallback)

    this.view.setAddTaskOwnerCallback(addTaskOwnerCallback)
    this.view.setRemoveTaskOwnerCallback(removeTaskOwnerCallback)
    this.view.setAddCheckListItemCallback(addCheckListItemCallback)
    this.view.setRemoveCheckListItemCallback(removeCheckListItemCallback)
    this.view.setUpdateCheckListItemStatusCallback(updateCheckListItemStatusCallback)
    this.view.setUpdateCheckListItemDescriptionCallback(updateCheckListItemDescriptionCallback)
    this.view.setSendProjectChatCallback(sendProjectChatCallback)
    this.view.setSendTaskChatCallback(sendTaskChatCallback)
  }

  tableSnap(table: Table) {
    this.logMessage(`table - ${JSON.stringify(table)}`)

    if (this.expectedTables.includes(table.tableId)) {
      this.receivedTables.set(table.tableId, table)
    }

    if (this.expectedTables.length == this.receivedTables.size) {
      for (const tableId of this.expectedTables) {
        const table = this.receivedTables.get(tableId)
        table.rows.forEach((row, index) => {
          this.appendRow(tableId, row.rowId, row.values)
        })
      }
    }
  }

  appendRow(tableId: TableId, rowId: RowId, values: ColumnValue[]) {
    this.logMessage(`append row - tableId [${tableId}] rowId [${rowId}] value [${values}]`, 'tableUpdate')
    
    try {
      if (tableId === TaskTableId) {
        const row = this.createTaskRow(values)
        const [_, taskGroup, task] = this.model.appendTask(row)
        this.view.appendTask(taskGroup, task)
      }
      else if (tableId === TaskGroupTableId) {
        const row = this.createTaskGroupRow(values) 
        const [project, taskGroup] = this.model.appendTaskGroup(row)
        this.view.appendTaskGroup(project, taskGroup)
      }
      else if (tableId === ProjectTableId) {
        const row = this.createProjectRow(values)
        const project = this.model.appendProject(row)
        this.view.appendProject(project)
      }
      else if (tableId === MemberTableId) {
        const row = this.createMemberRow(values)
        this.model.appendMember(row)

        const member = this.model.getMember(this.client.userId)
        console.log(`user: ${this.client.userId}`)

        if (member) {
          console.log(`member: ${member.id}`)
          const asset = this.model.getAsset(member.avatar)
          if (asset) {
            this.view.setUserImage(asset.content)
          }
        }
      }
      else if (tableId === AssetTableId) {
        const row = this.createAssetRow(values)
        this.model.appendAsset(row)
      }
      else if (tableId === ProjectMemberTableId) {
        const row = this.createProjectMemberRow(values)
        const member = this.model.getMember(row.memberId)
        if (member) {
          console.log(member.avatar)
          const asset = member.avatar ? this.model.getAsset(member.avatar) : undefined
          console.log(asset)
          const image = asset ? asset.content : undefined

          this.model.appendProjectMember(row.projectId, member)
          this.view.appendProjectMember(row.projectId, member, image)
        }
        else {
          throw new Error(`member ${row.memberId} not found`)
        }
      }
      else if (tableId === TaskOwnerTableId) {
        const row = this.createTaskOwnerRow(values)
        const member = this.model.getMember(row.ownerId)
        if (member) {
          const asset = member.avatar ? this.model.getAsset(member.avatar) : undefined
          const image = asset ? asset.content : undefined

          this.model.appendTaskOwner(row.taskId, member)
          this.view.appendTaskOwner(row.taskId, member, image)
        }
        else {
          throw new Error(`member ${row.ownerId} not found`)
        }
      }
      else if (tableId === CheckListTableId) {
        const row = this.createCheckListRow(values)
        const item = this.model.appendCheckListItem(row)
        this.view.appendCheckListItem(row.projectId, row.taskId, item)
      }
      else if (tableId === ProjectChatTableId) {
        const row = this.createProjectChatRow(values)
        const message = this.model.appendProjectChatMessage(row)
        this.view.appendProjectChatMessage(client.userId, row.projectId, message, this.model)
      }
      else if (tableId === TaskChatTableId) {
        const row = this.createTaskChatRow(values)
        const message = this.model.appendTaskChatMessage(row)
        this.view.appendTaskChatMessage(client.userId, row.projectId, row.taskId, message, this.model)
      }
    }
    catch (exception) {
      console.error(exception)
    }
  }

  insertRow(tableId: string, rowId: string, afterRowId: string, values: Object[]) {
    this.logMessage(`insert row - tableId [${tableId}] rowId [${rowId}] aRowId [${afterRowId}] value [${values}]`, 'tableUpdate')

    if (tableId === TaskTableId) {
      // row id === task id
      const row = this.createTaskRow(values)
      const [_, taskGroup, task, index] = this.model.insertTask(afterRowId, row)
      this.view.insertTask(taskGroup, task, index)
    }
    else if (tableId === TaskGroupTableId) {
      // row id === task group id
      const row = this.createTaskGroupRow(values)
      const [project, taskGroup, index] = this.model.insertTaskGroup(afterRowId, row) 
      this.view.insertTaskGroup(project, taskGroup, index)
    }
    else if (tableId === ProjectTableId) {
      // row id === project id
      const row = this.createProjectRow(values)
      throw new Error('insert project not supported yet')
    }
  } 

  removeRow(rowId: RowId, tableId: TableId, values: ColumnValue[]) {
    this.logMessage(`remove row - rowId [${rowId}]`, 'tableUpdate')

    if (tableId == TaskTableId) {
      const row = this.createTaskRow(values)
      this.model.removeTask(row.projectId, row.taskGroupId, row.id)
      this.view.removeTask(row.id)
    }
    else if (tableId === TaskGroupTableId) {
      const row = this.createTaskGroupRow(values)
      this.model.removeTaskGroup(row.projectId, row.id)
      this.view.removeTaskGroup(row.id)
    }
    else if (tableId === ProjectMemberTableId) {
      const row = this.createProjectMemberRow(values)
      this.model.removeProjectMember(row.projectId, row.memberId)
      this.view.removeProjectMember(row.projectId, row.memberId)
    }
    else if (tableId === TaskOwnerTableId) {
      const row = this.createTaskOwnerRow(values)
      this.model.removeTaskOwner(row.taskId, row.ownerId)
      this.view.removeTaskOwner(row.taskId, row.ownerId)
    }
    else if (tableId === ProjectTableId) {
      const row = this.createProjectRow(values)
      throw new Error('remove project not supported yet')
    }
    else if (tableId === CheckListTableId) {
      const row = this.createCheckListRow(values)
      const item = this.model.removeCheckListItem(row)
      this.view.removeCheckListItem(row.projectId, row.taskId, row.id, item.status)
    }
  }

  updateCell(tableId: TableId, rowId: RowId, columnIndex: number, value: ColumnValue) {
    this.logMessage(`update cell - rowId [${rowId}] column [${columnIndex}] value [${value}]`, 'tableUpdate')

    if (tableId === TaskGroupTableId) {
      const taskGroupId = rowId
      const column = TaskGroupTableColumns[columnIndex]
      const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
      if (projectId) {
        if (column === TaskGroupTableColumnName.Title) {
          const title = value as string
          this.model.updateTaskGroupTitle(projectId, taskGroupId, title)
          this.view.updateTaskGroupTitle(projectId, taskGroupId, title)
        }
        else {
          throw new Error(`unknown column ${value}`)
        }
      }
      else {
        throw new Error(`project for task group ${taskGroupId} not found`)
      }
    }
    else if (tableId === TaskTableId) {
      const taskId = rowId
      const column = TaskTableColumns[columnIndex]
      const projectId = this.model.getProjectIdByTaskId(taskId)
      if (projectId) {
        const project = this.model.getProject(projectId)
        if (column === TaskTableColumnName.Title) {
          const title = value as string
          this.model.updateTaskTitle(projectId, taskId, title)
          this.view.updateTaskTitle(projectId, taskId, title)
        }
        else if (column === TaskTableColumnName.DueDate) {
          const dueDate = new Date(value as string)
          this.model.updateTaskDueDate(projectId, taskId, dueDate)
          this.view.updateTaskDueDate(projectId, taskId, dueDate)
        }
        else if (column === TaskTableColumnName.Description) {
          const description = value as string
          this.model.updateTaskDescription(projectId, taskId, description)
          this.view.updateTaskDescription(projectId, taskId, description)
        }
        else {
          throw new Error(`unknown column ${value}`)
        }
      }
      else {
        throw new Error(`project for task ${taskId} not found`)
      }
    }
    else if (tableId === CheckListTableId) {
      const itemId = rowId
      const column = CheckListTableColumns[columnIndex]
      if (column === CheckListTableColumnName.Status) {
        const task = this.model.updateCheckListItemStatus(itemId, value as ItemStatus)
        this.view.updateCheckListItemStatus(task.id, itemId, value as ItemStatus)
      }
      else if (column === CheckListTableColumnName.Description) {
        this.model.updateCheckListItemDescription(itemId, value as Description)
        this.view.updateCheckListItemDescription(itemId, value as Description)
      }
      else {
        throw new Error(`unknown column ${value}`)
      }
    }
  }

  moveRowAndUpdateCell(tableId: string, rowId: string, afterRowId: string, columnIndex: number, value: Object) {
    this.logMessage(`move & update cell - tableId [${tableId}] rowId [${rowId}] afterRowId [${afterRowId}] column [${columnIndex}] value [${value}]`, 'tableUpdate')
  
    if (tableId === TaskGroupTableId) {
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
    else if (tableId === TaskTableId) {
      const taskId = rowId
      const afterTaskId = afterRowId

      const projectId = this.model.getProjectIdByTaskId(taskId)
      if (projectId) {
        const toTaskGroupId = value as string 
        this.model.moveTask(projectId, taskId, toTaskGroupId, afterTaskId)
        this.view.moveTask(projectId, taskId, toTaskGroupId, afterTaskId)
      }
      else {
        throw new Error(`task ${rowId} not found`)
      }
    }
    else {
      throw new Error(`unknown table id ${tableId}`)
    }
  }

  createSortingCallBack(model: Model, client, view: View) {

    const callback = (event) => {
      // const itemId = event.item.id
      // const from = event.from.id
      // const fromIndex = event.oldIndex 
      // const to = event.to.id
      // const toIndex = event.newIndex

      // console.log(`moved item: ${itemId}`)
      // console.log(`from: ${from} ${fromIndex}`)
      // console.log(`to: ${to} ${toIndex}`)

      const elementClass = event.item.getAttribute('class')
      console.log(elementClass)

      if (elementClass === 'TaskGroup') {
        const tableId = TaskGroupTableId    
        const taskGroupId = event.item.id
        const toTaskGroupIndex = event.newIndex

        const projectId = model.getProjectIdByTaskGroupId(taskGroupId)
        if (projectId) {
          if (toTaskGroupIndex === 0) {
            client.moveRowAndUpdateCell(tableId, taskGroupId, undefined, undefined, undefined) 
          }
          else {
            const afterTaskGroupId = event.item.parentElement.children[toTaskGroupIndex - 1].getAttribute('id')
            if (afterTaskGroupId) {
              client.moveRowAndUpdateCell(tableId, taskGroupId, afterTaskGroupId, undefined, undefined) 
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
        const tableId = TaskTableId    
        const taskId = event.item.id

        const fromTaskGroupId = event.from.parentElement.id
        const fromTaskIndex = event.oldIndex 
        const toTaskGroupId = event.to.parentElement.id
        const toTaskIndex = event.newIndex

        const columnName = fromTaskGroupId != toTaskGroupId ? 'taskGroupId' : undefined
        const columnValue = columnName ? toTaskGroupId : undefined

        const projectId = model.getProjectIdByTaskId(taskId)
        if (projectId) {
          if (toTaskIndex == 0) {
            client.moveRowAndUpdateCell(tableId, taskId, undefined, columnName, columnValue) 
          }
          else {
            const afterTaskId = event.item.parentElement.children[toTaskIndex - 1].getAttribute('id')
            if (afterTaskId) {
              client.moveRowAndUpdateCell(tableId, taskId, afterTaskId, columnName, columnValue) 
            }
            else {
              throw new Error(`task index ${toTaskIndex} not found`)
            }
          }
        }
      }
    }

    return callback
  }

  private createTaskRow(values: ColumnValue[]): TaskRow {
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

  private createTaskGroupRow(values: ColumnValue[]): TaskGroupRow {
    const row: TaskGroupRow = {
      id: values[0] as TaskGroupId,
      title: values[1] as Title,
      description: values[2] as Description,
      projectId: values[3] as ProjectId,
    }

    return row
  }

  private createProjectRow(values: ColumnValue[]): ProjectRow {
    const row: ProjectRow = {
      id: values[0] as ProjectId,
      title: values[1] as Title,
      description: values[2] as Description,
      dueDate: values[3] as Date,
    }

    return row
  }

  private createMemberRow(values: ColumnValue[]): MemberRow {
    const row: MemberRow = {
      id: values[0] as UserId,
      name: values[1] as string,
      title: values[2] as string,
      description: values[3] as string,
      avatar: values[4] as string,
    }

    return row
  }

  private createAssetRow(values: ColumnValue[]): AssetRow {
    const row: AssetRow = {
      id: values[0] as AssetId,
      name: values[1] as AssetName,
      type: values[2] as AssetType,
      description: values[3] as Description,
      creatorId: values[4] as UserId,
      creationTime: values[5] as Date,
      updatorId: values[6] as UserId,
      updateTime: values[7] as Date,
      content: values[8],
    }

    return row
  }

  private createProjectMemberRow(values: ColumnValue[]): ProjectMemberRow {
    const memberIdIndex = ProjectMemberTableColumns.indexOf(ProjectMemberTableColumnName.MemberId)
    const memberId = values[memberIdIndex] as UserId

    const projectIdIndex = ProjectMemberTableColumns.indexOf(ProjectMemberTableColumnName.ProjectId)
    const projectId = values[projectIdIndex] as ProjectId

    const row: ProjectMemberRow = {
      memberId: memberId,
      projectId: projectId,
    }

    return row
  }

  private createTaskOwnerRow(values: ColumnValue[]): TaskOwnerRow {
    const ownerIdIndex = TaskOwnerTableColumns.indexOf(TaskOwnerTableColumnName.OwnerId)
    const ownerId = values[ownerIdIndex] as UserId

    const taskIdIndex = TaskOwnerTableColumns.indexOf(TaskOwnerTableColumnName.TaskId)
    const taskId = values[taskIdIndex] as TaskId

    const row: TaskOwnerRow = {
      ownerId: ownerId,
      taskId: taskId,
    }

    return row
  }

  private createCheckListRow(values: ColumnValue[]): CheckListRow {

    const row: CheckListRow = {
      id: values[0] as ItemId,
      projectId: values[1] as ProjectId,
      taskId: values[2] as TaskId,
      description: values[3] as Description,
      status: values[4] as ItemStatus,
    }

    return row
  }

  private createProjectChatRow(values: ColumnValue[]): ProjectChatRow {

    const row: ProjectChatRow = {
      id: values[0] as MessageId ,
      projectId: values[1] as ProjectId,
      replyToId: values[2] as MessageId,
      posterId: values[3] as PosterId,
      message: values[4] as Message,
      postTime: values[5] as Date,
    }

    return row
  }

  private createTaskChatRow(values: ColumnValue[]): TaskChatRow {

    const row: TaskChatRow = {
      id: values[0] as MessageId ,
      projectId: values[1] as ProjectId,
      replyToId: values[2] as MessageId,
      posterId: values[3] as PosterId,
      message: values[4] as Message,
      postTime: values[5] as Date,
      taskId: values[6] as TaskId,
    }

    return row
  }

  connectSuccess(client: Client): void {
    this.logMessage('connect success')
    // client.login('wukong', 'wk')
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
    this.client.subscribeTables()
  }

  loginFailure(errorCode: ErrorCode, reason: string): void {
    this.logMessage(`login failure ${reason} ${errorCode}`)

    if (errorCode === ErrorCode.UserAlreadyLogin) {
      this.client.logout()
    }
  }

  logoutSuccess() {
    this.logMessage(`logout success`)
    this.client.login(this.client.userId, this.client.password)
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

let control: Control

function getClient(host: string, port: number): Client {
  if (!client) {
    client = new Client(WebSocket)
    control = new Control(client, document)
    client.addCallback(control)
    client.connect(host, port)
    return client
  }
  else {
    return client
  }
}

let client: Client = getClient('localhost', 8080)

function addTaskCallback(taskGroupId: TaskGroupId, title: Title = 'Task title', description: Description = 'Task description', dueDate: Date = new Date()) {
  // @ts-ignore
  const projectId = control.model.getProjectIdByTaskGroupId(taskGroupId)
  if (projectId) {
    const taskId = uuid()

    const row: ColumnValue[] = [
      taskId,
      title,
      description,
      dueDate,
      projectId,
      taskGroupId,
    ]

    client.insertRow(TaskTableId, taskId, undefined, row)
  }
  else {
    throw new Error(`project not found for task group ${taskGroupId}`)
  }
}

function addTaskGroupCallback(projectId: ProjectId, title: Title = 'new task group', description: Description = 'desc') {
  const taskGroupId = uuid()
  const row: ColumnValue[] = [
    taskGroupId,
    title,
    description,
    projectId,
  ]

  client.appendRow(TaskGroupTableId, taskGroupId, row)
}

function removeTaskGroupCallback(taskGroupId: TaskGroupId) {
  client.removeRow(TaskGroupTableId, taskGroupId)
}

function removeTaskCallback(taskId: TaskId) {
  client.removeRow(TaskTableId, taskId)
}

function updateTaskGroupTitleCallback(taskGroupId: TaskGroupId, title: Title) {
  client.updateCell(TaskGroupTableId, taskGroupId, 'title', title)
}

function updateTaskTitleCallback(taskId: TaskId, title: Title) {
  client.updateCell(TaskTableId, taskId, 'title', title)
}

function updateTaskDescriptionCallback(taskId: TaskId, description: Description) {
  client.updateCell(TaskTableId, taskId, 'description', description)
}

function updateTaskDueDateCallback(taskId: TaskId, dueDate: Date) {
  client.updateCell(TaskTableId, taskId, 'dueDate', dueDate)
}

function getTaskOwnerRowId(taskId: TaskId, ownerId: UserId) {
  return `${TaskOwnerTableId}-${taskId}-${ownerId}`
}

function addTaskOwnerCallback(taskId: TaskId, ownerId: UserId) {
  const row = [
    ownerId,
    taskId
  ]
  client.appendRow(TaskOwnerTableId, getTaskOwnerRowId(taskId, ownerId), row)
}

function removeTaskOwnerCallback(taskId: TaskId, ownerId: UserId) {
  client.removeRow(TaskOwnerTableId, getTaskOwnerRowId(taskId, ownerId))
}

function addCheckListItemCallback(taskId: TaskId, description: Description, status: ItemStatus) {
  const rowId = uuid()
  // FIXME: how to get project id?
  // @ts-ignore
  const projectId = control.model.getProjectIdByTaskId(taskId)
  const row = [
    rowId,
    projectId, 
    taskId, 
    description,
    status,
  ]
  client.appendRow(CheckListTableId, rowId, row)
}

function removeCheckListItemCallback(itemId: ItemId) {
  client.removeRow(CheckListTableId, itemId)
}

function updateCheckListItemStatusCallback(itemId: ItemId, status: ItemStatus) {
  client.updateCell(CheckListTableId, itemId, CheckListTableColumnName.Status, status)
}

function updateCheckListItemDescriptionCallback(itemId: ItemId, description: Description) {
  client.updateCell(CheckListTableId, itemId, CheckListTableColumnName.Description, description)
}

function sendProjectChatCallback(projectId: ProjectId, message: Message, replyToId: MessageId) {
  const id = uuid()
  const row = [
    id, 
    projectId, 
    replyToId, 
    client.userId, 
    message, 
    new Date(),
  ]
  client.appendRow(ProjectChatTableId, id, row)
}

function sendTaskChatCallback(taskId: TaskId, message: Message, replyToId: MessageId) {
  // @ts-ignore
  const projectId = control.model.getProjectIdByTaskId(taskId)

  const id = uuid()

  const row = [
    id, 
    projectId, 
    replyToId, 
    client.userId, 
    message, 
    new Date(),
    taskId
  ]
  client.appendRow(TaskChatTableId, id, row)
}


// @ts-ignore
window.client = client