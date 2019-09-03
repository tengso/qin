import { UserId } from '../../TableFlowMessages'
import { Project, TaskGroup, Task, Member } from './Model'
import { ProjectId, TaskGroupId, TaskId, Title } from './Core'

// TODO: disable delete remove task group when non-empty task list

import Sortable from 'sortablejs'
import { eventNames } from 'cluster';

/*
<div id='app'>
    <div class="Project" id="ProjectId">
        <div class="ProjectHead">
            <div class="Title"></div>
            <div class="Description"></div>
            <div class="DueDate"></div>
            <div class="MemberList">
              <div class="Member" id="MemberId">
                <img Class="ProjectMemberImage" src=/>
              </div>
              <div class="Member" id="MemberId">
                <img Class="ProjectMemberImage" src=/>
              </div>
            </div>
            <div class="AddTaskGroup">
              <button></button>
            </div>
            </div>
        </div>
        <div class="TaskGroupList">
            <div class="TaskGroup" id="TaskGroupId">
                <div class="TaskGroupHead">
                    <div class="RemoveTaskGroup">
                        <button></button>
                    </div>
                    <div class="Title">
                      <input class="TaskGroupTitleInput"><input>
                    </div>
                    <div class="Description"></div>
                    <div class="AddTask">
                        <button></button>
                    </div>
                </div>
                <div class="TaskList>
                    <div class="Task" id="TaskId">
                      <div class="Title">
                        <input class="TaskTitleInput"></input>
                      </div>
                      <div class="Description"></div>
                      <div class="DueDate"></div>
                      <div class="TaskOwnerList">
                        <div id="MemberId" class="TaskOwner">
                          <img class="TaskOwnerImage" src=''></img>
                          <button''>(-)</button>
                        </div>
                      </div>
                      <div class="RemoveTask">
                        <button></button>
                      </div>
                      </div>
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

  private afterSortingCallback: (event) => void

  private addTaskCallback
  private addTaskGroupCallback

  private removeTaskCallback
  private removeTaskGroupCallback

  private updateTaskGroupTitleCallback
  private updateTaskTitleCallback

  private addTaskOwnerCallback
  private removeTaskOwnerCallback

  private document

  constructor(document) {
    this.document = document
  }

  setSortingCallback(callback) {
    this.afterSortingCallback = callback
  }

  setAddTaskCallback(callback) {
    this.addTaskCallback = callback
  }

  setAddTaskGroupCallback(callback) {
    this.addTaskGroupCallback = callback
  }

  setRemoveTaskCallback(callback) {
    this.removeTaskCallback = callback
  }

  setRemoveTaskGroupCallback(callback) {
    this.removeTaskGroupCallback = callback
  }

  setUpdateTaskGroupTitleCallback(callback) {
    this.updateTaskGroupTitleCallback = callback
  }

  setUpdateTaskTitleCallback(callback) {
    this.updateTaskTitleCallback = callback
  }

  setAddTaskOwnerCallback(callback) {
    this.addTaskOwnerCallback = callback
  }

  setRemoveTaskOwnerCallback(callback) {
    this.removeTaskOwnerCallback = callback
  }

  private createTaskElement(task: Task) {
    const taskElement = this.document.createElement('div')
    taskElement.setAttribute('class', 'Task')
    taskElement.setAttribute('id', task.id)

    const titleElement = this.document.createElement('div')
    titleElement.setAttribute('class', 'Title')
    const titleInput = this.document.createElement('input')
    titleInput.setAttribute('class', 'TaskTitleInput')
    titleInput.value = task.title
    titleInput.onblur = () => {
      console.log(`update task title ${task.id}`)
      this.updateTaskTitleCallback(task.id, titleInput.value)
    }
    titleElement.appendChild(titleInput)

    const descElement = this.document.createElement('div')
    descElement.setAttribute('class', 'Description')
    // descElement.innerHTML = task.description

    const dueDateElement = this.document.createElement('div')
    dueDateElement.setAttribute('class', 'DueDate')
    // dueDateElement.innerHTML = task.dueDate

    const ownerListElement = this.document.createElement('div')
    ownerListElement.setAttribute('class', 'TaskOwnerList')
    ownerListElement.ondrop = (event) => {
      event.preventDefault()
      if (event.dataTransfer) {
        const memberId = event.dataTransfer.getData('memberId')
        console.log(`add owner ${memberId}`)
        if (memberId) {
          const members = ownerListElement.children
          for (let i = 0; i < members.length; i++) {
            const existingMemberId = members[i].getAttribute('id')
            console.log(`existing member ${memberId}`)
            if (existingMemberId === memberId) {
              console.log(`member ${memberId} exists`)
              return
            }
          }
          this.addTaskOwnerCallback(task.id, memberId)
        }
        else {
          throw new Error(`unknown member id ${memberId}`)
        }
      }
      else {
        throw new Error(`dataTransfer not found on event`)
      }
      console.log('dropped')
    }

    ownerListElement.ondragover = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'

      // to disable "copy" icon if member already exists, BUT
      // // FIXME: dataTransfer object doesn't seem to have the transmitted memberId
      // if (event.dataTransfer) {
      //   const memberId = event.dataTransfer.getData('memberId')
      //   console.log(`drag member ${memberId}`)
      //   if (memberId) {
      //     const members = ownerListElement.children
      //     for (let i = 0; i < members.length; i++) {
      //       const existingMemberId = members[i].getAttribute('id')
      //       console.log(`existing member ${memberId}`)
      //       if (existingMemberId === memberId) {
      //         return
      //       }
      //     }
      //     event.dataTransfer.dropEffect = 'copy'
      //   }
      // }
    }

    const removeTaskElement = this.document.createElement('div')
    removeTaskElement.setAttribute('class', 'RemoveTask')
    const removeTaskButton = this.document.createElement('button')
    removeTaskButton.innerHTML = '(-)'
    removeTaskButton.addEventListener('click', () => {
      this.removeTaskCallback(task.id)
    })
    removeTaskElement.appendChild(removeTaskButton)

    taskElement.appendChild(titleElement)
    taskElement.appendChild(descElement)
    taskElement.appendChild(dueDateElement)
    taskElement.appendChild(ownerListElement)
    taskElement.appendChild(removeTaskElement)
    
    return taskElement
  }

  private createTaskGroupElement(project: Project, taskGroup: TaskGroup) {
    const taskGroupElement = this.document.createElement('div')
    taskGroupElement.setAttribute('id', taskGroup.id)
    taskGroupElement.setAttribute('class', 'TaskGroup')

    const taskGroupHeadElement = this.document.createElement('div')
    taskGroupHeadElement.setAttribute('class', 'TaskGroupHead')

    const removeTaskGroupElement = this.document.createElement('div')
    removeTaskGroupElement.setAttribute('class', 'RemoveTaskGroup')
    const removeTaskGroupButton = this.document.createElement('button')
    removeTaskGroupButton.innerHTML = '(-)'
    removeTaskGroupButton.addEventListener('click', () => {
      this.removeTaskGroupCallback(taskGroup.id)
    })
    removeTaskGroupElement.appendChild(removeTaskGroupButton)

    const titleElement = this.document.createElement('div')
    titleElement.setAttribute('class', 'Title')
    const titleInput = this.document.createElement('input')
    titleInput.setAttribute('class', 'TaskGroupTitleInput')
    titleInput.value = taskGroup.title
    titleElement.appendChild(titleInput)
    titleInput.onblur = () => {
      console.log(`update task group title ${taskGroup.id}`)
      this.updateTaskGroupTitleCallback(taskGroup.id, titleInput.value)
    }

    const descElement = this.document.createElement('div')
    descElement.setAttribute('class', 'Description')
    descElement.innerHTML = taskGroup.description

    const addTaskElement = this.document.createElement('div')
    addTaskElement.setAttribute('class', 'AddTask')
    const addTaskButton = this.document.createElement('button')
    addTaskButton.innerHTML = '(+)'
    addTaskButton.addEventListener('click', () => {
      this.addTaskCallback(taskGroup.id)
    })
    addTaskElement.appendChild(addTaskButton)

    taskGroupHeadElement.appendChild(removeTaskGroupElement)
    taskGroupHeadElement.appendChild(titleElement)
    taskGroupHeadElement.appendChild(descElement)
    taskGroupHeadElement.appendChild(addTaskElement)

    const taskGroupListElement = this.document.createElement('div')
    taskGroupListElement.setAttribute('class', 'TaskList')
    taskGroupListElement.setAttribute('id', `${taskGroup.id}-task-list`)

    new Sortable(taskGroupListElement, {
      group: project.id,
      animation: 150,
      onEnd: this.afterSortingCallback
    })

    taskGroupElement.appendChild(taskGroupHeadElement)
    taskGroupElement.appendChild(taskGroupListElement)

    return taskGroupElement
  }

  private createProjectElement(project: Project) {
    const projectElement = this.document.createElement('div')
    projectElement.setAttribute('class', 'Project')
    projectElement.setAttribute('id', project.id)

    const projectHeadElement = this.document.createElement('div')
    projectHeadElement.setAttribute('class', 'ProjectHead')

    const titleElement = this.document.createElement('div')
    titleElement.setAttribute('class', 'Title')
    titleElement.innerHTML = project.title

    const descElement = this.document.createElement('div')
    descElement.setAttribute('class', 'Description')
    descElement.innerHTML = project.description

    const dueDateElement = this.document.createElement('div')
    dueDateElement.setAttribute('class', 'DueDate')
    dueDateElement.innerHTML = project.dueDate

    const memberListElement = this.document.createElement('div')
    memberListElement.setAttribute('class', 'MemberList')

    const addTaskGroupElement = this.document.createElement('div')
    addTaskGroupElement.setAttribute('class', 'AddTaskGroup')
    const addTaskGroupButton = this.document.createElement('button')
    addTaskGroupButton.innerHTML = '(+)'
    addTaskGroupButton.addEventListener('click', () => {
      this.addTaskGroupCallback(project.id)
    })
    addTaskGroupElement.appendChild(addTaskGroupButton)

    projectHeadElement.appendChild(titleElement)
    projectHeadElement.appendChild(descElement)
    projectHeadElement.appendChild(dueDateElement)
    projectHeadElement.appendChild(memberListElement)
    projectHeadElement.appendChild(addTaskGroupElement)

    const taskGroupListElement = this.document.createElement('div')
    taskGroupListElement.setAttribute('class', 'TaskGroupList')
    taskGroupListElement.setAttribute('id', `${project.id}-task-group-list`)

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
    const appElement = this.document.getElementById('app')
    const projectElement = this.createProjectElement(project)
    appElement.appendChild(projectElement)
  }

  appendTaskGroup(project: Project, taskGroup: TaskGroup) {
    const projectElement = this.document.getElementById(project.id)
    if (projectElement) {
      const taskGroupElement = this.createTaskGroupElement(project, taskGroup)
      projectElement.children[1].appendChild(taskGroupElement)
    }
    else {
      throw new Error(`${project.id} not found`)
    }
  }

  removeTaskGroup(taskGroupId: TaskGroupId) {
    const taskGroupElement = this.document.getElementById(taskGroupId)
    if (taskGroupElement) {
      taskGroupElement.parentNode.removeChild(taskGroupElement)
    }
    else {
      throw new Error(`${taskGroupId} not found`)
    }
  }

  insertTaskGroup(project: Project, taskGroup: TaskGroup, index: number) {
    const projectElement = this.document.getElementById(project.id)
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
    const taskGroupElement = this.document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      taskGroupElement.children[1].appendChild(taskElement)
    }
    else {
      throw new Error(`${taskGroup.id} not found`)
    }
  }

  removeTask(taskId: TaskId) {
    const taskElement = this.document.getElementById(taskId)
    if (taskElement) {
      taskElement.parentNode.removeChild(taskElement)
    }
    else {
      throw new Error(`${taskId} not found`)
    }
  }

  insertTask(taskGroup: TaskGroup, task: Task, index: number) {
    const taskGroupElement = this.document.getElementById(taskGroup.id)
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

  updateTaskGroupTitle(projectId: ProjectId, taskGroupId: TaskGroupId, title: Title) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const taskGroupElement = this.document.getElementById(taskGroupId)
      if (taskGroupElement) {
        taskGroupElement.children[0].children[1].children[0].value = title
      }
      else {
        throw new Error(`task group element ${taskGroupId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }

  updateTaskTitle(projectId: ProjectId, taskId: TaskId, title: Title) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const taskElement = this.document.getElementById(taskId)
      if (taskElement) {
        taskElement.children[0].children[0].value = title
      }
      else {
        throw new Error(`task element ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }

  private findElementIndex(element): number {
    const children = element.parentElement.children
    for (let i = 0; i < children.length; i++) {
      if (children[i].getAttribute('id') == element.getAttribute('id')) {
        return i
      }
    }
    return -1
  }

  moveTaskGroup(projectId: ProjectId, taskGroupId: TaskGroupId, afterTaskGroupId: TaskGroupId | undefined) {
    if (taskGroupId == afterTaskGroupId) {
      throw new Error(`invalid move from task group ${taskGroupId} is after task group ${afterTaskGroupId}`)
    }

    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const taskGroupElement = this.document.getElementById(taskGroupId)
      if (taskGroupElement) {
        const taskGroupElementIndex = this.findElementIndex(taskGroupElement)
        if (taskGroupElementIndex == -1) {
          throw new Error(`{taskGroupId} element index not found`)
        }
        const parentElement = taskGroupElement.parentElement
        if (afterTaskGroupId) {
          const afterTaskGroupElement = this.document.getElementById(afterTaskGroupId)
          const index = this.findElementIndex(afterTaskGroupElement)
          if (index != -1) {
            // TODO: add unit test
            if (taskGroupElementIndex == index + 1) {
              // already in right order, no need to move
              return
            }
            if (index == afterTaskGroupElement.parentElement.children.length - 1) {
              // append at end
              parentElement.removeChild(taskGroupElement)
              parentElement.appendChild(taskGroupElement)
            }
            else {
              const refElement = parentElement.children[index + 1]
              parentElement.removeChild(taskGroupElement)
              parentElement.insertBefore(taskGroupElement, refElement)
            }
          }
          else {
            throw new Error(`after task group element ${afterTaskGroupId} not found`)
          }
        }
        else {
          if (taskGroupElementIndex == 0) {
            // already in order, no need to move
            return
          }
          else {
            if (parentElement.children.length > 0) {
              const refElement = parentElement.children[0]
              parentElement.removeChild(taskGroupElement)
              parentElement.insertBefore(taskGroupElement, refElement)
            }
          }
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
    if (taskId == afterTaskId) {
      throw new Error(`invalid move from task ${taskId} is after task ${afterTaskId}`)
    }

    console.log(`move task ${taskId} to task group ${toTaskGroupId} after task id ${afterTaskId}`)

    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const toTaskGroupElement = toTaskGroupId ? this.document.getElementById(toTaskGroupId) : undefined
      if ((toTaskGroupId && toTaskGroupElement) || !toTaskGroupId) {
        const taskElement = this.document.getElementById(taskId)
        if (taskElement) {
          const fromParentElement = taskElement.parentElement
          const toParentElement = toTaskGroupId ? toTaskGroupElement.children[1] : fromParentElement
          if (afterTaskId) {
            const afterTaskElement = this.document.getElementById(afterTaskId)
            if (afterTaskElement) {
              const index = this.findElementIndex(afterTaskElement)
              if (index != -1) {
                if (index == toParentElement.children.length - 1) {
                  // TODO: add unit test
                  // test if it's already sorted 
                  if (toParentElement.children[toParentElement.children.length - 1] != taskElement) {
                    // append at end
                    fromParentElement.removeChild(taskElement)
                    toParentElement.appendChild(taskElement)
                  }
                }
                else {
                  if (fromParentElement != toParentElement) {
                    // test if it's already sorted
                    if (taskElement != toTaskGroupElement.children[index + 1]) {
                      fromParentElement.removeChild(taskElement)
                      toParentElement.insertBefore(taskElement, toParentElement.children[index + 1])
                    }
                  }
                  else {
                    // TODO: add unit test
                    if (taskElement != toParentElement.children[index + 1]) {
                      const refElement = toParentElement.children[index + 1]
                      fromParentElement.removeChild(taskElement)
                      toParentElement.insertBefore(taskElement, refElement)
                    }
                  }
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
            if (toParentElement.children.length == 0) {
              fromParentElement.removeChild(taskElement)
              toParentElement.appendChild(taskElement)
            }
            else {
              // TODO: add unit test
              if (toParentElement.children[0] != taskElement) {
                const refElement = toParentElement.children[0]
                fromParentElement.removeChild(taskElement)
                toParentElement.insertBefore(taskElement, refElement)
              }
            }
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

  /** 
    <div class="Project" id="ProjectId">
        <div class="ProjectHead">
            <div class="Title"></div>
            <div class="Description"></div>
            <div class="DueDate"></div>
            <div class="MemberList">
              <div class="Member" id="MemberId">
                <img Class="ProjectMemberImage" src=/>
              </div>
              <div class="Member" id="MemberId">
                <img Class="ProjectMemberImage" src=/>
              </div>
            </div>
  */
  appendProjectMember(projectId: ProjectId, member: Member, image: string): void {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      // TODO: remove hard-coded index
      const memberList = projectElement.children[0].children[3]

      const memberElement = this.document.createElement('div')
      memberElement.setAttribute('id', member.id)
      memberElement.setAttribute('class', 'Member')

      const memberImageElement = this.document.createElement('img')
      memberImageElement.setAttribute('class', 'ProjectMemberImage')
      memberImageElement.setAttribute('src', image)
      memberImageElement.setAttribute('draggable', 'true')
      memberImageElement.ondragstart = (event) => {
        console.log('drag start')
        event.dataTransfer.setData("memberId", member.id)
        event.dataTransfer.dropEffect = 'copy'
      }

      memberElement.appendChild(memberImageElement)

      memberList.appendChild(memberElement)
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  removeProjectMember(projectId: ProjectId, memberId: UserId): void {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const memberElement = this.document.getElementById(memberId)
      if (memberElement) {
        memberElement.parentElement.removeChild(memberElement)
      }
      else {
        throw new Error(`member ${memberId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  appendTaskOwner(taskId: TaskId, member: Member, image: string) {
    const taskElement = this.document.getElementById(taskId)
    if (taskElement) {
      // FIXME: remove hard coded index
      const ownerElement = this.document.createElement('div')
      ownerElement.setAttribute('id', member.id)
      ownerElement.setAttribute('class', 'TaskOwner')

      const ownerImageElement = this.document.createElement('img')
      ownerImageElement.setAttribute('class', 'TaskOwnerImage')
      ownerImageElement.setAttribute('src', image)

      const removeOwnerButton = this.document.createElement('button')
      removeOwnerButton.innerHTML = '(-)'
      removeOwnerButton.addEventListener('click', () => {
        console.log(`remove owner ${member.id} from ${taskId}`)
        this.removeTaskOwnerCallback(taskId, member.id)
      })

      ownerElement.appendChild(ownerImageElement)
      ownerElement.appendChild(removeOwnerButton)

      taskElement.children[3].appendChild(ownerElement)
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  removeTaskOwner(taskId: TaskId, memberId: UserId) {
    const taskElement = this.document.getElementById(taskId)
    // FIXME: remove hard-coded index
    const ownerList = taskElement.children[3].children
    for (let i = 0; i < ownerList.length; i++) {
      if (ownerList[i].getAttribute('id') === memberId) {
        ownerList[i].parentElement.removeChild(ownerList[i])
        return
      }
    }
    throw new Error(`owner ${memberId} not found`)
  }
}

