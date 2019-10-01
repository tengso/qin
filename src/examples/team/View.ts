import { UserId } from '../../TableFlowMessages'
import { Project, TaskGroup, Task, Member, CheckListItem, ChatMessage, Model, Asset } from './Model'
import { ProjectId, TaskGroupId, TaskId, Title, ItemId, ItemStatus, Description, AttachmentId, AssetId } from './Core'
import Quill from 'quill'
import flatpickr from 'flatpickr'

// TODO: disable delete remove task group when non-empty task list

import Sortable from 'sortablejs'


export class View {

  private afterSortingCallback: (event) => void

  private loginCallback
  private logoutCallback

  private addProjectCallback

  private addTaskCallback
  private addTaskGroupCallback

  private removeTaskCallback
  private removeTaskGroupCallback

  private updateTaskGroupTitleCallback

  private updateTaskTitleCallback
  private updateTaskDescriptionCallback
  private updateTaskDueDateCallback

  private addTaskOwnerCallback
  private removeTaskOwnerCallback

  private addCheckListItemCallback
  private removeCheckListItemCallback
  private updateCheckListItemStatusCallback
  private updateCheckListItemDescriptionCallback

  private addTaskAttachmentCallback
  private removeTaskAttachmentCallback

  private sendProjectChatCallback
  private sendTaskChatCallback

  private updateProjectTitleCallback
  private updateProjectDescriptionCallback
  private updateProjectDueDateCallback

  private addProjectMemberCallback
  private removeProjectMemberCallback

  private addUserCallback

  private document

  private model: Model

  constructor(document) {
    this.document = document

    this.init()
  }

  init() {
    this.createAppMenu()
    this.createAddUserElement()
    this.createLoginElement()
  }

  clear( 
  ) {
    const appElement = this.document.getElementById('app')
    appElement.innerHTML = ''
  }

  setModel(model: Model) {
    this.model = model;
  }

  setLoginCallback(callback) {
    this.loginCallback = callback
  }

  setLogoutCallback(callback) {
    this.logoutCallback = callback
  }

  setSortingCallback(callback) {
    this.afterSortingCallback = callback
  }

