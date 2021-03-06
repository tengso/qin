import { Client } from '../../TableFlowClient'
import { TaskGroupId, Title, Description, TaskTableId, ProjectId, TaskGroupTableId, TaskId, ProjectTableId, TaskOwnerTableId, AssetTableId, createTaskAttachmentId, TaskAttachmentTableId, AttachmentId, ItemStatus, CheckListTableId, ItemId, CheckListTableColumnName, Message, MessageId, ProjectChatTableId, TaskChatTableId, AssetId, AssetName, AssetType, MemberTableId, ProjectMemberTableId, ActivityTableId, ActivityType } from './Core'
import { Asset, Model } from './Model'
import { View } from './View'
import { Control, init } from './Control'
import uuid = require('uuid')
import { ColumnValue, UserId } from '../../TableFlowMessages'

export class Callbacks {
  private client: Client
  private control: Control
  private model: Model

  constructor(client: Client, model: Model, control: Control) {
    this.client = client
    this.control = control
    this.model = model

    console.log(`client: ${this.client}`)
  }

  addTaskCallback = (taskGroupId: TaskGroupId, title: Title = 'New Task', description: Description = 'Task description', dueDate: Date = new Date()) => {
    // @ts-ignore
    const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
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

      const activityId = uuid()
      const comment = title
      const activityRow = [
        activityId,
        projectId,
        this.client.userId,
        ActivityType.CreateTask,
        comment,
        new Date(),
      ]
      console.log(`client2 :${this.client}`)
      const task = this.client.insertRow(TaskTableId, taskId, undefined, row, false)
      const act = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

      this.client.executeTransaction([task, act])
    }
    else {
      throw new Error(`project not found for task group ${taskGroupId}`)
    }
  }

  addTaskGroupCallback = (projectId: ProjectId, title: Title = 'new task group', description: Description = 'desc') => {
    const taskGroupId = uuid()
    const row: ColumnValue[] = [
      taskGroupId,
      title,
      description,
      projectId,
    ]

    const add = this.client.appendRow(TaskGroupTableId, taskGroupId, row, false)

    const activityId = uuid()
    const comment = title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.AddTaskGroup,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([add, activity])
  }

  removeTaskGroupCallback = (taskGroupId: TaskGroupId) => {
    const remove = this.client.removeRow(TaskGroupTableId, taskGroupId, false)

    const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
    const taskGroup = this.model.getProject(projectId).getTaskGroup(taskGroupId)
    const activityId = uuid()
    const comment = taskGroup.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.RemoveTaskGroup,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([remove, activity])
  }

  removeTaskCallback = (taskId: TaskId) => {
    const projectId = this.model.getProjectIdByTaskId(taskId)
    if (projectId) {
      const removeTask = this.client.removeRow(TaskTableId, taskId, false)

      const task = this.model.getProject(projectId).getTask(taskId)
      const activityId = uuid()
      const comment = task.title
      const activityRow = [
        activityId,
        projectId,
        this.client.userId,
        ActivityType.RemoveTask,
        comment,
        new Date(),
      ]
      const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

      this.client.executeTransaction([removeTask, activity])
    }
    else {
      throw new Error(`project for task ${taskId} not found`)
    }
  }

  updateTaskGroupTitleCallback = (taskGroupId: TaskGroupId, title: Title) => {
    const update = this.client.updateCell(TaskGroupTableId, taskGroupId, 'title', title, false)

    const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
    const activityId = uuid()
    const comment = title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.UpdateTaskGroupTitle,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([update, activity])
  }

  updateTaskTitleCallback = (taskId: TaskId, title: Title) => {
    const projectId = this.model.getProjectIdByTaskId(taskId)
    if (projectId) {
      const updateTitle = this.client.updateCell(TaskTableId, taskId, 'title', title, false)

      const activityId = uuid()
      const comment = title
      const activityRow = [
        activityId,
        projectId,
        this.client.userId,
        ActivityType.UpdateTaskTitle,
        comment,
        new Date(),
      ]
      const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

      this.client.executeTransaction([updateTitle, activity])
    }
    else {
      throw new Error(`project for task ${taskId} not found`)
    }
  }

  updateTaskDescriptionCallback = (taskId: TaskId, description: Description) => {
    const update = this.client.updateCell(TaskTableId, taskId, 'description', description, false)

    const projectId = this.model.getProjectIdByTaskId(taskId)
    const task = this.model.getProject(projectId).getTask(taskId)
    const activityId = uuid()
    const comment = task.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.UpdateTaskDescription,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([update, activity])
  }

  updateTaskDueDateCallback = (taskId: TaskId, dueDate: Date) => {
    const updateDueDate = this.client.updateCell(TaskTableId, taskId, 'dueDate', dueDate, false)

    const activityId = uuid()
    const projectId = this.model.getProjectIdByTaskId(taskId)
    const task = this.model.getProject(projectId).getTask(taskId)
    const comment = task.title 
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.UpdateTaskDueDate,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([updateDueDate, activity])
  }

  updateProjectTitleCallback = (projectId: ProjectId, title: Title) => {
    const update = this.client.updateCell(ProjectTableId, projectId, 'title', title, false)

    const activityId = uuid()
    const comment = title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.UpdateProjectTitle,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([update, activity])
  }

  updateProjectDescriptionCallback = (projectId: ProjectId, description: Description) => {
    this.client.updateCell(ProjectTableId, projectId, 'description', description)
  }

  updateProjectDueDateCallback = (projectId: ProjectId, dueDate: Date) => {
    const updateDueDate = this.client.updateCell(ProjectTableId, projectId, 'dueDate', dueDate, false)

    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const comment = project.title 
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.UpdateProjectDueDate,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([updateDueDate, activity])
  }

  getTaskOwnerRowId = (taskId: TaskId, ownerId: UserId) => {
    return `${TaskOwnerTableId}-${taskId}-${ownerId}`
  }

  addTaskOwnerCallback = (taskId: TaskId, ownerId: UserId) => {
    const row = [
      ownerId,
      taskId
    ]
    const addOwner = this.client.appendRow(TaskOwnerTableId, this.getTaskOwnerRowId(taskId, ownerId), row, false)

    const projectId = this.model.getProjectIdByTaskId(taskId)
    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const task = project.getTask(taskId)
    const comment = `Added <b>${ownerId}</b> to Task <b>${task.title}</b>`
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.AddTaskOwner,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([addOwner, activity])
  }

  removeTaskOwnerCallback = (taskId: TaskId, ownerId: UserId) => {
    const removeOwner = this.client.removeRow(TaskOwnerTableId, this.getTaskOwnerRowId(taskId, ownerId), false)

    const projectId = this.model.getProjectIdByTaskId(taskId)
    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const task = project.getTask(taskId)
    const comment = `Removed <b>${ownerId}</b> from Task <b>${task.title}</b>`
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.RemoveTaskOwner,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([removeOwner, activity])
  }

  addTaskAttachmentCallback = (asset: Asset, projectId: ProjectId, taskId: TaskId, description: Description) => {
    const ts = new Date()
    const assetValues = [
      asset.id,
      asset.name,
      asset.type,
      asset.description,
      this.client.userId,
      ts,
      this.client.userId,
      ts,
      asset.content, 
    ]
    const appendAsset = this.client.appendRow(AssetTableId, asset.id, assetValues, false)

    const attachmentId = createTaskAttachmentId(projectId, taskId, asset.id)
    const attachmentValues = [
      attachmentId,
      asset.id,
      projectId,
      taskId,
      description,
    ]
    const appendAttachment = this.client.appendRow(TaskAttachmentTableId, attachmentId, attachmentValues, false)

    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const task = project.getTask(taskId)
    const comment = task.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.AddTaskAttachment,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([appendAsset, appendAttachment, activity])
  }

  removeTaskAttachmentCallback = (projectId: ProjectId, taskId: TaskId, attachmentId: AttachmentId) => {
    const remove = this.client.removeRow(TaskAttachmentTableId, attachmentId, false)

    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const task = project.getTask(taskId)
    const comment = task.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.RemoveTaskAttachment,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([remove, activity])
  }

  createChecklistActivity(projectId: ProjectId, taskId: TaskId, type: ActivityType): string {
    const activityId = uuid()
    const project = this.model.getProject(projectId)
    const task = project.getTask(taskId)
    const comment = task.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      type,
      comment,
      new Date(),
    ]

    return this.client.appendRow(ActivityTableId, activityId, activityRow, false)
  }

  addCheckListItemCallback = (taskId: TaskId, description: Description, status: ItemStatus) => {
    const rowId = uuid()
    // FIXME: how to get project id?
    // @ts-ignore
    const projectId = this.model.getProjectIdByTaskId(taskId)
    const row = [
      rowId,
      projectId, 
      taskId, 
      description,
      status,
    ]
    const addItem = this.client.appendRow(CheckListTableId, rowId, row, false)

    const activity = this.createChecklistActivity(projectId, taskId, ActivityType.AddTaskChecklistItem)

    this.client.executeTransaction([addItem, activity])
  }

  removeCheckListItemCallback = (projectId: ProjectId, taskId: TaskId, itemId: ItemId) => {
    const removeItem = this.client.removeRow(CheckListTableId, itemId, false)

    const activity = this.createChecklistActivity(projectId, taskId, ActivityType.RemoveTaskChecklistItem)

    this.client.executeTransaction([removeItem, activity])
  }

  updateCheckListItemStatusCallback = (projectId: ProjectId, taskId: TaskId, itemId: ItemId, status: ItemStatus) => {
    const updateItem = this.client.updateCell(CheckListTableId, itemId, CheckListTableColumnName.Status, status, false)

    const activity = this.createChecklistActivity(projectId, taskId, ActivityType.UpdateTaskChecklistItemStatus)

    this.client.executeTransaction([updateItem, activity])

  }

  updateCheckListItemDescriptionCallback = (projectId: ProjectId, taskId: TaskId, itemId: ItemId, description: Description) => {
    const updateItem = this.client.updateCell(CheckListTableId, itemId, CheckListTableColumnName.Description, description, false)

    const activity = this.createChecklistActivity(projectId, taskId, ActivityType.UpdateTaskChecklistItemTitle)

    this.client.executeTransaction([updateItem, activity])
  }

  sendProjectChatCallback = (projectId: ProjectId, message: Message, replyToId: MessageId) => {
    const id = uuid()
    const row = [
      id, 
      projectId, 
      replyToId, 
      this.client.userId, 
      message, 
      new Date(),
    ]
    const chat = this.client.appendRow(ProjectChatTableId, id, row, false)

    const project = this.model.getProject(projectId)
    const activityId = uuid()
    const comment = project.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.PostProjectComment,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([chat, activity])
  }

  sendTaskChatCallback = (taskId: TaskId, message: Message, replyToId: MessageId) => {
    // @ts-ignore
    const projectId = this.model.getProjectIdByTaskId(taskId)

    const id = uuid()

    const row = [
      id, 
      projectId, 
      replyToId, 
      this.client.userId, 
      message, 
      new Date(),
      taskId
    ]
    const chat = this.client.appendRow(TaskChatTableId, id, row, false)

    const task = this.model.getProject(projectId).getTask(taskId)
    const activityId = uuid()
    const comment = task.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.PostTaskComment,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([chat, activity])
  }

  addUser = (userId: UserId, userName: string, title: Title, description: Description, avatarFile) => {
    const reader = new FileReader()
    reader.readAsDataURL(avatarFile)
    reader.onloadend = (evt) => {
      const assetId = uuid()
      const ts = new Date()
      const assetName = `${userId}-avatar`
      const assetType = 'image'
      const assetDescription = assetName
      // @ts-ignore
      const content = evt.target.result

      const values = [
        assetId as AssetId,
        assetName as AssetName,
        assetType as AssetType,
        assetDescription,
        this.client.userId,
        ts,
        this.client.userId,
        ts,
        content, 
      ]

      const addAvatarAsset = this.client.appendRow(AssetTableId, assetId, values, false)

      const memberRowId = uuid()
      const row = [
        userId,
        userName,
        title,
        description,
        assetId,
      ]
      const addMember = this.client.appendRow(MemberTableId, memberRowId, row, false)  

      // console.log(addAvatarAsset)
      // console.log(addMember)
      this.client.executeTransaction([addAvatarAsset, addMember])
    }
  }

  addProjectMember = (userId: UserId, projectId: ProjectId) => {
    const addMember = this.client.appendRow(ProjectMemberTableId, `${userId}#${projectId}`, [userId, projectId], false)

    const comment = userId
    const activityId = uuid()
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.AddProjectMember,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([addMember, activity])
  }

  removeProjectMember = (userId: UserId, projectId: ProjectId) => {
    const removeMember = this.client.removeRow(ProjectMemberTableId, `${userId}#${projectId}`, false)

    const comment = userId
    const activityId = uuid()
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.RemoveProjectMember,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([removeMember, activity])
  }

  login = (userId: UserId, password: string) => {
    this.client.login(userId, password)
  }

  logout = () => {
    this.client.logout()

    this.control.clear()

    this.client = init(window.location.hostname, 8080)

    console.log('done logout')
  }

  addProjectCallback = (title: Title = 'new project', description: Description, dueDate: Date = new Date()) => {
    const projectId = uuid()
    const row = [
      projectId,
      title, 
      description,
      dueDate
    ]
    const addProject = this.client.appendRow(ProjectTableId, projectId, row, false)

    const activityId = uuid()
    const comment = title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.CreateProject,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([addProject, activity])
  }

  removeProjectCallback = (projectId: ProjectId) => {
    // FIXME: remove project contents
    const removeProject = this.client.removeRow(ProjectTableId, projectId, false)

    const project = this.model.getProject(projectId)
    const activityId = uuid()
    const comment = project.title
    const activityRow = [
      activityId,
      projectId,
      this.client.userId,
      ActivityType.RemoveProject,
      comment,
      new Date(),
    ]
    const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

    this.client.executeTransaction([removeProject, activity])
  }

  createSortingCallBack = () => {

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
      // console.log(elementClass)

      if (elementClass === 'TaskGroup') {
        const tableId = TaskGroupTableId    
        const taskGroupId = event.item.id
        const toTaskGroupIndex = event.newIndex

        const projectId = this.model.getProjectIdByTaskGroupId(taskGroupId)
        if (projectId) {
          const activityId = uuid()
          const taskGroup = this.model.getProject(projectId).getTaskGroup(taskGroupId)
          const comment = taskGroup.title
          const activityRow = [
            activityId,
            projectId,
            this.client.userId,
            ActivityType.MoveTaskGroup,
            comment,
            new Date(),
          ]
          const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)
          if (toTaskGroupIndex === 0) {
            const move = this.client.moveRowAndUpdateCell(tableId, taskGroupId, undefined, undefined, undefined, false) 
            this.client.executeTransaction([move, activity])
          }
          else {
            const afterTaskGroupId = event.item.parentElement.children[toTaskGroupIndex - 1].getAttribute('id')
            if (afterTaskGroupId) {
              const move = this.client.moveRowAndUpdateCell(tableId, taskGroupId, afterTaskGroupId, undefined, undefined, false) 
              this.client.executeTransaction([move, activity])
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
        
        const projectId = this.model.getProjectIdByTaskId(taskId)
        if (projectId) {
          const activityId = uuid()
          const task = this.model.getProject(projectId).getTask(taskId)
          const comment = task.title
          const activityRow = [
            activityId,
            projectId,
            this.client.userId,
            ActivityType.MoveTask,
            comment,
            new Date(),
          ]
          const activity = this.client.appendRow(ActivityTableId, activityId, activityRow, false)

          if (toTaskIndex == 0) {
            const move = this.client.moveRowAndUpdateCell(tableId, taskId, undefined, columnName, columnValue, false) 
            this.client.executeTransaction([move, activity])
          }
          else {
            const afterTaskId = event.item.parentElement.children[toTaskIndex - 1].getAttribute('id')
            if (afterTaskId) {
              const move = this.client.moveRowAndUpdateCell(tableId, taskId, afterTaskId, columnName, columnValue, false)
              this.client.executeTransaction([move, activity])
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
}