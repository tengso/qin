import Sortable from 'sortablejs'
import {Project, TaskGroup, Task } from './Model'
import {ProjectId, TaskGroupId, TaskId } from './Core'

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
export class View {

  afterSortingCallback: (event) => void

  constructor(afterSortingCallback) {
    this.afterSortingCallback = afterSortingCallback
  }

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
      onEnd: this.afterSortingCallback
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
      onEnd: this.afterSortingCallback
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
      throw new Error(`${project.id} not found`)
    }
  }

  removeTaskGroup(taskGroupId: TaskGroupId) {
    const taskGroupElement = document.getElementById(taskGroupId)
    if (taskGroupElement) {
      taskGroupElement.parentNode.removeChild(taskGroupElement)
    }
    else {
      throw new Error(`${taskGroupId} not found`)
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
      throw new Error(`${project.id} not found`)
    }
  }

  appendTask(taskGroup: TaskGroup, task: Task) {
    const taskElement = this.createTaskElement(task)
    const taskGroupElement = document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      taskGroupElement.children[1].appendChild(taskElement)
    }
    else {
      throw new Error(`${taskGroup.id} not found`)
    }
  }

  removeTask(taskId: TaskId) {
    const taskElement = document.getElementById(taskId)
    if (taskElement) {
      taskElement.parentNode.removeChild(taskElement)
    }
    else {
      throw new Error(`${taskId} not found`)
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
      throw new Error(`${taskGroup.id} not found`)
    }
  }

  findElementIndex(element): number {
    const children = element.parentElement.children
    for (let i = 0; i < children.length; i++) {
      if (children[i].getAttribute('id') == element.getAttribute('id')) {
        return i
      }
    }
    return -1
  }

  moveTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId, afterTaskGroupId: TaskGroupId | undefined) {
    const projectElement = document.getElementById(projectId)
    if (projectElement) {
      const taskGroupElement = document.getElementById(taskGroupId)
      if (taskGroupElement) {
        const parentElement = taskGroupElement.parentElement
        if (afterTaskGroupId) {
          const afterTaskGroupElement = document.getElementById(afterTaskGroupId)
          const index = this.findElementIndex(afterTaskGroupElement)
          if (index != -1) {
            if (index == afterTaskGroupElement.parentElement.children.length - 1) {
              // append at end
              parentElement.removeChild(taskGroupElement)
              parentElement.appendChild(taskGroupElement)
            }
            else {
              parentElement.removeChild(taskGroupElement)
              parentElement.insertBefore(taskGroupElement, parentElement.children[index + 1])
            }
          }
          else {
            throw new Error(`after task group element ${afterTaskGroupId} not found`)
          }
        }
        else {
          // append at end
          parentElement.removeChild(taskGroupElement)
          parentElement.appendChild(taskGroupElement)
        }
      }
      else {
        throw new Error(`task group element ${afterTaskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }

  moveTask(projectId: ProjectId, taskId: TaskId, toTaskGroupId: TaskGroupId, afterTaskId: TaskId | undefined) {
    const projectElement = document.getElementById(projectId)
    if (projectElement) {
      const toTaskGroupElement = document.getElementById(toTaskGroupId)
      if (toTaskGroupElement) {
        const taskElement = document.getElementById(taskId)
        if (taskElement) {
          const fromTaskGroupElement = taskElement.parentElement
          const fromParentElement = fromTaskGroupElement.children[1]
          const toParentElement = toTaskGroupElement.children[1]
          if (afterTaskId) {
            const afterTaskElement = document.getElementById(afterTaskId)
            if (afterTaskElement) {
              const index = this.findElementIndex(afterTaskElement)
              if (index != -1) {
                if (index == afterTaskElement.parentElement.children.length - 1) {
                  // append at end
                  fromParentElement.removeChild(taskElement)
                  toParentElement.appendChild(taskElement)
                }
                else {
                  fromParentElement.removeChild(taskElement)
                  toParentElement.insertBefore(taskElement, toParentElement.children[index + 1])
                }
              }
              else {
                throw new Error(`after task element index ${afterTaskId} not found`)
              }
            }
            else {
              throw new Error(`after task element ${afterTaskId} not found`)
            }
          }
          else {
            // append at end
            fromParentElement.removeChild(taskElement)
            toParentElement.appendChild(taskElement)
          }
        }
      }
      else {
        throw new Error(`to task group element ${toTaskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }
}