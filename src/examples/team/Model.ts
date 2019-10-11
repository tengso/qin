import { TaskRow, TaskGroupRow, ProjectRow, ProjectId, TaskGroupId, TaskId, Title, Description, MemberRow, AssetId, AssetRow, AssetName, AssetType, CheckListRow, ItemStatus, ItemId, ProjectChatRow, Message, MessageId, PosterId, TaskChatRow, TaskAttachmentRow, AttachmentId } from './Core'
import { UserId } from '../../TableFlowMessages'

// class Node<Value> {
//   private id: string
//   private value: Value
//   private childList = new Array<Node<Value>>()

//   constructor(value: Value) {
//     this.value = value
//   }

//   getValue(): Value {
//     return this.value
//   }

//   getId(): string {
//     return this.id
//   }

//   appendChild(child: Node<Value>) {
//     this.childList.push(child)
//   }

//   insertChild(child: Node<Value>, after: string | undefined): number {
//     if (after) {
//       let index = this.childList.findIndex(child => child.id === after)
//       if (index != -1) {
//         index++
//         this.childList.splice(index, 0, child)
//         return index
//       }
//       else {
//         throw new Error(`${after} not found`)
//       }
//     }
//     // insert at first
//     else {
//       this.childList.splice(0, 0, child)
//       return 0
//     }
//   }

//   removeChild(childId: string) {
//     const index = this.childList.findIndex(child => child.id === childId)
//     if (index != -1) {
//       this.childList.splice(index, 1)
//     }
//   }

//   getChildIndex(childId: string): number | undefined {
//     const index = this.childList.findIndex(child => child.id === childId)
//     return index != -1 ? index : undefined
//   }
// }

export class ChatMessage {
  id: MessageId
  replyToId: MessageId
  posterId: PosterId
  message: Message 
  postTime: Date
}

export interface Project {
  readonly id: ProjectId
  title: Title
  description: Description
  dueDate: Date

  appendMember(member: Member): void
  removeMember(memberId: UserId): void
  getMembers(): Array<Member>

  getTask(taskId: TaskId): Task | undefined
  getAllTasks(): Array<Task>

  appendChatMessage(message: ChatMessage): ChatMessage
}

class ProjectImpl implements Project {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date

  private taskGroupList = new Array<TaskGroupImpl>()
  private taskGroupMap = new Map<TaskGroupId, TaskGroupImpl>()

  private memberList = new Array<Member>()
  private memberMap = new Map<UserId, Member>()

  private chatMessageList = new Array<ChatMessage>()
  private chatMessageMap = new Map<MessageId, ChatMessage>()

  constructor() {}

  appendChatMessage(message: ChatMessage): ChatMessage {
    if (!this.chatMessageMap.get(message.id)) {
      this.chatMessageList.push(message)
      this.chatMessageMap.set(message.id, message)
      return message
    }
    else {
      throw new Error(`message ${message.id} already exists`)
    }
  }

  getAllTasks(): Array<Task> {
    const allTasks = new Array<Task>()
    for(const taskGroup of this.taskGroupList) {
      const tasks = taskGroup.getAllTasks()
      for (const task of tasks) {
        allTasks.push(task)
      }
    }

    return allTasks
  }

  getTask(taskId: TaskId): Task | undefined {
    for(const taskGroup of this.taskGroupList) {
      const task = taskGroup.getTask(taskId)
      if (task) {
        return task
      }
    }

    return undefined
  }

  appendMember(member: Member) {
    // console.log(`append project member ${member.id}`)
    if (!this.memberMap.get(member.id)) {
      this.memberList.push(member)
      this.memberMap.set(member.id, member)
    }
    else {
      throw new Error(`member ${member.id} already exists`)
    }
  }

  removeMember(memberId: UserId) {
    // console.log(`remove project member ${memberId}`)
    const index = this.memberList.findIndex((member) => {
      return member.id === memberId})
    if (index != -1) {
      this.memberList.splice(index, 1)
      this.memberMap.delete(memberId)
    }
    else {
      throw new Error(`member ${memberId} not found`)
    }
  }

  getMembers() {
    // FIXME: should return a copy
    return this.memberList
  }

