import { Model } from "./Model"
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
              <a href="#" class="fab-buttons__link" data-tooltip="Login">
                <i class="Icon IconUser Login"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Logout">
                <i class="Icon IconLogout" Logout></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Open Project Chat">
                <i class="Icon IconChat"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Show Activity">
                <i class="Icon IconNotification"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="Show My Projects">
                <i class="Icon IconProject ShowMyProjects"></i>
              </a>
            </li>
            <li class="fab-buttons__item">
              <a href="#" class="fab-buttons__link" data-tooltip="New Project">
                <i class="Icon IconAddProject AddProject"></i>
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
      // const image = userLogin.querySelector('#UserImage')
      // // don't show login window if there is user already 
      // // logged in
      // // console.log(`debug ${image.src}`)
      // if (image.src === '') {
        // menu.style.display = 'none'
        // menuButton.classList.add('IconApp')
        // menuButton.classList.remove('IconCancel')

        login.style.display = 'flex'
        login.classList.add('zoomIn')
      // }
    }
    else {
      throw new Error('login element not found')
    }
  })

  const showProjectListButton = fab.querySelector('.ShowMyProjects')
  showProjectListButton.addEventListener('click', () => {
    showProjectList(model, document)
  })

  const addProjectButton = appMenu.querySelector('.AddProject')
  addProjectButton.addEventListener('click', () => {
    view.addProjectCallback()
  })

}

function showProjectList(model: Model, document: Document) {
  const projectMenuList = document.createElement('ProjectList')
  projectMenuList.classList.add('ProjectList')
  projectMenuList.innerHTML = ''

  const projectList = model.getAllProject()
  for (const project of projectList) {
    const projectLink = document.createElement('div')
    projectLink.classList.add('ProjectLink')

    const projectLinkHTML = `
        <div class="Icon IconProject ProjectLinkButton"></div>
        <div Class="ProjectLinkTitle">${project.title}</div>
    ` 
    projectLink.innerHTML = projectLinkHTML

    const projectLinkButton = projectLink.querySelector('.ProjectLinkButton')
    projectLinkButton.addEventListener('click', () => {
      const projectElements = document.getElementsByClassName('Project')
      // @ts-ignore
      for (const pe of projectElements) {
        pe.style.display = 'none'
      }
      const projectElement = document.getElementById(project.id)
      projectElement.style.display = 'flex'
    })

    projectMenuList.appendChild(projectLink)
  }

  document.body.appendChild(projectMenuList)
}