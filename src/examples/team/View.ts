import { UserId } from '../../TableFlowMessages'
import { Project, TaskGroup, Task, Member, CheckListItem, ChatMessage, Model } from './Model'
import { ProjectId, TaskGroupId, TaskId, Title, ItemId, ItemStatus, Description } from './Core'
import Quill from 'quill'

// TODO: disable delete remove task group when non-empty task list

import Sortable from 'sortablejs'
import { eventNames } from 'cluster';

/*
<div id='app'>
    <div class="Project" id="ProjectId">
        <div class="ProjectChat">
          <MessageList>
            <div class="ChatMessage" id="MessageId">
              <div class=PosterId></div>
              <div class=Message></div>
              <div class=ReplyToId></div>
              <div class=PostTime></div>
            </div>
          </MessageList>
          <div class="MessageInput">
            <input></input>
            <button></button>
          </div>
        </div>
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
                      <div class="CheckList">
                        <div class="CheckListHead">
                        </div>
                        <div class="ItemList">
                          <div class="Item">
                            <div class="ItemHead">
                            </div>
                            <div class="ItemStatus">
                            </div>
                            <div class="ItemDescription">
                            </div>
                            <div>
                              <button>(-)</button>
                            </div>
                          </div>
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
  private updateTaskDescriptionCallback

  private addTaskOwnerCallback
  private removeTaskOwnerCallback

  private addCheckListItemCallback
  private removeCheckListItemCallback
  private updateCheckListItemStatusCallback
  private updateCheckListItemDescriptionCallback

  private sendProjectChatCallback
  private sendTaskChatCallback

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

  setUpdateTaskDescriptionCallback(callback) {
    this.updateTaskDescriptionCallback = callback
  }

  setAddTaskOwnerCallback(callback) {
    this.addTaskOwnerCallback = callback
  }

  setRemoveTaskOwnerCallback(callback) {
    this.removeTaskOwnerCallback = callback
  }

  setAddCheckListItemCallback(callback) {
    this.addCheckListItemCallback = callback
  }

  setRemoveCheckListItemCallback(callback) {
    this.removeCheckListItemCallback = callback
  }

  setUpdateCheckListItemStatusCallback(callback) {
    this.updateCheckListItemStatusCallback = callback
  }

  setUpdateCheckListItemDescriptionCallback(callback) {
    this.updateCheckListItemDescriptionCallback = callback
  }

  setSendProjectChatCallback(callback) {
    this.sendProjectChatCallback = callback
  }

  setSendTaskChatCallback(callback) {
    this.sendTaskChatCallback = callback
  }

  private createTaskElement(task: Task) {
    const taskElement = this.document.createElement('div')
    taskElement.setAttribute('class', 'Task')
    taskElement.setAttribute('id', task.id)

    var options = { month: 'short', day: 'numeric'};
    const dueDate = new Date(task.dueDate)
    const formattedDueDate = dueDate.toLocaleDateString(undefined, options)
    const html = `
        <div class="Header">
          <div class="ShowDetails">
            <input type="image" class="Button" src="../../../images/expand.svg"></input>
          </div>
          <div class="Title"Message>
            <input class="Input" value=${task.title}>
            </input>
          </div>
          <div class="OwnerList">
          </div>
          <div class="Overview">
            <div class="DueDate">
            ${formattedDueDate}
            </div>
            <div class="Progress">
            1/5
            </div>
            <div class="Remove">
              <input type="image" class="RemoveButton" src="../../../images/remove.svg"></input>
            </div>
          </div>
        </div>
        <div class="Body">
          <div class="Close">
            <input type="image" class="CloseButton" src="../../../images/close.svg"></input>
          </div>
          <div class="Tab">
            <input type="image" src="../../../images/description.svg" class="OpenDescription"></input>
            <input type="image" src="../../../images/todo.svg" class="OpenTodo"></input>
            <input type="image" src="../../../images/messages.svg" class="OpenTaskChat"></input>
          </div>
          <div class="Description">
            <div class="DescEditor">
            </div>
          </div>
          <div class="Todo">
            <div class="CheckList">
              <div class="CheckListHeader">
              </div>
              <div class="ItemList">
              </div>
            </div>
            <div class="AppendItem">
              <input type="image" src="../../../images/add.svg" class="AppendItemButton"></input>
            </div>
          </div>
        </div>
    `

    taskElement.innerHTML = html

    const chatClassName = 'TaskChat'
    const callback = (inputElement) => {
      return () => {
        const message = inputElement.querySelector('.ql-editor').innerHTML
        this.sendTaskChatCallback(task.id, message, '')
        inputElement.value = ''
      }
    }
    const chatElement = this.createChatElement(chatClassName, callback)

    taskElement.querySelector('.Body').appendChild(chatElement)

    const body = taskElement.querySelector('.Body')

    const showDetails = taskElement.querySelector('.ShowDetails .Button')
    showDetails.addEventListener('click', () => {
      if (body.style.display !== 'flex') {
        body.style.display = "flex"
      }
    })

    const description = taskElement.querySelector('.Description')
    const descElement = taskElement.querySelector('.DescEditor')
    const descOptions = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      theme: 'snow',
    };

    const quill = new Quill(descElement, descOptions)

    const toolbar = taskElement.querySelector('.ql-toolbar')
    const editor = taskElement.querySelector('.DescEditor .ql-editor')
    editor.innerHTML = task.description

    const todo = taskElement.querySelector('.Todo')
    const chat = taskElement.querySelector('.TaskChat')

    const hideDetails = taskElement.querySelector('.CloseButton')
    hideDetails.addEventListener('click', () => {
      if (body.style.display !== 'none') {
        body.style.display = "none"
        this.updateTaskDescriptionCallback(task.id, editor.innerHTML)
      }
    })

    // editor.onblur = () => {
    //   console.log(`editor lost focus`)
    //   if (this.document.activeElement !== toolbar) {
    //     toolbar.style.display = 'none'
    //     this.updateTaskDescriptionCallback(task.id, editor.innerHTML)
    //   }
    // }

    // editor.onfocus = () => {
    //   console.log(`editor get focus`)
    //   toolbar.style.display = 'block'
    // }

    const openDescription = taskElement.querySelector('.OpenDescription')
    openDescription.addEventListener('click', () => {
      todo.style.display = 'none'
      chat.style.display = 'none'
      description.style.display = 'flex'
    })

    const openTodo = taskElement.querySelector('.OpenTodo')
    openTodo.addEventListener('click', () => {
      todo.style.display = 'flex'
      chat.style.display = 'none'
      description.style.display = 'none'
    })

    const openChat = taskElement.querySelector('.OpenTaskChat')
    openChat.addEventListener('click', () => {
      todo.style.display = 'none'
      chat.style.display = 'flex'
      description.style.display = 'none'
      const messageList = body.querySelector('.MessageList')
      messageList.scrollTop = messageList.scrollHeight
    })

    const title = taskElement.querySelector('.Title .Input')
    title.onblur = () => {
      console.log(`update task title ${task.id}`)
      this.updateTaskTitleCallback(task.id, title.value)
    }

    const ownerList = taskElement.querySelector('.OwnerList')

    ownerList.ondrop = (event) => {
      event.preventDefault()
      if (event.dataTransfer) {
        const memberId = event.dataTransfer.getData('memberId')
        console.log(`add owner ${memberId}`)
        if (memberId) {
          const members = ownerList.children
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

    ownerList.ondragover = (event) => {
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

    const appendCheckList = taskElement.querySelector('.Todo .AppendItem')
    appendCheckList.addEventListener('click', () => {
      const status = ItemStatus.Open
      const description = 'new item'
      this.addCheckListItemCallback(task.id, description, status)
    })

    const removeTaskButton = taskElement.querySelector('.RemoveButton')
    removeTaskButton.addEventListener('click', () => {
      this.removeTaskCallback(task.id)
    })


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

  private createChatElement(className: string, callback) {
    const chatElement = this.document.createElement('div')
    chatElement.className = className
    chatElement.classList.add('animated', 'fadeIn')

    const html = `
      <div class="MessageList">
      </div>
      <div class="Input">
        <div class="Message">
        </div>
        <div class="Send">
          <button class="SendButton">send</button>
        </div>
      </div>
    `
    chatElement.innerHTML = html

    const sendButton = chatElement.querySelector('.SendButton')
    const messageElement = chatElement.querySelector('.Message')

    var options = {
      debug: 'info',
      placeholder: 'Compose an epic...',
      theme: 'bubble',
      bounds: messageElement,
    };

    console.log(chatElement)

    const quill = new Quill(messageElement, options)
    sendButton.addEventListener('click', callback(messageElement))

    return chatElement
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

    // Project Chat
    const chatElementClass = 'ProjectChat'
    const chatCallback = (inputElement) => {
      return () => {
        const message = inputElement.querySelector('.ql-editor').innerHTML
        this.sendProjectChatCallback(project.id, message, '')
      } 
    }
    const chatElement = this.createChatElement(chatElementClass, chatCallback)

    projectElement.appendChild(projectHeadElement)
    projectElement.appendChild(taskGroupListElement)
    projectElement.appendChild(chatElement)

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
        const titleElement = taskElement.querySelector('.Title .Input')
        if (titleElement) {
          titleElement.value = title
        }
        else {
          throw new Error(`task element ${taskId} title not found`)
        }
      }
      else {
        throw new Error(`task element ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project element ${projectId} not found`)
    }
  }

  updateTaskDescription(projectId: ProjectId, taskId: TaskId, description: Description) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const taskElement = this.document.getElementById(taskId)
      if (taskElement) {
        const editor = taskElement.querySelector('.Description .DescEditor .ql-editor')
        if (editor) {
          editor.innerHTML = description
        }
        else {
          throw new Error(`editor for task ${taskId} not found`)
        }
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
      const ownerElement = this.document.createElement('div')
      ownerElement.setAttribute('id', member.id)
      ownerElement.setAttribute('class', 'Owner')

      const html = `
          <img class="Image" src=${image}></img>
      `

      ownerElement.innerHTML = html

      const owner = ownerElement.querySelector('.Image')

      owner.addEventListener('click', () => {
        this.removeTaskOwnerCallback(taskId, member.id)
      })

      taskElement.querySelector('.OwnerList').appendChild(ownerElement)
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  removeTaskOwner(taskId: TaskId, memberId: UserId) {
    const taskElement = this.document.getElementById(taskId)

    const ownerList = taskElement.querySelector('.OwnerList').children
    for (let i = 0; i < ownerList.length; i++) {
      if (ownerList[i].getAttribute('id') === memberId) {
        ownerList[i].parentElement.removeChild(ownerList[i])
        return
      }
    }
    throw new Error(`owner ${memberId} not found`)
  }

  setUserImage(image: string) {
    const imageElement = this.document.getElementById('UserImage')
    if (imageElement) {
      imageElement.src = image
    }
    else {
      throw new Error(`Login Image not found`)
    }
  }

  appendCheckListItem(projectId: ProjectId, taskId: TaskId, item: CheckListItem) {
    const project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const checkList = task.querySelector('.CheckList')
        
        const itemElement = this.document.createElement('div')
        itemElement.setAttribute('class', 'Item')
        itemElement.setAttribute('id', item.id)

        const html = `
          <div class="ItemHeader">
          </div>
          <div class="ItemStatus">
            <input class="StatusCheck" type="checkbox"></input>
          </div>
          <div class="ItemDescription">
            <input class="DescriptionInput" value="${item.description}"</input>
          </div>
          <div class="RemoveItem">
            <input type="image" src="../../../images/close.svg" class="RemoveItemButton"></input>
          </div>
        `
        itemElement.innerHTML = html

        const status = itemElement.querySelector('.StatusCheck')
        status.checked = item.status === ItemStatus.Closed ? true : false
        status.addEventListener('change', () => {
          const newStatus = (status.checked) ? ItemStatus.Closed : ItemStatus.Open
          this.updateCheckListItemStatusCallback(item.id, newStatus)
        })

        const descInput = itemElement.querySelector('.DescriptionInput')
        descInput.onblur = () => {
          this.updateCheckListItemDescriptionCallback(item.id, descInput.value)
        }

        const removeButton = itemElement.querySelector('.RemoveItemButton')
        removeButton.addEventListener('click', () => {
          this.removeCheckListItemCallback(item.id)
        })

        checkList.querySelector('.ItemList').appendChild(itemElement)
      }
      else {
        throw new Error(`task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  removeCheckListItem(projectId: ProjectId, taskId: TaskId, itemId: ItemId) {
    const project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const item = this.document.getElementById(itemId)
        if (item) {
          item.parentNode.removeChild(item)
        }
        else {
          throw new Error(`item ${itemId} not found`)
        }
      }
      else {
        throw new Error(`task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  updateCheckListItemStatus(itemId: ItemId, status: ItemStatus) {
    const item = this.document.getElementById(itemId)
    if (item) {
      item.children[1].children[0].checked = status === ItemStatus.Open ? false : true
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }
  }

  updateCheckListItemDescription(itemId: ItemId, description: Description) {
    const item = this.document.getElementById(itemId)
    if (item) {
      item.children[2].children[0].value = description
    }
    else {
      throw new Error(`item ${itemId} not found`)
    }
  }

  private appendChatMessage(userId: UserId, messageList, message: ChatMessage, model: Model) {
    const messageElement = this.document.createElement('div')
    messageElement.setAttribute('id', message.id)
    const [className, direction] = (userId === message.posterId) ? ['MyChatMessage', 'fadeIn'] : ['ChatMessage', 'fadeIn']
    messageElement.classList.add(className)

    let image = ""
    const member = model.getMember(message.posterId)
    if (member) {
      const asset = model.getAsset(member.avatar)
      if (asset) {
        image = asset.content
      }
    }

    const postTime = new Date(message.postTime)
    var options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    const formatedTime = postTime.toLocaleDateString(undefined, options)
    const html = `
              <div class="Poster">
                <img class="PosterImage" src=${image}></img>
              </div>
              <div class="Container">
                <div class="Header">
                  <div class="PosterName">
                    ${message.posterId}
                  </div>
                  <div class="PostTime">
                    ${formatedTime}
                  </div>
                </div>
                <div class="MessageBody animated ${direction}">
                  <div class="Message">${message.message}</div>
                </div>
              </div>
    `
    messageElement.innerHTML = html

    messageList.appendChild(messageElement)
    messageList.scrollTop = messageList.scrollHeight
  }

  appendProjectChatMessage(userId: UserId, projectId: ProjectId, message: ChatMessage, model: Model) {
    let project = this.document.getElementById(projectId)
    if (project) {
      const chat = project.querySelector('.ProjectChat')
      if (chat) {
        const messageList = chat.querySelector('.MessageList')
        if (messageList) {
          this.appendChatMessage(userId, messageList, message, model)
        }
        else {
          throw new Error(`project ${projectId} chat message list not found`)
        }
      }
      else {
        throw new Error(`project ${projectId} chat not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  appendTaskChatMessage(userId: UserId, projectId: ProjectId, taskId: TaskId, message: ChatMessage, model: Model) {
    let project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const chat = task.querySelector('.TaskChat')
        if (chat) {
          const messageList = chat.querySelector('.MessageList')
          if (messageList) {
            this.appendChatMessage(userId, messageList, message, model)
          }
          else {
            throw new Error(`project ${projectId} chat message list not found`)
          }
        }
      }
      else {
        throw new Error(`project ${projectId} chat not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }
}