  getTaskGroup(taskGroupId: TaskGroupId): TaskGroupImpl | undefined {
    // console.log(this.taskGroupMap)
    return this.taskGroupMap.get(taskGroupId)
  }

  getTaskGroupByIndex(index: number): TaskGroup | undefined {
    if (index < this.taskGroupList.length) {
      return this.taskGroupList[index]
    }
    else {
      return undefined
    }
  }

  getTaskGroupOfTask(taskId: TaskId): TaskGroupImpl | undefined {
    for (let i = 0; i < this.taskGroupList.length; i++) {
      const taskGroup = this.taskGroupList[i]
      if (taskGroup.getTask(taskId)) {
        return taskGroup
      }
    }

    return undefined
  }

  appendTaskGroup(taskGroup: TaskGroupImpl): void {
    // console.log(taskGroup)
    this.taskGroupList.push(taskGroup)
    this.taskGroupMap.set(taskGroup.id, taskGroup)
  }

  // return the index of the new element
  insertTaskGroup(taskGroup: TaskGroupImpl, afterTaskGroupId: TaskGroupId | undefined): number {
    if (afterTaskGroupId) {
      let index = this.taskGroupList.findIndex(taskGroup => taskGroup.id === afterTaskGroupId)
      if (index != -1) {
        index++
        this.taskGroupList.splice(index, 0, taskGroup)
        this.taskGroupMap.set(taskGroup.id, taskGroup)
        return index
      }
      else {
        throw new Error(`${afterTaskGroupId} not found`)
      }
    }
    // insert at first
    else {
      this.taskGroupList.splice(0, 0, taskGroup)
      this.taskGroupMap.set(taskGroup.id, taskGroup)
      return 0
    }
  }

  removeTaskGroup(taskGroupId: TaskGroupId) {
    const index = this.taskGroupList.findIndex(taskGroup => taskGroup.id === taskGroupId)
    if (index != -1) {
      this.taskGroupList.splice(index, 1)
      this.taskGroupMap.delete(taskGroupId)
    }
    else {
      throw new Error(`${taskGroupId} not found`)
    }
  }

  getTaskGroupIndex(taskGroupId: TaskGroupId): number | undefined {
    const index = this.taskGroupList.findIndex(taskGroup => taskGroup.id === taskGroupId)
    return index != -1 ? index : undefined
  }

  moveTaskGroup(taskGroupId: TaskGroupId, afterTaskGroupId: TaskGroupId | undefined): number {
    const taskGroupIndex = this.getTaskGroupIndex(taskGroupId)
    if (taskGroupIndex != undefined) {
      if (afterTaskGroupId) {
        let afterTaskGroupIndex = this.getTaskGroupIndex(afterTaskGroupId)
        if (afterTaskGroupIndex != undefined) {
          if (taskGroupIndex > afterTaskGroupIndex) {
            afterTaskGroupIndex++
          }
          const taskGroup = this.taskGroupList.splice(taskGroupIndex, 1)[0]
          this.taskGroupList.splice(afterTaskGroupIndex, 0, taskGroup)
          return afterTaskGroupIndex
        }
        else {
          throw new Error(`after task group ${afterTaskGroupId} not found`)
        }
      }
      else {
        const taskGroup = this.taskGroupList.splice(taskGroupIndex, 1)[0]
        this.taskGroupList.splice(0, 0, taskGroup)
      }
    }
    else {
      throw new Error(`task group ${taskGroupId} not found`)
    }
  }
}


export interface TaskGroup {
  readonly id: TaskGroupId
  title: Title
  description: Description

  getAllTasks(): Array<Task>
}

class TaskGroupImpl implements TaskGroup {
  id: TaskGroupId
  title: Title
  description: Description

  private taskList: Array<Task> = new Array<TaskImpl>()
  private taskMap: Map<TaskId, Task>  = new Map<TaskId, TaskImpl>()

  getAllTasks(): Array<Task> {
    return this.taskList
  }

  getTask(taskId: TaskId): Task {
    return this.taskMap.get(taskId)
  }

  getTaskIndex(taskId: TaskId): number | undefined {
    const index = this.taskList.findIndex(task => task.id === taskId)
    return index != -1 ? index : undefined
  }

  getTaskByIndex(index: number): Task | undefined {
    if (index < this.taskList.length) {
      return this.taskList[index]
    }
    else {
      return undefined
    }
  }

