const jsdom = require('jsdom')
const pretty = require('pretty')

const { JSDOM } = jsdom

const dom = new JSDOM('<!DOCTYPE html><head/><body></body>', {
  url: 'http://localhost/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  userAgent: 'Mellblomenator/9000',
  includeNodeLocations: true,
  storageQuota: 10000000,
})
// @ts-ignore
global.window = dom.window
// @ts-ignore
global.document = window.document
// @ts-ignore
global.navigator = window.navigator

import { expect } from 'chai'
import { describe } from 'mocha'
import { Model } from '../examples/team/Model'
import { View } from '../examples/team/View'
import { Control } from '../examples/team/Control'
import { ProjectRow, TaskGroupRow, TaskRow } from '../examples/team/Core'

before(() => {
})

after(() => {
})

describe('Test Control', function() {
  it('test project', function() {
    const dom = new JSDOM()
    const { document } = dom.window 
    const appElement = document.createElement('div')
    appElement.setAttribute('id', 'app')
    document.body.appendChild(appElement)
    const client = undefined

    const control = new Control(client, document)
    const tableId = 'project_table_id'
    const rowId = 'project_id'

    const values = [
      rowId,
      'title',
      'description',
      new Date(),
    ]

    control.appendRow(tableId, rowId, values)
    // @ts-ignore
    const project = control.model.getProject(rowId)
    expect(project.id).equals(rowId)

    // TODO: test view
  })

  it('test task group', function() {
    const dom = new JSDOM()
    const { document } = dom.window 
    const appElement = document.createElement('div')
    appElement.setAttribute('id', 'app')
    document.body.appendChild(appElement)
    const client = undefined

    const control = new Control(client, document)

    const projectTableId = 'project_table_id'
    const projectRowId = 'project_id'
    const projectValues = [
      projectRowId,
      'title',
      'description',
      new Date(),
    ]

    control.appendRow(projectTableId, projectRowId, projectValues)

    const taskGroupTableId = 'task_group_table_id'

    const taskGroupRowId1 = 'task_group_id_1'
    const taskGroupValues1 = [
      taskGroupRowId1,
      'title',
      'description',
      projectRowId, 
    ]

    const taskGroupRowId2 = 'task_group_id_2'
    const taskGroupValues2 = [
      taskGroupRowId2,
      'title',
      'description',
      projectRowId, 
    ]

    control.appendRow(taskGroupTableId, taskGroupRowId1, taskGroupValues1)
    control.appendRow(taskGroupTableId, taskGroupRowId2, taskGroupValues2)

    // @ts-ignore
    const taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    // @ts-ignore
    const taskGroup2 = control.model.getProject(projectRowId).getTaskGroupByIndex(1)
    expect(taskGroup2.id).equals(taskGroupRowId2)

    control.moveRowAndUpdateCell(taskGroupTableId, taskGroupRowId1, taskGroupRowId2, undefined, undefined)

    // @ts-ignore
    const taskGroup2 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup2.id).equals(taskGroupRowId2)

    // @ts-ignore
    const taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(1)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    control.removeRow(taskGroupRowId1, taskGroupTableId, taskGroupValues1)

    // @ts-ignore
    const taskGroup2 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup2.id).equals(taskGroupRowId2)

    // @ts-ignore
    const taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(1)
    expect(taskGroup1).equals(undefined)
  })

  it('test task', function() {
    const dom = new JSDOM()
    const { document } = dom.window 
    const appElement = document.createElement('div')
    appElement.setAttribute('id', 'app')
    document.body.appendChild(appElement)
    const client = undefined

    const control = new Control(client, document)

    const projectTableId = 'project_table_id'
    const projectRowId = 'project_id'
    const projectValues = [
      projectRowId,
      'title',
      'description',
      new Date(),
    ]

    control.appendRow(projectTableId, projectRowId, projectValues)

    const taskGroupTableId = 'task_group_table_id'

    const taskGroupRowId1 = 'task_group_id_1'
    const taskGroupValues1 = [
      taskGroupRowId1,
      'title',
      'description',
      projectRowId, 
    ]

    const taskGroupRowId2 = 'task_group_id_2'
    const taskGroupValues2 = [
      taskGroupRowId2,
      'title',
      'description',
      projectRowId, 
    ]

    control.appendRow(taskGroupTableId, taskGroupRowId1, taskGroupValues1)
    control.appendRow(taskGroupTableId, taskGroupRowId2, taskGroupValues2)

    const taskTableId = 'task_table_id'

    const taskRowId1 = 'task_id_1'
    const taskValues1 = [
      taskRowId1,
      'title',
      'description',
      new Date(),
      projectRowId,
      taskGroupRowId1
    ]

    const taskRowId2 = 'task_id_2'
    const taskValues2 = [
      taskRowId2,
      'title',
      'description',
      new Date(),
      projectRowId,
      taskGroupRowId1
    ]
    
    const taskRowId3 = 'task_id_3'
    const taskValues3 = [
      taskRowId3,
      'title',
      'description',
      new Date(),
      projectRowId,
      taskGroupRowId1
    ]

    control.appendRow(taskTableId, taskRowId1, taskValues1)
    control.appendRow(taskTableId, taskRowId2, taskValues2)
    control.appendRow(taskTableId, taskRowId3, taskValues3)

    // @ts-ignore
    let taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    let task1 = taskGroup1.getTaskByIndex(0)
    expect(task1.id).equals(taskRowId1)

    let task2 = taskGroup1.getTaskByIndex(1)
    expect(task2.id).equals(taskRowId2)

    let task3 = taskGroup1.getTaskByIndex(2)
    expect(task3.id).equals(taskRowId3)

    control.moveRowAndUpdateCell(taskTableId, taskRowId1, taskRowId2, 5, taskGroupRowId1)

    // @ts-ignore
    taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    task2 = taskGroup1.getTaskByIndex(0)
    expect(task2.id).equals(taskRowId2)

    task1 = taskGroup1.getTaskByIndex(1)
    expect(task1.id).equals(taskRowId1)

    task3 = taskGroup1.getTaskByIndex(2)
    expect(task3.id).equals(taskRowId3)

    control.moveRowAndUpdateCell(taskTableId, taskRowId1, undefined, 5, taskGroupRowId1)

    // @ts-ignore
    taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    task1 = taskGroup1.getTaskByIndex(0)
    expect(task1.id).equals(taskRowId1)

    task2 = taskGroup1.getTaskByIndex(1)
    expect(task2.id).equals(taskRowId2)

    task3 = taskGroup1.getTaskByIndex(2)
    expect(task3.id).equals(taskRowId3)

    control.moveRowAndUpdateCell(taskTableId, taskRowId2, undefined, 5, taskGroupRowId1)

    // @ts-ignore
    const taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    task2 = taskGroup1.getTaskByIndex(0)
    expect(task2.id).equals(taskRowId2)

    task1 = taskGroup1.getTaskByIndex(1)
    expect(task1.id).equals(taskRowId1)

    task3 = taskGroup1.getTaskByIndex(2)
    expect(task3.id).equals(taskRowId3)

    control.moveRowAndUpdateCell(taskTableId, taskRowId2, undefined, 5, taskGroupRowId2)

    // @ts-ignore
    taskGroup1 = control.model.getProject(projectRowId).getTaskGroupByIndex(0)
    expect(taskGroup1.id).equals(taskGroupRowId1)

    // @ts-ignore
    let taskGroup2 = control.model.getProject(projectRowId).getTaskGroupByIndex(1)
    expect(taskGroup2.id).equals(taskGroupRowId2)

    task1 = taskGroup1.getTaskByIndex(0)
    expect(task1.id).equals(taskRowId1)

    task3 = taskGroup1.getTaskByIndex(1)
    expect(task3.id).equals(taskRowId3)

    task2 = taskGroup2.getTaskByIndex(0)
    expect(task2.id).equals(taskRowId2)

    control.removeRow(taskRowId1, taskTableId, taskValues1)

    task3 = taskGroup1.getTaskByIndex(0)
    expect(task3.id).equals(taskRowId3)

    const task = taskGroup1.getTaskByIndex(1)
    expect(task).equals(undefined)

    task2 = taskGroup2.getTaskByIndex(0)
    expect(task2.id).equals(taskRowId2)
  })
})
