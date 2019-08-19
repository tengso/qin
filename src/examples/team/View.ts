import Sortable from 'sortablejs'
import {onSortingEnd} from './Control'
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
export class KanbanView {

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

  // getProjectIdByTaskGroupId(taskGroupId: TaskGroupId): ProjectId {
  //   const taskGroupElement = document.getElementById(taskGroupId)
  //   if (taskGroupElement) {
  //     return taskGroupElement.parentElement.parentElement.getAttribute('id')
  //   }
  //   else {
  //     throw new Error(`task group element ${taskGroupId} not found`)
  //   }
  // }

  // getProjectIdByTaskId(taskId: TaskId): ProjectId {
  //   const taskElement = document.getElementById(taskId)
  //   if (taskElement) {
  //     return taskElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')
  //   }
  //   else {
  //     throw new Error(`task element ${taskId} not found`)
  //   }
  // }

  moveTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId, afterTaskGroupId: TaskGroupId) {

  }

  moveTask(projectId: ProjectId, taskId: TaskId, taskGroupId: TaskGroupId | undefined, afterTaskId: TaskId) {

  }
}