  appendTask(task: Task) {
    this.taskMap.set(task.id, task)
    this.taskList.push(task)
  }


  // return the index of the new task
  insertTask(task: Task, afterTaskId: TaskId | undefined): number | undefined {
    if (afterTaskId) {
      let index = this.taskList.findIndex(task => task.id === afterTaskId)
      if (index != -1) {
        index++
        this.taskList.splice(index, 0, task)
        this.taskMap.set(task.id, task)
        return index
      }
      else {
        throw new Error(`${afterTaskId} not found`)
      }
    }
    // insert at first
    else {
      this.taskList.splice(0, 0, task)
      this.taskMap.set(task.id, task)
      return 0
    }
  }

  removeTask(taskId: TaskId) {
    let index = this.taskList.findIndex(task => task.id === taskId)
    if (index != -1) {
      this.taskList.splice(index, 1)
      this.taskMap.delete(taskId)
    }
  }

  moveTask(taskId: TaskId, afterTaskId: TaskId): number {
    const taskIndex = this.getTaskIndex(taskId)
    if (taskIndex != undefined) {
      let afterTaskIndex = this.getTaskIndex(afterTaskId) 
      if (afterTaskIndex != undefined) {
        afterTaskIndex++
        const task = this.taskList.splice(taskIndex, 1)[0]
        this.taskList.splice(afterTaskIndex++, 0, task)

        return afterTaskIndex
      }
      else {
        throw new Error(`after task ${afterTaskId} not found`)
      }
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }
}

export class CheckListItem {
  id: ItemId
  description: Description
  status: ItemStatus
}

export class AttachmentItem {
  id: AttachmentId
  assetId: AssetId
  description: Description
}

export interface Task {
  readonly id: TaskId
  title: Title
  description: Description
  dueDate: Date

  appendOwner(member: Member): void
  removeOwner(memberId: UserId): void
  getAllOwner(): Array<Member>

  appendItem(item: CheckListItem): CheckListItem
  removeItem(itemId: ItemId): CheckListItem
  updateItemStatus(itemId: ItemId, status: ItemStatus): CheckListItem
  getItem(itemId: ItemId): CheckListItem | undefined

  appendChatMessage(message: ChatMessage): ChatMessage

  appendAttachment(attachment: AttachmentItem): AttachmentItem
  removeAttachment(attachmentId: AttachmentId): AttachmentItem
}

class TaskImpl implements Task {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date

  private ownerList = new Array<Member>()
  private ownerMap = new Map<UserId, Member>()

  private itemList = new Array<CheckListItem>()
  private itemMap = new Map<ItemId, CheckListItem>()

  private chatMessageList = new Array<ChatMessage>()
  private chatMessageMap = new Map<MessageId, ChatMessage>()

  private attachmentList = new Array<AttachmentItem>()
  private attachmentMap = new Map<AttachmentId, AttachmentItem>()

  appendChatMessage(message: ChatMessage): ChatMessage {
    if (!this.chatMessageMap.get(message.id)) {
      this.chatMessageList.push(message)
      this.chatMessageMap.set(message.id, message)

      return message
    }
    else {
      throw new Error(`message ${message.id} exists`)
    }
  }

  appendOwner(member: Member): void {
    if (!this.ownerMap.get(member.id)) {
      this.ownerList.push(member)
      this.ownerMap.set(member.id, member)
    }
    else {
      throw new Error(`owner ${member.id} exists`)
    }
  }

  removeOwner(memberId: UserId): void {
    const index = this.ownerList.findIndex(owner => {return owner.id === memberId})
    if (index != -1) {
      this.ownerList.splice(index, 1)
      this.ownerMap.delete(memberId)
    }
    else {
      throw new Error(`owner ${memberId} not found`)
    }
  }

  getAllOwner(): Array<Member> {
    return this.ownerList
  }

  appendAttachment(attachment: AttachmentItem): AttachmentItem {
    if (!this.attachmentMap.get(attachment.id)) {
      this.attachmentList.push(attachment)
      this.attachmentMap.set(attachment.id, attachment)
      return attachment
    }
    else {
      throw new Error(`owner ${attachment.id} exists`)
    }
  }

