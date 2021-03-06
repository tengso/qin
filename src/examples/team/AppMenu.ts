import { Model, Project } from "./Model"
import { View } from "./View"


export function createAppMenu(view: View, model: Model, document: Document) {
  console.log('create app menu')

  const html = `
      <div class="fab">
          <span class="fab-action-button">
                <i class="fab-action-button__icon"></i>
          </span>
          <ul class='fab-buttons'>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Logout">
                <i class="Icon IconLogout Logout"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Open Project Chat">
                <i class="Icon IconChat OpenProjectChat"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Show Activity">
                <i class="Icon IconNotification OpenActivity"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="New Project">
                <div class="Icon IconAddProject AddProject"></div>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Show My Projects">
                <i class="Icon IconProject ShowMyProjects"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Login">
                <i class="Icon IconUser Login"></i>
              </a>
            </li>
          </ul>
        </div>
  `

  const appMenu = document.createElement('div')
  appMenu.id = 'AppMenu'
  appMenu.innerHTML = html
  document.body.appendChild(appMenu)

  const fab = appMenu.querySelector('.fab')

  const loginButton = fab.querySelector('.Login')
  loginButton.addEventListener('click', () => {
    const login = document.getElementById('Login')
    if (login) {
      login.style.display = 'flex'
      login.classList.add('zoomIn')
    }
    else {
      throw new Error('login element not found')
    }
  })

  const showProjectListButton = fab.querySelector('.ShowMyProjects')
  showProjectListButton.addEventListener('click', () => {
    showProjects(model)
  })

  const addProjectButton = appMenu.querySelector('.AddProject')
  addProjectButton.addEventListener('click', () => {
    view.addProjectCallback()
  })

  const logoutButton = appMenu.querySelector('.Logout')
  logoutButton.addEventListener('click', () => {
    view.logoutCallback()
  })

  const openChatButton = appMenu.querySelector('.OpenProjectChat')
  openChatButton.addEventListener('click', () => {
    const projectId = document.querySelector('.CurrentProjectId').id
    const projectElement = document.getElementById(projectId)

    console.log(`open project chat ${projectElement}`)

    const chatElement: HTMLElement = projectElement.querySelector('.ProjectChat') 
    chatElement.addEventListener('animationend', () => {
      if (chatElement.classList.contains('slideOutRight')) {
        chatElement.style.display = 'none'
      }
    })
    if (chatElement.style.display === "flex") {
      chatElement.classList.remove('slideInRight')
      chatElement.classList.add('slideOutRight')
    }
    else {
      chatElement.classList.remove('slideOutRight')
      chatElement.classList.add('slideInRight')
      chatElement.style.display = 'flex'
      let messageList = chatElement.querySelector('.MessageList')
      messageList.scrollTop = messageList.scrollHeight
    }
  })

  const openActivityButton = appMenu.querySelector('.OpenActivity')
    openActivityButton.addEventListener('click', () => {
      const projectId = document.querySelector('.CurrentProjectId').id
      const projectElement = document.getElementById(projectId)
      const activity = projectElement.querySelector('.ActivityContainer')
      const section: HTMLElement = activity.querySelector('.ActivitySection')
      const list = activity.querySelector('.ActivityList')

      if (section.style.display === 'flex') {
        section.classList.add('slideOutRight')
        section.classList.remove('slideInRight')
      }
      else {
        section.classList.remove('slideOutRight')
        section.classList.add('slideInRight')
        section.style.display = 'flex'
        list.scrollTop = list.scrollHeight
      }
    })
}

export function appendToProjectList(project: Project, model: Model, document: Document) {
  const projectMenuList = document.getElementById('ProjectList')
  appendToProjectListImpl(projectMenuList, project, model, document)
}

function appendToProjectListImpl(projectMenuList, project: Project, model: Model, document: Document) {
  const projectLink = document.createElement('div')
  projectLink.classList.add('ProjectLink')

  const projectLinkHTML = `
    <div class="ProjectLinkHead">
      <div Class="ProjectLinkTitle">${project.title}</div>
      <div class="Icon IconProjectOverview ProjectLinkButton"></div>
    </div>
    <div class="ProjectMembers">
      <div class="MemberList">
      </div>
    </div>
  ` 
  projectLink.innerHTML = projectLinkHTML

  const memberListElement = projectLink.querySelector('.MemberList')
  const memberList = project.getMembers()
  for (const member of memberList) {
    const asset = model.getAsset(member.avatar)
    if (asset) {
      const image = document.createElement('img')
      image.classList.add('ProjectLinkMemberImage')
      image.src = asset.content
      memberListElement.appendChild(image)
    }
  }

  const projectLinkButton = projectLink.querySelector('.ProjectLinkButton')
  projectLinkButton.addEventListener('click', () => {
    projectMenuList.style.display = 'none'
    const projectElements = document.getElementsByClassName('Project')
    // @ts-ignore
    for (const pe of projectElements) {
      pe.style.display = 'none'
    }
    const projectElement = document.getElementById(project.id)
    projectElement.style.display = 'flex'
    const currentProjectId = document.querySelector('.CurrentProjectId')
    currentProjectId.id = project.id
  })

  projectMenuList.appendChild(projectLink)
}

export function populateProjectList(model: Model, document: Document) {
  const projectMenuList = document.getElementById('ProjectList')
  projectMenuList.innerHTML = ''

  const projectList = model.getAllProject()
  for (const project of projectList) {
    appendToProjectListImpl(projectMenuList, project, model, document)
  }
}

export function showProjects(model: Model) {
  console.log('show projects called')
  const myProjects: HTMLElement = document.querySelector('#ProjectList') 
  myProjects.addEventListener('animationend', () => {
    if (myProjects.classList.contains('fadeOut')) {
      myProjects.style.display = 'none'
    }
  })

  if (myProjects.style.display === "flex") {
    myProjects.classList.remove('fadeIn')
    myProjects.classList.add('fadeOut')
  }
  else {
    const currentProjectId = document.querySelector('.CurrentProjectId')
    const currentProject = document.getElementById(currentProjectId.id)
    if (currentProject) {
      currentProject.style.display = 'none'
    }

    populateProjectList(model, document)
    myProjects.classList.remove('fadeOut')
    myProjects.classList.add('fadeIn')
    myProjects.style.display = 'flex'
  }
}