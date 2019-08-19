import { TaskRow, TaskGroupRow, ProjectRow, ProjectId, TaskGroupId, TaskId, Title, Description } from './Core'

class Node<Value> {
  private id: string
  private value: Value
  private childList = new Array<Node<Value>>()

  constructor(value: Value) {
    this.value = value
  }

  getValue(): Value {
    return this.value
  }

  getId(): string {
    return this.id
  }

  appendChild(child: Node<Value>) {
    this.childList.push(child)
  }

  insertChild(child: Node<Value>, after: string | undefined): number {
    if (after) {
      let index = this.childList.findIndex(child => child.id === after)
      if (index != -1) {
        index++
        this.childList.splice(index, 0, child)
        return index
      }
      else {
        throw new Error(`${after} not found`)
      }
    }
    // insert at first
    else {
      this.childList.splice(0, 0, child)
      return 0
    }
  }

  removeChild(childId: string) {
    const index = this.childList.findIndex(child => child.id === childId)
    if (index != -1) {
      this.childList.splice(index, 1)
    }
  }

  getChildIndex(childId: string): number | undefined {
    const index = this.childList.findIndex(child => child.id === childId)
    return index != -1 ? index : undefined
  }
}

export class Project {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date

  private taskGroupList = new Array<TaskGroup>()
  private taskGroupMap = new Map<TaskGroupId, TaskGroup>()

  getTaskGroup(taskGroupId: TaskGroupId): TaskGroup | undefined {
    return this.taskGroupMap.get(taskGroupId)
  }

  appendTaskGroup(taskGroup: TaskGroup): void {
    this.taskGroupList.push(taskGroup)
    this.taskGroupMap.set(taskGroup.id, taskGroup)
  }

  // return the index of the new element
  insertTaskGroup(taskGroup: TaskGroup, afterTaskGroupId: TaskGroupId | undefined): number {
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
}

export class TaskGroup {
  id: TaskGroupId
  // project: Project
  title: Title
  description: Description

  private taskList = new Array<Task>()
  private taskMap = new Map<TaskId, Task>()

  appendTask(task: Task) {
    this.taskMap.set(task.id, task)
    this.taskList.push(task)
  }

  getTaskIndex(taskId: TaskId): number | undefined {
    const index = this.taskList.findIndex(task => task.id === taskId)
    return index != -1 ? index : undefined
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
}

export class Task {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
}

export class Model {
  projectList = new Array<Project>()
  projectMap = new Map<ProjectId, Project>()

  private createTask(values: TaskRow): Task {
    const task = new Task() 
    task.id = values.id
    task.title = values.title
    task.description = values.description
    task.dueDate = values.dueDate

    return task
  }

  private createTaskGroup(values: TaskGroupRow): TaskGroup {
    const taskGroup = new TaskGroup()
    taskGroup.title = values.title
    taskGroup.description = values.description

    return taskGroup
  }

  private createProject(values: ProjectRow): Project {
    const project = new Project()
    project.id = values.id
    project.title = values.title
    project.description = values.description
    project.dueDate = values.dueDate

    return project
  }

  appendProject(values: ProjectRow): Project {
    const project = this.createProject(values)
    this.projectList.push(project)
    this.projectMap.set(project.id, project)
    return project
  }

  appendTaskGroup(values: TaskGroupRow): [Project, TaskGroup] {
    const taskGroup = this.createTaskGroup(values)
    const project = this.projectMap.get(values.projectId)
    if (project) {
      project.appendTaskGroup(taskGroup)
      return [project, taskGroup]
    }
    else {
      throw new Error(`${values.projectId} not found`)
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
        throw new Error(`${values.taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`${values.projectId} not found`)
    }
  }

  insertProject(afterProjectId: ProjectId, values: ProjectRow): [Project, number] {
    const project = this.createProject(values)
    if (afterProjectId) {
      const index = this.projectList.findIndex(project => project.id === afterProjectId)
      if (index != -1) {
        this.projectList.splice(index, 0, project)
        this.projectMap.set(project.id, project)
        return [project, index]
      }
      else {
        throw new Error(`${afterProjectId} not found`)
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
      throw new Error(`${values.projectId} not found`)
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
    }
    this.projectMap.delete(projectId)
  }

  removeTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      project.removeTaskGroup(taskGroupId)
    }
  }

  removeTask(projectId: ProjectId, taskGroupId: TaskGroupId, taskId: TaskId) {
    const project = this.projectMap.get(projectId)
    if (project) {
      const taskGroup = project.getTaskGroup(taskGroupId)
      if (taskGroup) {
        taskGroup.removeTask(taskId)
      }
    }
  }
}