  removeAttachment(attachmentId: AttachmentId): AttachmentItem {
    const index = this.attachmentList.findIndex(attachment => {return attachment.id === attachmentId})
    if (index != -1) {
      const attachment = this.attachmentList.splice(index, 1)
      this.attachmentMap.delete(attachmentId)
      return attachment[0]
    }
    else {
      throw new Error(`owner ${attachmentId} not found`)
    }
  }

  getItem(itemId: ItemId): CheckListItem | undefined {
    return this.itemMap.get(itemId)
  }

  appendItem(item: CheckListItem): CheckListItem {
    if (!this.itemMap.get(item.id)) {
      this.itemMap.set(item.id, item)
      this.itemList.push(item)
      return item
    }
    else {
      throw new Error(`item ${item.id} exists`)
    }
  }

  removeItem(itemId: ItemId): CheckListItem {
    const index = this.itemList.findIndex(item => {
      return item.id === itemId
    })

    if (index != -1) {
      const item = this.itemList.splice(index, 1)
      this.itemMap.delete(itemId)
      return item[0]
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }
  }

  updateItemStatus(itemId: ItemId, status: ItemStatus): CheckListItem {
    const index = this.itemList.findIndex(item => {
      return item.id === itemId
    })

    if (index != -1) {
      this.itemList[index].status = status
      this.itemMap.get(itemId).status = status
      return this.itemList[index]
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }

  }
}

export interface Member {
  id: UserId
  name: string
  title: string
  description: Description
  avatar: AssetId
}

class MemberImpl implements Member {
  id: UserId
  name: string
  title: string
  description: Description
  avatar: AssetId
}

export interface Asset {
  id: AssetId
  name: AssetName
  type: AssetType 
  description: Description
  content: any
}

class AssetImpl implements Asset {
  id: AssetId
  name: AssetName
  type: AssetType 
  description: Description
  content: any
}

export class Model {
  private projectList: Array<ProjectImpl>
  private projectMap: Map<ProjectId, ProjectImpl>

  private taskToProjectMap: Map<TaskId, ProjectId>
  private taskGroupToProjectMap: Map<TaskGroupId, ProjectId>

  private memberList: Array<Member>
  private memberMap: Map<UserId, MemberImpl>

  private assetList: Array<Asset>
  private assetMap: Map<AssetId, AssetImpl>

  constructor() {
    this.reset()
  }

  reset() {
    this.projectList = new Array<ProjectImpl>()
    this.projectMap = new Map<ProjectId, ProjectImpl>()

    this.taskToProjectMap = new Map<TaskId, ProjectId>()
    this.taskGroupToProjectMap = new Map<TaskGroupId, ProjectId>()

    this.memberList = new Array<Member>()
    this.memberMap = new Map<UserId, MemberImpl>()

    this.assetList = new Array<Asset>()
    this.assetMap = new Map<AssetId, AssetImpl>()
  }

  private createMember(values: MemberRow): MemberImpl {
    const member = new MemberImpl()
    member.id = values.id
    member.name = values.name
    member.title = values.title
    member.description = values.description
    member.avatar = values.avatar

    return member
  }

  private createAsset(values: AssetRow): AssetImpl {
    const asset = new AssetImpl()
    asset.id = values.id
    asset.name = values.name
    asset.type = values.type
    asset.description = values.description
    asset.content = values.content

    return asset
  }


  private createTask(values: TaskRow): Task {
    const task = new TaskImpl() 
    task.id = values.id
    task.title = values.title
    task.description = values.description
    task.dueDate = values.dueDate

    this.taskToProjectMap.set(task.id, values.projectId)

    return task
  }

  private createTaskGroup(values: TaskGroupRow): TaskGroupImpl {
    const taskGroup = new TaskGroupImpl()
    taskGroup.id = values.id
    taskGroup.title = values.title
    taskGroup.description = values.description

    this.taskGroupToProjectMap.set(taskGroup.id, values.projectId)

    return taskGroup
  }

  private createProject(values: ProjectRow): ProjectImpl {
    const project = new ProjectImpl()
    project.id = values.id
    project.title = values.title
    project.description = values.description
    project.dueDate = values.dueDate

    return project
  }

  getProject(projectId: ProjectId): Project | undefined {
    return this.projectMap.get(projectId)
  }