  setAddProjectCallback(callback) {
    this.addProjectCallback = callback
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

  setUpdateTaskDueDateCallback(callback) {
    this.updateTaskDueDateCallback = callback
  }

  setAddTaskOwnerCallback(callback) {
    this.addTaskOwnerCallback = callback
  }

  setRemoveTaskOwnerCallback(callback) {
    this.removeTaskOwnerCallback = callback
  }

  setAddTaskAttachmentCallback(callback: (assetId: AssetId, projectId: ProjectId, taskId: TaskId, description: Description) => void) {
    this.addTaskAttachmentCallback = callback
  }

  setRemoveTaskAttachmentCallback(callback) {
    this.removeTaskAttachmentCallback = callback
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

  setUpdateProjectTitleCallback(callback) {
    this.updateProjectTitleCallback = callback
  }

  setUpdateProjectDescriptionCallback(callback) {
    this.updateProjectDescriptionCallback = callback
  }

  setUpdateProjectDueDateCallback(callback) {
    this.updateProjectDueDateCallback = callback
  }

  setAddProjectMemberCallback(callback) {
    this.addProjectMemberCallback = callback
  }

  setRemoveProjectMemberCallback(callback) {
    this.removeProjectMemberCallback = callback
  }

  setAddUserCallback(callback) {
    this.addUserCallback = callback
  }

  private createAppMenu() {
    const html = `
        <div class="Dropdown">
          <div class="Icon IconApp AppMenuButton"></div>
          <div class="DropdownContent MenuItemList animated slideInRight">
            <div class="LoginContainer">
              <div class="Icon IconUser Login">
                <img id="UserImage"></img>
              </div>
              <div class="Icon IconLogout Logout"></div>
            </div>
            <div class="Icon IconAddProject AddProjectButton"></div>
            <div class="Icon IconAddUser AddUserButton"></div>
            <div class="ProjectList">
            </div>
          </div>
        </div>
    `
    const appMenu = this.document.createElement('div')
    appMenu.id = 'AppMenu'
    appMenu.innerHTML = html

    const menuButton = appMenu.querySelector('.AppMenuButton')
    const menu = appMenu.querySelector('.DropdownContent')
    menuButton.addEventListener('click', () => {
      if (menu.style.display === 'flex') {
        menu.style.display = 'none'
        menuButton.classList.add('IconApp')
        menuButton.classList.remove('IconCancel')
      }
      else {
        const projectMenuList = appMenu.querySelector('.ProjectList')
        projectMenuList.innerHTML = ''
        const projectList = this.model.getAllProject()
        for (const project of projectList) {

          const projectLink = this.document.createElement('div')
          projectLink.classList.add('ProjectLink')

          const projectLinkHTML = `
              <div class="Icon IconProject ProjectLinkButton"></div>
              <div Class="ProjectLinkTitle">${project.title}</div>
          ` 
          projectLink.innerHTML = projectLinkHTML

          const projectLinkButton = projectLink.querySelector('.ProjectLinkButton')
          projectLinkButton.addEventListener('click', () => {
            menu.style.display = 'none'
            menuButton.classList.add('IconApp')
            menuButton.classList.remove('IconCancel')

            const projectElements = this.document.getElementsByClassName('Project')
            for (const pe of projectElements) {
              pe.style.display = 'none'
            }
            const projectElement = this.document.getElementById(project.id)
            projectElement.style.display = 'flex'
          })

          projectMenuList.appendChild(projectLink)
        }

        menu.style.display = 'flex'
        menuButton.classList.remove('IconApp')
        menuButton.classList.add('IconCancel')
      }
    })

    const addUserButton = appMenu.querySelector('.AddUserButton')
    addUserButton.addEventListener('click', () => {
      const addUser = this.document.querySelector('.AddUser')
      if (addUser) {
        menu.style.display = 'none'
        menuButton.classList.add('IconApp')
        menuButton.classList.remove('IconCancel')

        addUser.style.display = 'flex'
        addUser.classList.add('zoomIn')
      }
      else {
        throw new Error('AddUser element not found')
      }
    })

    const addProjectButton = appMenu.querySelector('.AddProjectButton')
    addProjectButton.addEventListener('click', () => {
      menu.style.display = 'none'
      menuButton.classList.add('IconApp')
      menuButton.classList.remove('IconCancel')

      this.addProjectCallback()
    })

    const userLogin = appMenu.querySelector('.Login')
    userLogin.addEventListener('click', () => {
      const login = this.document.getElementById('Login')
      if (login) {
        const image = userLogin.querySelector('#UserImage')
        // don't show login window if there is user already 
        // logged in
        console.log(`debug ${image.src}`)
        if (image.src === '') {
          menu.style.display = 'none'
          menuButton.classList.add('IconApp')
          menuButton.classList.remove('IconCancel')

          login.style.display = 'flex'
          login.classList.add('zoomIn')
        }
      }
      else {
        throw new Error('login element not found')
      }
    })

    const userLogout = appMenu.querySelector('.Logout')
    userLogout.addEventListener('click', () => {
      menu.style.display = 'none'
      menuButton.classList.add('IconApp')
      menuButton.classList.remove('IconCancel')

      this.logoutCallback()
    })


    const app = this.document.getElementById('app')
    app.appendChild(appMenu)
  }

  private createAddUserElement() {
    const html = `
    <div class="CancelContainer">
      <div class="Icon IconClose Cancel"></div>
    </div>
    <div class="UserId MInputGroup">
      <input type="text" required="required" class="MInput UserIdInput"></input>
      <span class="highlight"></span>
      <span class="InputBar"></span>
      <label class="MInputLabel">Id</label>
    </div>
    <div class="UserName MInputGroup">
      <input type="text" required="required" class="MInput UserNameInput"></input>
      <span class="highlight"></span>
      <span class="InputBar"></span>
      <label class="MInputLabel">Name</label>
    </div>
    <div class="UserTitle MInputGroup">
      <input type="text" required="required" class="MInput UserTitleInput"></input>
      <span class="highlight"></span>
      <span class="MInputBar"></span>
      <label class="MInputLabel">Title</label>
    </div>
    <div class="UserDescription MInputGroup">
      <input type="text" required="required" class="MInput UserDescriptionInput"></input>
      <span class="highlight"></span>
      <span class="MInputBar"></span>
      <label class="MInputLabel">About</label>
    </div>
    <div class="Avatar">
      <label>Avatar</label>
      <input class="UserAvatarFile" type="file"/> 
      <img class="UserAvatarImage" src=""/> 
    </div>
    <div class="Icon IconAdd Add"></div>
    `
    const addUser = this.document.createElement('div')
    addUser.classList.add('animated')
    addUser.classList.add('AddUser')
    addUser.innerHTML = html

    const avatarFile = addUser.querySelector('.UserAvatarFile')
    avatarFile.addEventListener('input', () => {
      if (avatarFile.files.length > 0) {
        const file = avatarFile.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (evt) => {
          // @ts-ignore
          const content = evt.target.result
          const image = addUser.querySelector('.UserAvatarImage')
          image.src = content
        }
      }
    })

    function resetFields() {
      addUser.querySelector('.UserIdInput').value = ''
      addUser.querySelector('.UserNameInput').value = ''
      addUser.querySelector('.UserTitleInput').value = ''
      addUser.querySelector('.UserDescriptionInput').value = ''
      addUser.querySelector('.UserAvatarFile').value = ''
      addUser.querySelector('.UserAvatarImage').src = ''
    }

    const addButton = addUser.querySelector('.Add')
    addButton.addEventListener('click', () => {
      const userId = addUser.querySelector('.UserIdInput').value
      const userName = addUser.querySelector('.UserNameInput').value
      const userTitle = addUser.querySelector('.UserTitleInput').value
      const userDescription = addUser.querySelector('.UserDescriptionInput').value
      const avatarFiles = addUser.querySelector('.UserAvatarFile')
      if (avatarFiles.files.length > 0) {
        const avatarFile = avatarFiles.files[0]
        this.addUserCallback(userId, userName, userTitle, userDescription, avatarFile)
      }

      resetFields()
      addUser.style.display = 'none'
    })
    const cancelButton = addUser.querySelector('.Cancel')
    cancelButton.addEventListener('click', () => {
      addUser.style.display = 'none'
      resetFields()
    })

    const app = this.document.getElementById('app')
    app.appendChild(addUser)
  }

  private createLoginElement() {
    const login = this.document.createElement('div')
    login.id = 'Login'
    login.classList.add('animated')

    const html = `
      <div class="CloseContainer">
        <div class="Icon IconClose Close"></div>
      </div>
      <div class="IdContainer">
        <div class="Icon IconFace"></div>
        <div class="UserId MInputGroup">
          <input type="text" required="required" class="MInput UserIdInput"></input>
          <span class="highlight"></span>
          <span class="InputBar"></span>
          <label class="MInputLabel">Id</label>
        </div>
      </div>
      <div class="PasswordContainer">
        <div class="Icon IconPassword"></div>
        <div class="UserId MInputGroup">
          <input type="password" required="required" class="MInput PasswordInput"></input>
          <span class="highlight"></span>
          <span class="InputBar"></span>
          <label class="MInputLabel">Password</label>
        </div>
      </div>
      <div class="LoginContainer">
        <div class="Icon IconLogin Login"></div>
      </div>
    `
    login.innerHTML = html

    function reset() {
      login.querySelector('.UserIdInput').value = ''
      login.querySelector('.PasswordInput').value = ''
    }

    const close = login.querySelector('.Close')
    close.addEventListener('click', () => {
      login.style.display = 'none'
      reset()
    })

    const doit = login.querySelector('.Login')
    doit.addEventListener('click', () => {
      const userId = login.querySelector('.UserIdInput').value
      const password = login.querySelector('.PasswordInput').value
      login.style.display = 'none'
      reset()
      this.loginCallback(userId, password)
    })

    const app = this.document.getElementById('app')
    app.appendChild(login)
  }

  private getTaskTotalItemsCount(taskId: TaskId): number {
    const task = this.document.getElementById(taskId)
    if (task) {
      const total = task.querySelector('.Overview .Progress .Total')
      if (total) {
        return Number(total.textContent)
      }
      else {
        throw new Error(`task ${taskId} Total element not found`)
      }
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  private updateTaskTotalItemsCount(taskId: TaskId, delta: number): void {
    const task = this.document.getElementById(taskId)
    if (task) {
      const total = task.querySelector('.Overview .Progress .Total')
      if (total) {
        const newTotal = Number(total.textContent) + delta
        total.textContent = `${newTotal}`
      }
      else {
        throw new Error(`task ${taskId} Total element not found`)
      }
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  private getTaskCompletedItemsCount(taskId: TaskId): number {
    const task = this.document.getElementById(taskId)
    if (task) {
      const total = task.querySelector('.Overview .Progress .Completed')
      if (total) {
        return Number(total.textContent)
      }
      else {
        throw new Error(`task ${taskId} Total element not found`)
      }
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  private updateTaskCompletedItemsCount(taskId: TaskId, delta: number): void {
    const task = this.document.getElementById(taskId)
    if (task) {
      const completed = task.querySelector('.Overview .Progress .Completed')
      if (completed) {
        const newCompleted = Number(completed.textContent) + delta 
        completed.textContent = `${newCompleted}`
      }
      else {
        throw new Error(`task ${taskId} Total element not found`)
      }
    }
    else {
      throw new Error(`task ${taskId} not found`)
    }
  }

  private createTaskElement(task: Task) {
    const taskElement = this.document.createElement('div')
    taskElement.setAttribute('class', 'Task')
    taskElement.setAttribute('id', task.id)
    taskElement.classList.add('animated', 'bounceIn')
    taskElement.addEventListener('animationend', () => {
      taskElement.classList.remove('animated')
      taskElement.classList.remove('bounceIn')
    })

    var options = { month: 'short', day: 'numeric'};
    const dueDate = new Date(task.dueDate)
    const formattedDueDate = dueDate.toLocaleDateString(undefined, options)

    const completedItems = 0
    const totalItems = 0

    const html = `
        <div class="Header">
          <div class="TopContainer">
            <div class="Icon IconDrag DragTask"></div>
            <div class="ShowDetails">
              <div class="Icon IconExpand Button"></div>
            </div>
          </div>
          <div class="Title">
            <input class="Input" value=${task.title}>
            </input>
          </div>
          <div class="OwnerSection">
            <div class="OwnerPlaceholder">
              <div class='Icon IconGroup'></div>
            </div>
            <div class="OwnerList">
            </div>
          </div>
          <div class="Overview">
            <div class="DueDateContainer">
              <div class="Icon IconCalendar DueDateSelector"></div>
              <input type="text" class="DueDate"  value="${task.dueDate}"</input>
            </div>
            <div class="Progress">
              <div class="Icon IconList ProgressPlaceholder"></div>
              <div class="ProgressSection">
                <label class="Completed">${completedItems}</label>
                <div class="Separator">/</div>
                <label class="Total">${totalItems}</label>
              </div>
            </div>
            <div class="Remove">
              <div class="Icon IconDelete RemoveButton"></div>
            </div>
          </div>
        </div>
        <div class="Body">
          <div class="Close">
            <div class="Icon IconClose CloseButton"></div>
          </div>
          <div class="Tab">
            <div class="Icon IconDescription OpenDescription"></div>
            <div class="Icon IconTodo OpenTodo"></div>
            <div class="Icon IconAttachment OpenAttachment"></div>
            <div class="Icon IconMessages OpenTaskChat"></div>
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
              <div class="Icon IconAdd AppendItemButton"></div>
            </div>
          </div>
          <div class="Attachment">
            <div class="AttachmentItemList">
            </div>
            <div class="AppendAttachmentItemContainer">
              <div class="Icon IconAdd AppendAttachmentItemButton">
              </div>
            </div>
          </div>
        </div>
    `

    taskElement.innerHTML = html

    const chatClassName = 'TaskChat'
    const callback = (inputElement) => {
      return () => {
        const editor = inputElement.querySelector('.ql-editor')
        const message = editor.innerHTML 
        this.sendTaskChatCallback(task.id, message, '')
        editor.innerHTML = ''
      }
    }
    const chatElement = this.createChatElement(chatClassName, callback)

    const body = taskElement.querySelector('.Body')
    body.classList.add('animated', 'zoomIn')

    body.appendChild(chatElement)

    const description = taskElement.querySelector('.Description')
    const descElement = taskElement.querySelector('.DescEditor')
    const descOptions = {
      theme: 'snow',
      placeholder: 'Type task a description',
      modules: {
        toolbar: [
          [
            { 'font': [] }, 
            { 'size': [] },
            'bold', 'italic', 'underline', 'strike',
            { 'color': [] }, 
            { 'background': [] },
            {'list': 'ordered' }, 
            { 'list': 'bullet'},
            { 'indent': '-1' }, 
            { 'indent': '+1' },
            'link', 'image', 'video' ,
          ]
        ]
      }
    }

    const quill = new Quill(descElement, descOptions)

    const editor = taskElement.querySelector('.DescEditor .ql-editor')
    editor.innerHTML = task.description

    const todo = taskElement.querySelector('.Todo')
    const chat = taskElement.querySelector('.TaskChat')
    const attachment = taskElement.querySelector('.Attachment')

    const hideDetails = taskElement.querySelector('.CloseButton')
    hideDetails.addEventListener('click', () => {
      if (body.style.display !== 'none') {
        body.style.display = 'none'
        this.updateTaskDescriptionCallback(task.id, editor.innerHTML)
      }
    })

    const openDescription = taskElement.querySelector('.OpenDescription')
    const openTodo = taskElement.querySelector('.OpenTodo')
    const openAttachment = taskElement.querySelector('.OpenAttachment')
    const openChat = taskElement.querySelector('.OpenTaskChat')

    const initTabCallback = () => {
      description.style.display = 'flex'

      todo.style.display = 'none'
      chat.style.display = 'none'
      attachment.style.display = 'none'

      openDescription.style.background = 'lightgreen' 

      openTodo.style.background = 'lightgrey' 
      openAttachment.style.background = 'lightgrey' 
      openChat.style.background = 'lightgrey' 
    }

    openDescription.addEventListener('click', initTabCallback) 

    openTodo.addEventListener('click', () => {
      todo.style.display = 'flex'

      chat.style.display = 'none'
      description.style.display = 'none'
      attachment.style.display = 'none'

      openTodo.style.background = 'lightgreen' 

      openDescription.style.background = 'lightgrey' 
      openChat.style.background = 'lightgrey' 
      openAttachment.style.background = 'lightgrey' 
    })

    openAttachment.addEventListener('click', () => {
      attachment.style.display = 'flex'

      todo.style.display = 'none'
      chat.style.display = 'none'
      description.style.display = 'none'

      openAttachment.style.background = 'lightgreen' 

      openDescription.style.background = 'lightgrey' 
      openChat.style.background = 'lightgrey' 
      openTodo.style.background = 'lightgrey' 
    })

    openChat.addEventListener('click', () => {
      chat.style.display = 'flex'

      todo.style.display = 'none'
      attachment.style.display = 'none'
      description.style.display = 'none'

      const messageList = body.querySelector('.MessageList')
      messageList.scrollTop = messageList.scrollHeight

      openChat.style.background = 'lightgreen' 

      openDescription.style.background = 'lightgrey' 
      openTodo.style.background = 'lightgrey' 
      openAttachment.style.background = 'lightgrey' 
    })

    const showDetails = taskElement.querySelector('.ShowDetails .Button')
    showDetails.addEventListener('click', () => {
      if (body.style.display !== 'flex') {
        body.style.display = "flex"
      }
      initTabCallback()
    })

    const title = taskElement.querySelector('.Title .Input')
    title.onblur = () => {
      console.log(`update task title ${task.id}`)
      this.updateTaskTitleCallback(task.id, title.value)
    }

    const dueDateElement = taskElement.querySelector('.DueDate')
    flatpickr(dueDateElement, {
      altInput: true,
      altFormat: "M-d",
      onChange: (selectedDates, DateString, instance) => {
        console.log(selectedDates)
        // console.log(`update task due date ${task.id}`)
        this.updateTaskDueDateCallback(task.id, selectedDates[0])
      }
    })

    const dueDateInput = taskElement.querySelector('.DueDateContainer .form-control')
    dueDateInput.maxlength = '7'
    dueDateInput.size = '7'

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

    const appendAttachment= taskElement.querySelector('.Attachment .AppendAttachmentItemButton')
    appendAttachment.addEventListener('click', () => {
      console.log(`append attachment`)
      const description = 'new'
      const projectElement = taskElement.closest('.Project')
      if (projectElement) {
        const assetId = 'test'
        this.addTaskAttachmentCallback(assetId, projectElement.id, task.id, description)
      }
      else {
        throw new Error(`project for ${task.id} not found`)
      }

    })

    const removeTaskButton = taskElement.querySelector('.RemoveButton')
    removeTaskButton.addEventListener('click', () => {
      this.removeTaskCallback(task.id)
    })

    return taskElement
  }

  private createTaskGroupElement(project: Project, taskGroup: TaskGroup) {
    const html = `
        <div class="TaskGroupContainer">
          <div class="Icon IconDrag DragTaskGroup"></div>
          <input class="Input" value=${taskGroup.title}></input>
          <div class="Remove">
            <div class="Icon IconDelete RemoveTaskGroup"></div>
          </div>
        </div>
        <div class="Icon IconAdd AddTask"></div>
        <div class="TaskList" id="${taskGroup.id}-task-list"></div>
    `

    const taskGroupElement = this.document.createElement('div')
    taskGroupElement.classList.add('TaskGroup')
    taskGroupElement.id = taskGroup.id

    taskGroupElement.innerHTML = html

    const remove = taskGroupElement.querySelector('.RemoveTaskGroup')
    remove.addEventListener('click', () => {
      this.removeTaskGroupCallback(taskGroup.id)
    })

    const title = taskGroupElement.querySelector('.Input')
    title.onblur = () => {
      console.log(`update task group title ${taskGroup.id}`)
      this.updateTaskGroupTitleCallback(taskGroup.id, title.value)
    }

    const addTask = taskGroupElement.querySelector('.AddTask')
    addTask.addEventListener('click', () => {
      this.addTaskCallback(taskGroup.id)
    })

    const taskList = taskGroupElement.querySelector(`.TaskList`)

    new Sortable(taskList, {
      group: project.id,
      animation: 150,
      onEnd: this.afterSortingCallback,
      handle: '.DragTask',
      ghostClass: 'SortableGhost',
      chosenClass: 'SortableChosen',
    })

    return taskGroupElement
  }

  private createChatElement(className: string, callback) {
    const chatElement = this.document.createElement('div')
    chatElement.className = className

    const html = `
      <div class="MessageList">
      </div>
      <div class="Input">
        <div class="Message">
        </div>
        <div class="Send">
          <div class="Icon IconSend SendButton"></div>
        </div>
      </div>
    `
    chatElement.innerHTML = html

    const sendButton = chatElement.querySelector('.SendButton')
    const messageElement = chatElement.querySelector('.Message')

    var options = {
      placeholder: 'Type a message...',
      theme: 'bubble',
      bounds: messageElement,
      modules: {
        toolbar: [
          [
            { 'font': [] }, 
            { 'size': [] },
            'bold', 'italic', 'underline', 'strike',
            { 'color': [] }, 
            { 'background': [] },
            {'list': 'ordered' }, 
            { 'list': 'bullet'},
            { 'indent': '-1' }, 
            { 'indent': '+1' },
            'link', 'image', 'video' ,
          ]
        ]
      }
    };

    console.log(chatElement)

    const quill = new Quill(messageElement, options)

    messageElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    // @ts-ignore
      quill.theme.tooltip.edit()
    // @ts-ignore
      quill.theme.tooltip.show()
      return false
    })

    sendButton.addEventListener('click', callback(messageElement))

    return chatElement
  }

  private createProjectElement(project: Project) {
    const html = `
        <div class="ProjectOverview">

          <div class="ProjectHeader">
            <div class="ProjectContainer">
              <div class="Title">
                <input class="TitleInput" value="${project.title}"></input>
              </div>
              <div class="DueDateContainer">
                <div class="Icon IconCalendarBig DueDateSelector"></div>
                <input type="text" class="DueDate"  value="${project.dueDate}"</input>
              </div>
              <!-- <div class="Description">
                <div class="Icon IconDescription OpenDescription">
                <div class="DescEditor">
                </div>
              </div>
              -->
            </div>
          </div>

          <div class="MemberListContainer">
            <div class="MemberList">
            </div>
            <div class="Dropdown">
              <div class="Icon IconAddBig AddProjectMemberButton"></div>
              <div class="DropdownContent UserListContainer">
                <div class="UserList">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="AddTaskGroup">
            <div class="Icon IconAddBig AddTaskGroupButton">
            </div>
        </div>

        <div class="TaskGroupList" id="${project.id}-task-group-list">
        </div>
    `

    const projectElement = this.document.createElement('div')
    projectElement.classList.add('Project')
    projectElement.id = project.id
    projectElement.innerHTML = html

    const userList = projectElement.querySelector('.UserList')
    const addMember = projectElement.querySelector('.AddProjectMemberButton')

    addMember.addEventListener('click', () => {
      if (userList.parentNode.style.display === 'block') {
        addMember.classList.add('IconAddBig')
        addMember.classList.remove('IconCancel')
        userList.parentNode.style.display = 'none'
        while (userList.firstChild) {
          userList.removeChild(userList.firstChild);
        }
      }
      else {
        const memberList = this.model.getAllMember()
        const existingMemberList = this.model.getAllProjectMember(project.id)

        memberList.forEach((member, _) => {
          const userElement = this.document.createElement("div")
          const index = existingMemberList.findIndex(existingMember => {
            return (member.id === existingMember.id)
          })
          if (index == -1) {
            userElement.classList.add('User')
            const avatar = this.model.getAsset(member.avatar)
            if (avatar) {
              const image = this.document.createElement('img')
              image.classList.add('AddUserImage')
              image.src = avatar.content
              userElement.appendChild(image)
            }
            const name = this.document.createElement('div')
            name.classList.add('AddUserName')
            name.innerText = member.name
            userElement.appendChild(name)

            userList.appendChild(userElement)
            name.addEventListener('click', () => {
              const userId = member.id
              // check if the member has been added
              const existingMemberList = this.model.getAllProjectMember(project.id)
              const index = existingMemberList.findIndex(existingMember => {
                return (userId === existingMember.id)
              })
              if (index == -1) {
                this.addProjectMemberCallback(userId, project.id)
              }
            })
          }
        })
        addMember.classList.remove('IconAddBig')
        addMember.classList.add('IconCancel')
        userList.parentNode.style.display = 'block'
      }
    })

    const title = projectElement.querySelector('.TitleInput')
    title.onblur = () => {
      this.updateProjectTitleCallback(project.id, title.value)
    }

    // const description = projectElement.querySelector('.Description')
    // const descElement = projectElement.querySelector('.DescEditor')
    // const descOptions = {
    //   theme: 'snow',
    //   placeholder: 'Type task a description',
    //   modules: {
    //     toolbar: [
    //       [
    //         { 'font': [] }, 
    //         { 'size': [] },
    //         'bold', 'italic', 'underline', 'strike',
    //         { 'color': [] }, 
    //         { 'background': [] },
    //         {'list': 'ordered' }, 
    //         { 'list': 'bullet'},
    //         { 'indent': '-1' }, 
    //         { 'indent': '+1' },
    //         'link', 'image', 'video' ,
    //       ]
    //     ]
    //   }
    // }

    // const quill = new Quill(descElement, descOptions)
    
    // const description = projectElement.querySelector('.Description')
    // description.onblur = () => {
    //   this.updateProjectDescriptionCallback(project.id, description.innerText)
    // }

    const dueDateElement = projectElement.querySelector('.DueDate')
    flatpickr(dueDateElement, {
      altInput: true,
      altFormat: "M-d",
      onChange: (selectedDates, DateString, instance) => {
        console.log(selectedDates)
        // console.log(`update task due date ${task.id}`)
        this.updateProjectDueDateCallback(project.id, selectedDates[0])
      }
    })

    const dueDateInput = projectElement.querySelector('.DueDateContainer .form-control')
    dueDateInput.maxlength = '7'
    dueDateInput.size = '7'

    const addTaskGroupButton = projectElement.querySelector('.AddTaskGroupButton')
    addTaskGroupButton.addEventListener('click', () => {
      this.addTaskGroupCallback(project.id)
    })

    const taskGroupListElement = projectElement.querySelector('.TaskGroupList')

    new Sortable(taskGroupListElement, {
      group: `${project.id}-TaskGroup`,
      animation: 150,
      onEnd: this.afterSortingCallback,
      handle: '.DragTaskGroup',
      ghostClass: 'SortableGhost',
      chosenClass: 'SortableChosen',
    })

    // Project Chat
    const chatElementClass = 'ProjectChat'
    const chatCallback = (inputElement) => {
      return () => {
        const editor = inputElement.querySelector('.ql-editor')
        const message = editor.innerHTML
        this.sendProjectChatCallback(project.id, message, '')
        editor.innerHTML = ''
      } 
    }
    const chatElement = this.createChatElement(chatElementClass, chatCallback)

    const openChatElement = this.document.createElement('div')
    openChatElement.classList.add('ProjectChatButton', 'Icon', 'IconMessageBig')

    projectElement.appendChild(chatElement)
    projectElement.appendChild(openChatElement)

    chatElement.addEventListener('animationend', () => {
      if (chatElement.classList.contains('slideOutRight')) {
        chatElement.style.display = 'none'
      }
    })

    openChatElement.onclick = function() {
      console.log('open clicked')
      if (chatElement.style.display === "flex") {
        chatElement.classList.remove('slideInRight')
        chatElement.classList.add('slideOutRight')
        openChatElement.classList.add('IconMessageBig')
        openChatElement.classList.remove('IconCancel')
      }
      else {
        chatElement.classList.remove('slideOutRight')
        chatElement.classList.add('slideInRight')
        chatElement.style.display = 'flex'
        openChatElement.classList.remove('IconMessageBig')
        openChatElement.classList.add('IconCancel')
        let messageList = chatElement.querySelector('.MessageList')
        messageList.scrollTop = messageList.scrollHeight
      }
    }

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
      projectElement.querySelector('.TaskGroupList').appendChild(taskGroupElement)
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
      const taskList = taskGroupElement.querySelector('.TaskList')
      taskList.appendChild(taskElement)
    }
    else {
      throw new Error(`${taskGroup.id} not found`)
    }
  }

  removeTask(taskId: TaskId) {
    const taskElement = this.document.getElementById(taskId)
    if (taskElement) {
      taskElement.classList.add('animated', 'bounceOut')
      taskElement.addEventListener('animationend', () => {
        taskElement.parentNode.removeChild(taskElement)
      })
    }
    else {
      throw new Error(`${taskId} not found`)
    }
  }

  insertTask(taskGroup: TaskGroup, task: Task, index: number) {
    console.log(`insert task: ${index}`)
    const taskGroupElement = this.document.getElementById(taskGroup.id)
    if (taskGroupElement) {
      const taskList = taskGroupElement.querySelector('.TaskList')
      if (index <= taskList.children.length - 1) {
          const taskElement = this.createTaskElement(task)
          const refElement = taskList.children[index] 
          taskList.insertBefore(taskElement, refElement)
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

  updateTaskDueDate(projectId: ProjectId, taskId: TaskId, dueDate: Date) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const taskElement = this.document.getElementById(taskId)
      if (taskElement) {
        const dueDateElement = taskElement.querySelector('.DueDate')
        if (dueDateElement) {
          var options = { month: 'short', day: 'numeric' }
          const formattedDueDate = dueDate.toLocaleDateString(undefined, options)
          dueDateElement.value = formattedDueDate
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
          const toParentElement = toTaskGroupId ? toTaskGroupElement.querySelector('.TaskList') : fromParentElement

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

  appendProjectMember(projectId: ProjectId, member: Member, image: string): void {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const memberList = projectElement.querySelector('.MemberList')

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
      memberImageElement.addEventListener('click', () => {
        this.removeProjectMemberCallback(member.id, projectId)
      })

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
      const memberElement = projectElement.querySelector(`#${memberId}`)
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
      imageElement.parentNode.classList.remove('IconUser', 'Icon')
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

        this.updateTaskTotalItemsCount(taskId, 1)
        if (item.status == ItemStatus.Closed) {
          this.updateTaskCompletedItemsCount(taskId, 1)
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

  removeCheckListItem(projectId: ProjectId, taskId: TaskId, itemId: ItemId, status: ItemStatus) {
    const project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const item = this.document.getElementById(itemId)
        if (item) {
          item.parentNode.removeChild(item)

          this.updateTaskTotalItemsCount(taskId, -1)
          if (status == ItemStatus.Closed) {
            this.updateTaskCompletedItemsCount(taskId, -1)
          }
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

  updateCheckListItemStatus(taskId: TaskId, itemId: ItemId, status: ItemStatus) {
    const item = this.document.getElementById(itemId)
    if (item) {
      item.children[1].children[0].checked = status === ItemStatus.Open ? false : true

      if (status == ItemStatus.Closed) {
        this.updateTaskCompletedItemsCount(taskId, 1)
      }
      else {
        this.updateTaskCompletedItemsCount(taskId, -1)
      }
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

  private appendChatMessage(userId: UserId, messageList, message: ChatMessage) {
    const messageElement = this.document.createElement('div')
    messageElement.setAttribute('id', message.id)
    const [className, direction] = (userId === message.posterId) ? ['MyChatMessage', 'fadeIn'] : ['ChatMessage', 'fadeIn']
    messageElement.classList.add(className)

    let image = ""
    const member = this.model.getMember(message.posterId)
    if (member) {
      const asset = this.model.getAsset(member.avatar)
      if (asset) {
        image = asset.content
      }
    }

    const postTime = new Date(message.postTime)
    var options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'}
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

  appendProjectChatMessage(userId: UserId, projectId: ProjectId, message: ChatMessage) {
    let project = this.document.getElementById(projectId)
    if (project) {
      const chat = project.querySelector('.ProjectChat')
      if (chat) {
        const messageList = chat.querySelector('.MessageList')
        if (messageList) {
          this.appendChatMessage(userId, messageList, message)
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

  appendTaskChatMessage(userId: UserId, projectId: ProjectId, taskId: TaskId, message: ChatMessage) {
    let project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const chat = task.querySelector('.TaskChat')
        if (chat) {
          const messageList = chat.querySelector('.MessageList')
          if (messageList) {
            this.appendChatMessage(userId, messageList, message)
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

  updateProjectTitle(projectId: ProjectId, title: Title) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const titleElement = projectElement.querySelector('.ProjectContainer .Title .TitleInput')
      if (titleElement) {
        titleElement.value = title
      }
      else {
        throw new Error(`title element for ${projectId} not found`)
      }
    }
    else {
      throw new Error(`project element for ${projectId} not found`)
    }
  }

  updateProjectDueDate(projectId: ProjectId, dueDate: Date) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const dueDateElement = projectElement.querySelector('.ProjectContainer .DueDateContainer .DueDate')
      if (dueDateElement) {
        var options = { month: 'short', day: 'numeric' }
        const formattedDueDate = dueDate.toLocaleDateString(undefined, options)
        dueDateElement.value = formattedDueDate 
      }
      else {
        throw new Error(`due date element for ${projectId} not found`)
      }
    }
    else {
      throw new Error(`project element for ${projectId} not found`)
    }
  }

  updateProjectDescription(projectId: ProjectId, description: Description) {
    const projectElement = this.document.getElementById(projectId)
    if (projectElement) {
      const descriptionElement = projectElement.querySelector('.ProjectHeader .Description')
      if (descriptionElement) {
        descriptionElement.innerText = description 
      }
      else {
        throw new Error(`description element for ${projectId} not found`)
      }
    }
    else {
      throw new Error(`project element for ${projectId} not found`)
    }
  }

  appendTaskAttachmentItem(attachmentId: AttachmentId, projectId: ProjectId, taskId: TaskId, description: Description, asset: Asset) {
    const project = this.document.getElementById(projectId)
    if (project) {
      const task = this.document.getElementById(taskId)
      if (task) {
        const attachmentList = task.querySelector('.AttachmentItemList')
        
        const itemElement = this.document.createElement('div')
        itemElement.setAttribute('class', 'AttachmentItem')
        itemElement.setAttribute('id', attachmentId)

        const html = `
          <div class="ItemHeader">
          </div>
          <div class="ItemType">
            ${asset.type}
          </div>
          <div class="ItemName">
            ${asset.name}
          </div>
          <div class="AssetId">
            ${asset.id}
          </div>
          <div class="ItemDescription">
            <input class="DescriptionInput" value="${description}"</input>
          </div>
          <div class="RemoveItem">
            <input type="image" src="../../../images/close.svg" class="RemoveItemButton"></input>
          </div>
        `
        itemElement.innerHTML = html

        // const descInput = itemElement.querySelector('.DescriptionInput')
        // descInput.onblur = () => {
        //   this.removeTaskAttachmentCallback(attachmentId)
        // }

        const removeButton = itemElement.querySelector('.RemoveItemButton')
        removeButton.addEventListener('click', () => {
          this.removeTaskAttachmentCallback(attachmentId)
        })

        attachmentList.appendChild(itemElement)
      }
      else {
        throw new Error(`task ${taskId} not found`)
      }
    }
    else {
      throw new Error(`project ${projectId} not found`)
    }
  }

  removeTaskAttachmentItem(attachmentId: AttachmentId) {
    const attachment = this.document.getElementById(attachmentId)
    if (attachment) {
      attachment.parentElement.removeChild(attachment)
    }
    else {
      throw new Error(`${attachmentId} not found`)
    }
  }
}
