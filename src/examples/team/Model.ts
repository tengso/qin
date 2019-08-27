import { TaskRow, TaskGroupRow, ProjectRow, ProjectId, TaskGroupId, TaskId, Title, Description } from './Core'

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

export interface Project {
  readonly id: ProjectId
  title: Title
  description: Description
  dueDate: Date
}

class ProjectImpl implements Project {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date

  private taskGroupList = new Array<TaskGroupImpl>()
  private taskGroupMap = new Map<TaskGroupId, TaskGroupImpl>()

  constructor() {}

  getTaskGroup(taskGroupId: TaskGroupId): TaskGroupImpl | undefined {
    console.log(this.taskGroupMap)
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
    console.log(taskGroup)
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
}

class TaskGroupImpl implements TaskGroup {
  id: TaskGroupId
  title: Title
  description: Description

  private taskList = new Array<TaskImpl>()
  private taskMap = new Map<TaskId, TaskImpl>()

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

export interface Task {
  readonly id: TaskId
  title: Title
  description: Description
  dueDate: Date
}

class TaskImpl implements Task {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
}

export class Model {
  private projectList = new Array<ProjectImpl>()
  private projectMap = new Map<ProjectId, ProjectImpl>()

  private taskToProjectMap = new Map<TaskId, ProjectId>()
  private taskGroupToProjectMap = new Map<TaskGroupId, ProjectId>()

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
}