  appendProject(values: ProjectRow): Project {
    const project = this.createProject(values)
    this.projectList.push(project)
    this.projectMap.set(project.id, project)
    return project
  }

  appendTaskGroup(values: TaskGroupRow): [Project, TaskGroup] {
    const project = this.projectMap.get(values.projectId)
    if (project) {
      const taskGroup = this.createTaskGroup(values)
      project.appendTaskGroup(taskGroup)
      return [project, taskGroup]
    }
    else {
      throw new Error(`project ${values.projectId} not found`)
    }
  }

  appendTask(values: TaskRow): [Project, TaskGroup, Task] {
    const project = this.projectMap.get(values.projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(values.taskGroupId)
      if (taskGroup) {
        const task = this.createTask(values)
        taskGroup.appendTask(task)
        return [project, taskGroup, task]
      }
      else {
        throw new Error(`task group ${values.taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project ${values.projectId} not found`)
    }
  }

  insertProject(afterProjectId: ProjectId, values: ProjectRow): [Project, number] {
    const project = this.createProject(values)
    if (afterProjectId) {
      let index = this.projectList.findIndex(project => project.id === afterProjectId)
      if (index != -1) {
        index++
        this.projectList.splice(index, 0, project)
        this.projectMap.set(project.id, project)
        return [project, index]
      }
      else {
        throw new Error(`after project ${afterProjectId} not found`)
      }
    }
    else {
      this.projectList.splice(0, 0, project)
      this.projectMap.set(project.id, project)
        return [project, 0]
    }
  }

  insertTaskGroup(afterTaskGroupId: TaskGroupId, values: TaskGroupRow): [Project, TaskGroup, number] {
    const project = this.projectMap.get(values.projectId)
    if (project) {
      const taskGroup = this.createTaskGroup(values)
      const index = project.insertTaskGroup(taskGroup, afterTaskGroupId)
      return [project, taskGroup, index]
    }
    else {
      throw new Error(`project ${values.projectId} not found`)
    }
  }

  insertTask(afterTaskId: TaskId, values: TaskRow): [Project, TaskGroup, Task, number] {
    const project = this.projectMap.get(values.projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(values.taskGroupId)
      if (taskGroup) {
        const task = this.createTask(values)
        const index = taskGroup.insertTask(task, afterTaskId)
        return [project, taskGroup, task, index]
      }
      else {
        throw new Error(`task group ${values.taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project ${values.projectId} not found`)
    }
  }

  removeProject(projectId: ProjectId) {
    const index = this.projectList.findIndex(project => project.id === projectId)
    if (index != -1) {
      this.projectList.splice(index, 1)
      this.projectMap.delete(projectId)
      return index
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  removeTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.removeTaskGroup(taskGroupId)
      this.taskGroupToProjectMap.delete(taskGroupId)
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  removeTask(projectId: ProjectId, taskGroupId: TaskGroupId, taskId: TaskId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(taskGroupId)
      if (taskGroup) {
        taskGroup.removeTask(taskId)
        this.taskToProjectMap.delete(taskId)
      }
      else {
        throw new Error(`task group ${taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  moveTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId, afterTaskGroupId: TaskGroupId): number {
    const project = this.projectMap.get(projectId)
    if (project) {
      return project.moveTaskGroup(taskGroupId, afterTaskGroupId)
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  moveTask(projectId: ProjectId, taskId: TaskId, toTaskGroupId: TaskGroupId | undefined, afterTaskId: TaskId | undefined): number {
    const project = this.projectMap.get(projectId)
    if (project) {
      const toTaskGroup = toTaskGroupId ? project.getTaskGroup(toTaskGroupId) : project.getTaskGroupOfTask(taskId)
      if (toTaskGroup) {
        const fromTaskGroup = project.getTaskGroupOfTask(taskId)
        if (fromTaskGroup) {
          const task = fromTaskGroup.getTask(taskId)
          if (task) {
            fromTaskGroup.removeTask(taskId)
            return toTaskGroup.insertTask(task, afterTaskId)
          }
          else {
            throw new Error(`task ${taskId} not found`)
          }
        }
        else {
          throw new Error(`from task group not found for task ${taskId}`)
        }
      }
      else {
        throw new Error(`to task group ${toTaskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateTaskGroupTitle(projectId: ProjectId, taskGroupId: TaskGroupId, title: Title) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(taskGroupId)
      if (taskGroup) {
        taskGroup.title = title
      }
      else {
        throw new Error(`task group ${taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateTaskTitle(projectId: ProjectId, taskId: TaskId, title: Title) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroupOfTask(taskId)
      if (taskGroup) {
        const task = taskGroup.getTask(taskId)
        if (task) {
          task.title = title
        }
        else {
          throw new Error(`task ${taskId} not found`)
        }
      }
      else {
        throw new Error(`task group of task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateTaskDueDate(projectId: ProjectId, taskId: TaskId, dueDate: Date) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroupOfTask(taskId)
      if (taskGroup) {
        const task = taskGroup.getTask(taskId)
        if (task) {
          task.dueDate = dueDate
        }
        else {
          throw new Error(`task ${taskId} not found`)
        }
      }
      else {
        throw new Error(`task group of task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateTaskDescription(projectId: ProjectId, taskId: TaskId, description: Description) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroupOfTask(taskId)
      if (taskGroup) {
        const task = taskGroup.getTask(taskId)
        if (task) {
          task.description = description
        }
        else {
          throw new Error(`task ${taskId} not found`)
        }
      }
      else {
        throw new Error(`task group of task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateTaskGroupDescription(projectId: ProjectId, taskGroupId: TaskGroupId, description: Description) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(taskGroupId)
      if (taskGroup) {
        taskGroup.description = description
      }
      else {
        throw new Error(`task group element ${taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }

  getProjectIdByTaskGroupId(taskGroupId: TaskGroupId): ProjectId | undefined {
    return this.taskGroupToProjectMap.get(taskGroupId)
  }

  getProjectIdByTaskId(taskId: TaskGroupId): ProjectId | undefined {
    return this.taskToProjectMap.get(taskId)
  }

  getTaskGroupByIndex(projectId: ProjectId, taskGroupIndex: number): TaskGroup | undefined {
    const project = this.projectMap.get(projectId)
    if (project) {
      return project.getTaskGroupByIndex(taskGroupIndex)
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  getTaskByIndex(projectId: ProjectId, taskGroupId: TaskGroupId, taskIndex: number): Task | undefined {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(taskGroupId)
      if (taskGroup) {
        return taskGroup.getTaskByIndex(taskIndex)
      }
      else {
        throw new Error(`task group ${projectId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  appendMember(values: MemberRow) {
    const member = this.createMember(values)
    this.memberList.push(member)
    this.memberMap.set(member.id, member)
  }

  getMember(userId: UserId): Member | undefined {
    return this.memberMap.get(userId)
  }

  appendAsset(values: AssetRow) {
    const asset = this.createAsset(values)
    // console.log(`append asset ${asset.id}`)
    this.assetList.push(asset)
    this.assetMap.set(asset.id, asset)
  }

  getAsset(assetId: AssetId): Asset | undefined {
    return this.assetMap.get(assetId)
  }

  getAllProjectMember(projectId: ProjectId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      return project.getMembers()
    }
    else {
      throw new Error(`project ${projectId}  not found`)
    }
  }

  appendProjectMember(projectId: ProjectId, member: Member) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.appendMember(member)
    }
    else {
      throw new Error(`project ${projectId}  not found`)
    }
  }

  removeProjectMember(projectId: ProjectId, memberId: UserId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.removeMember(memberId)
    }
    else {
      throw new Error(`project ${projectId}  not found`)
    }
  }

  appendTaskOwner(taskId: TaskId, member: Member) {
    const projectId = this.getProjectIdByTaskId(taskId)
    if (projectId) {
      const project = this.projectMap.get(projectId)
      const taskGroup = project.getTaskGroupOfTask(taskId)
      if (taskGroup) {
        const task = taskGroup.getTask(taskId)
        if (task) {
          task.appendOwner(member)
        }
        else {
          throw new Error(`task for ${taskId} not found`)
        }
      }
      else {
        throw new Error(`task group for ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project for ${taskId} not found`)
    }
  }

  removeTaskOwner(taskId: TaskId, ownerId: UserId) {
    const projectId = this.getProjectIdByTaskId(taskId)
    if (projectId) {
      const project = this.projectMap.get(projectId)
      const taskGroup = project.getTaskGroupOfTask(taskId)
      if (taskGroup) {
        const task = taskGroup.getTask(taskId)
        if (task) {
          task.removeOwner(ownerId)
        }
        else {
          throw new Error(`task for ${taskId} not found`)
        }
      }
      else {
        throw new Error(`task group for ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project for ${taskId} not found`)
    }
  }

  private createCheckListItem(row: CheckListRow): CheckListItem {
    const item = new CheckListItem()
    item.id = row.id
    item.description = row.description
    item.status = row.status
    return item
  }

  private createAttachmentItem(row: TaskAttachmentRow): AttachmentItem {
    const item = new AttachmentItem()
    item.id = row.id
    item.assetId = row.assetId
    item.description = row.description
    return item
  }

  appendCheckListItem(row: CheckListRow): CheckListItem {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const task = project.getTask(row.taskId)
      if (task) {
        const item = this.createCheckListItem(row)
        return task.appendItem(item)
      }
      else {
        throw new Error(`task ${row.taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${project.id} not found`)
    }
  }

  appendTaskAttachmentItem(row: TaskAttachmentRow): AttachmentItem {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const task = project.getTask(row.taskId)
      if (task) {
        const item = this.createAttachmentItem(row)
        return task.appendAttachment(item)
      }
      else {
        throw new Error(`task ${row.taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${project.id} not found`)
    }
  }

  removeTaskAttachmentItem(row: TaskAttachmentRow): AttachmentItem {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const task = project.getTask(row.taskId)
      if (task) {
        return task.removeAttachment(row.id)
      }
      else {
        throw new Error(`task ${row.taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${project.id} not found`)
    }
  }

  removeCheckListItem(row: CheckListRow): CheckListItem {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const task = project.getTask(row.taskId)
      if (task) {
        const item = this.createCheckListItem(row)
        return task.removeItem(item.id)
      }
      else {
        throw new Error(`task ${row.taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${project.id} not found`)
    }
  }

  // FIXME: use map to make this more efficient
  findCheckListItem(itemId: ItemId): [CheckListItem, Task] | undefined {
    for (const project of this.projectList) {
      for (const task of project.getAllTasks()) {
        const item = task.getItem(itemId)
        if (item) {
          return [item, task]
        }
      }
    }
    return undefined
  }

  updateCheckListItemStatus(itemId: ItemId, status: ItemStatus): Task {
    const [item, task] = this.findCheckListItem(itemId)
    // console.log('update item ${item}')
    if (item) {
      item.status = status
      return task
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }
  }

  updateCheckListItemDescription(itemId: ItemId, description: Description) {
    const [item, _] = this.findCheckListItem(itemId)
    // console.log('update item ${item}')
    if (item) {
      item.description = description
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }
  }

  private createChatMessage(row: ProjectChatRow | TaskChatRow): ChatMessage {
    const message = new ChatMessage()
    message.id = row.id
    message.message = row.message
    message.postTime = row.postTime
    message.posterId = row.posterId
    message.replyToId = row.replyToId

    return message
  }

  appendProjectChatMessage(row: ProjectChatRow): ChatMessage {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const message = this.createChatMessage(row)
      return project.appendChatMessage(message)
    }
    else {
      throw new Error(`project ${row.projectId} not found`)
    }
  }

  appendTaskChatMessage(row: TaskChatRow): ChatMessage {
    const project = this.projectMap.get(row.projectId)
    if (project) {
      const task = project.getTask(row.taskId)
      if (task) {
        const message = this.createChatMessage(row)
        return task.appendChatMessage(message)
      }
      else {
        throw new Error(`task ${row.taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${row.projectId} not found`)
    }
  }

  updateProjectTitle(projectId: ProjectId, title: Title) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.title = title
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateProjectDueDate(projectId: ProjectId, dueDate: Date) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.dueDate = dueDate
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateProjectDescription(projectId: ProjectId, description: Description) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.description = description
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  getAllMember(): Array<Member> {
    return this.memberList
  }

  getAllProject(): Array<Project> {
    return this.projectList
  }
}