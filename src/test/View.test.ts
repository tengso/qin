const jsdom = require('jsdom')
const pretty = require('pretty')

import { expect } from 'chai'
import { describe } from 'mocha'
import { View } from '../examples/team/View'
import { Project, TaskGroup, Task } from '../examples/team/Model'

before(() => {
})

after(() => {
})

describe('Test Model', function() {
  it('test basic', function() {
    const { JSDOM } = jsdom
    const dom = new JSDOM()
    const { document } = dom.window 
    const appElement = document.createElement('div')
    appElement.setAttribute('id', 'app')
    document.body.appendChild(appElement)

    const view = new View(document, undefined)

    const project1: Project = {
      id: 'project_id_1',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const taskGroup1: TaskGroup = {
      id: 'task_group_id_1',
      title: 'title',
      description: 'description',
    }

    const taskGroup2: TaskGroup = {
      id: 'task_group_id_2',
      title: 'title',
      description: 'description',
    }

    const taskGroup3: TaskGroup = {
      id: 'task_group_id_3',
      title: 'title',
      description: 'description',
    }

    const task1: Task = {
      id: 'task_id_1',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const task2: Task = {
      id: 'task_id_2',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const task3: Task = {
      id: 'task_id_3',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    view.appendProject(project1)
    view.appendTaskGroup(project1, taskGroup1)
    view.appendTaskGroup(project1, taskGroup2)
    view.appendTaskGroup(project1, taskGroup3)
    view.appendTask(taskGroup1, task1)
    view.appendTask(taskGroup1, task2)
    view.appendTask(taskGroup1, task3)

    view.moveTaskGroup('project_id_1', 'task_group_id_1', 'task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[0].id).equals('task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[1].id).equals('task_group_id_1')
    expect(document.getElementById('project_id_1').children[1].children[2].id).equals('task_group_id_3')

    view.moveTaskGroup('project_id_1', 'task_group_id_2', 'task_group_id_1')
    expect(document.getElementById('project_id_1').children[1].children[0].id).equals('task_group_id_1')
    expect(document.getElementById('project_id_1').children[1].children[1].id).equals('task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[2].id).equals('task_group_id_3')

    view.moveTaskGroup('project_id_1', 'task_group_id_1', 'task_group_id_3')
    expect(document.getElementById('project_id_1').children[1].children[0].id).equals('task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[1].id).equals('task_group_id_3')
    expect(document.getElementById('project_id_1').children[1].children[2].id).equals('task_group_id_1')

    view.moveTaskGroup('project_id_1', 'task_group_id_1', 'task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[0].id).equals('task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[1].id).equals('task_group_id_1')
    expect(document.getElementById('project_id_1').children[1].children[2].id).equals('task_group_id_3')

    view.moveTaskGroup('project_id_1', 'task_group_id_3', undefined)
    expect(document.getElementById('project_id_1').children[1].children[0].id).equals('task_group_id_3')
    expect(document.getElementById('project_id_1').children[1].children[1].id).equals('task_group_id_2')
    expect(document.getElementById('project_id_1').children[1].children[2].id).equals('task_group_id_1')
  })

  it('test move task', function() {
    const { JSDOM } = jsdom
    const dom = new JSDOM()
    const { document } = dom.window 
    const appElement = document.createElement('div')
    appElement.setAttribute('id', 'app')
    document.body.appendChild(appElement)

    const view = new View(document, undefined)

    const project1: Project = {
      id: 'project_id_1',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const taskGroup1: TaskGroup = {
      id: 'task_group_id_1',
      title: 'title',
      description: 'description',
    }

    const taskGroup2: TaskGroup = {
      id: 'task_group_id_2',
      title: 'title',
      description: 'description',
    }

    const taskGroup3: TaskGroup = {
      id: 'task_group_id_3',
      title: 'title',
      description: 'description',
    }

    const task1: Task = {
      id: 'task_id_1',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const task2: Task = {
      id: 'task_id_2',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    const task3: Task = {
      id: 'task_id_3',
      title: 'title',
      description: "description",
      dueDate: new Date(),
    }

    view.appendProject(project1)
    view.appendTaskGroup(project1, taskGroup1)
    view.appendTaskGroup(project1, taskGroup2)
    view.appendTaskGroup(project1, taskGroup3)
    view.appendTask(taskGroup1, task1)
    view.appendTask(taskGroup1, task2)
    view.appendTask(taskGroup1, task3)

    let p = pretty(dom.serialize())
    console.log(p)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', undefined)
    const taskGroupList = document.getElementById('project_id_1').children[1]
    const taskGroupElement1 = taskGroupList.children[0]
    const taskGroupElement2 = taskGroupList.children[1]
    const taskGroupElement3 = taskGroupList.children[2]
    const taskGroupElement1TaskList = taskGroupElement1.children[1]
    const taskGroupElement2TaskList = taskGroupElement2.children[1]
    const taskGroupElement3TaskList = taskGroupElement3.children[1]

    expect(taskGroupElement1TaskList.children[0].id).equals('task_id_2')
    expect(taskGroupElement1TaskList.children[1].id).equals('task_id_3')
    expect(taskGroupElement1TaskList.children[2]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_2', 'task_group_id_2', 'task_id_1')

    expect(taskGroupElement1TaskList.children[0].id).equals('task_id_3')
    expect(taskGroupElement1TaskList.children[1]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[2]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_3', 'task_group_id_2', 'task_id_2')

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3')

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_2', 'task_group_id_3', undefined)

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[2]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0].id).equals('task_id_2')
    expect(taskGroupElement3TaskList.children[1]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_2', 'task_group_id_2', 'task_id_1')

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', 'task_id_3')

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', 'task_id_2')

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', undefined)

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', 'task_id_2')

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    view.moveTask('project_id_1', 'task_id_1', 'task_group_id_2', undefined)

    expect(taskGroupElement1TaskList.children[0]).equals(undefined)

    expect(taskGroupElement2TaskList.children[0].id).equals('task_id_1') 
    expect(taskGroupElement2TaskList.children[1].id).equals('task_id_2') 
    expect(taskGroupElement2TaskList.children[2].id).equals('task_id_3') 
    expect(taskGroupElement2TaskList.children[3]).equals(undefined)

    expect(taskGroupElement3TaskList.children[0]).equals(undefined)

    p = pretty(dom.serialize())
    console.log(p)
  })
})