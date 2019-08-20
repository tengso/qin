import { expect } from 'chai'
import { describe } from 'mocha'
import { Model } from '../examples/team/Model'
import { ProjectRow, TaskGroupRow, TaskRow } from '../examples/team/Core'

before(() => {
})

after(() => {
})

describe('Test Model', function() {
  it('test append', function() {
    const model = new Model()

    const projectRow1: ProjectRow = {
      id: 'project_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
    }

    const projectRow2: ProjectRow = {
      id: 'project_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
    }

    const projectRow3: ProjectRow = {
      id: 'project_id_3',
      title: 'title_3',
      description: 'desc_3',
      dueDate: new Date(),
    }

    model.appendProject(projectRow1)
    model.appendProject(projectRow2)
    model.appendProject(projectRow3)

    const taskGroupRow1: TaskGroupRow = {
      id: 'task_group_id_1',
      title: 'title_1',
      description: 'desc_1',
      projectId: 'project_id_1'
    }

    const taskGroupRow2: TaskGroupRow = {
      id: 'task_group_id_2',
      title: 'title_2',
      description: 'desc_2',
      projectId: 'project_id_2'
    }

    const taskGroupRow3: TaskGroupRow = {
      id: 'task_group_id_3',
      title: 'title_3',
      description: 'desc_3',
      projectId: 'project_id_3'
    }

    model.appendTaskGroup(taskGroupRow1)
    model.appendTaskGroup(taskGroupRow2)
    model.appendTaskGroup(taskGroupRow3)

    const taskRow1: TaskRow = {
      id: 'task_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow2: TaskRow = {
      id: 'task_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
      projectId: 'project_id_2',
      taskGroupId: 'task_group_id_2',
    }

    const taskRow3: TaskRow = {
      id: 'task_id_3',
      title: 'title_3',
      description: 'desc_3',
      dueDate: new Date(),
      projectId: 'project_id_3',
      taskGroupId: 'task_group_id_3',
    }

    model.appendTask(taskRow1)
    model.appendTask(taskRow2)
    model.appendTask(taskRow3)

    expect(model.getProjectIdByTaskGroupId('task_group_id_1')).equal('project_id_1')
    expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal('project_id_2')
    expect(model.getProjectIdByTaskGroupId('task_group_id_3')).equal('project_id_3')
    expect(model.getProjectIdByTaskId('task_id_1')).equal('project_id_1')
    expect(model.getProjectIdByTaskId('task_id_2')).equal('project_id_2')
    expect(model.getProjectIdByTaskId('task_id_3')).equal('project_id_3')
    expect(model.getProjectIdByTaskGroupId('xyz')).equal(undefined)
    expect(model.getProjectIdByTaskId('xyz')).equal(undefined)
    expect(model.getTaskByIndex('project_id_1', 'task_group_id_1', 0).id).equals('task_id_1')
    expect(model.getTaskByIndex('project_id_2', 'task_group_id_2', 0).id).equals('task_id_2')
    expect(model.getTaskByIndex('project_id_3', 'task_group_id_3', 0).id).equals('task_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equals('task_group_id_1')
    expect(model.getTaskGroupByIndex('project_id_2', 0).id).equals('task_group_id_2')
    expect(model.getTaskGroupByIndex('project_id_3', 0).id).equals('task_group_id_3')
  })

  it('test append 2', function() {
    const model = new Model()

    const projectRow1: ProjectRow = {
      id: 'project_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
    }

    const projectRow2: ProjectRow = {
      id: 'project_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
    }

    model.appendProject(projectRow1)
    model.appendProject(projectRow2)

    const taskGroupRow1: TaskGroupRow = {
      id: 'task_group_id_1',
      title: 'title_1',
      description: 'desc_1',
      projectId: 'project_id_1'
    }

    const taskGroupRow2: TaskGroupRow = {
      id: 'task_group_id_2',
      title: 'title_2',
      description: 'desc_2',
      projectId: 'project_id_1'
    }

    const taskGroupRow3: TaskGroupRow = {
      id: 'task_group_id_3',
      title: 'title_3',
      description: 'desc_3',
      projectId: 'project_id_1'
    }

    model.appendTaskGroup(taskGroupRow1)
    model.appendTaskGroup(taskGroupRow2)
    model.appendTaskGroup(taskGroupRow3)

    const taskRow1: TaskRow = {
      id: 'task_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow2: TaskRow = {
      id: 'task_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow3: TaskRow = {
      id: 'task_id_3',
      title: 'title_3',
      description: 'desc_3',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    model.appendTask(taskRow1)
    model.appendTask(taskRow2)
    model.appendTask(taskRow3)

    expect(model.getProjectIdByTaskGroupId('task_group_id_1')).equal('project_id_1')
    expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal('project_id_1')
    expect(model.getProjectIdByTaskGroupId('task_group_id_3')).equal('project_id_1')
    expect(model.getProjectIdByTaskId('task_id_1')).equal('project_id_1')
    expect(model.getProjectIdByTaskId('task_id_2')).equal('project_id_1')
    expect(model.getProjectIdByTaskId('task_id_3')).equal('project_id_1')
    expect(model.getProjectIdByTaskGroupId('xyz')).equal(undefined)
    expect(model.getProjectIdByTaskId('xyz')).equal(undefined)
    expect(model.getTaskByIndex('project_id_1', 'task_group_id_1', 0).id).equals('task_id_1')
    expect(model.getTaskByIndex('project_id_1', 'task_group_id_1', 1).id).equals('task_id_2')
    expect(model.getTaskByIndex('project_id_1', 'task_group_id_1', 2).id).equals('task_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equals('task_group_id_1')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equals('task_group_id_2')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equals('task_group_id_3')
  })

  it('test remove', function() {
    const model = new Model()

    const projectRow1: ProjectRow = {
      id: 'project_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
    }

    const projectRow2: ProjectRow = {
      id: 'project_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
    }

    model.appendProject(projectRow1)
    model.appendProject(projectRow2)

    const taskGroupRow1: TaskGroupRow = {
      id: 'task_group_id_1',
      title: 'title_1',
      description: 'desc_1',
      projectId: 'project_id_1'
    }

    const taskGroupRow2: TaskGroupRow = {
      id: 'task_group_id_2',
      title: 'title_2',
      description: 'desc_2',
      projectId: 'project_id_1'
    }

    const taskGroupRow3: TaskGroupRow = {
      id: 'task_group_id_3',
      title: 'title_3',
      description: 'desc_3',
      projectId: 'project_id_1'
    }

    model.appendTaskGroup(taskGroupRow1)
    model.appendTaskGroup(taskGroupRow2)
    model.appendTaskGroup(taskGroupRow3)

    const taskRow1: TaskRow = {
      id: 'task_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow2: TaskRow = {
      id: 'task_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow3: TaskRow = {
      id: 'task_id_3',
      title: 'title_3',
      description: 'desc_3',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    model.appendTask(taskRow1)
    model.appendTask(taskRow2)
    model.appendTask(taskRow3)

    expect(model.getProject('project_id_2').id).equal('project_id_2')
    model.removeProject('project_id_2')
    expect(model.getProject('project_id_2')).equal(undefined)

    expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal('project_id_1')
    model.removeTaskGroup('project_id_1', 'task_group_id_2')
    expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal(undefined)

    expect(model.getProjectIdByTaskId('task_id_1')).equal('project_id_1')
    model.removeTask('project_id_1', 'task_group_id_1', 'task_id_1')
    expect(model.getProjectIdByTaskId('task_id_1')).equal(undefined)
  })

  it('test move', function() {
    const model = new Model()

    const projectRow1: ProjectRow = {
      id: 'project_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
    }

    const projectRow2: ProjectRow = {
      id: 'project_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
    }

    model.appendProject(projectRow1)
    model.appendProject(projectRow2)

    const taskGroupRow1: TaskGroupRow = {
      id: 'task_group_id_1',
      title: 'title_1',
      description: 'desc_1',
      projectId: 'project_id_1'
    }

    const taskGroupRow2: TaskGroupRow = {
      id: 'task_group_id_2',
      title: 'title_2',
      description: 'desc_2',
      projectId: 'project_id_1'
    }

    const taskGroupRow3: TaskGroupRow = {
      id: 'task_group_id_3',
      title: 'title_3',
      description: 'desc_3',
      projectId: 'project_id_1'
    }

    model.appendTaskGroup(taskGroupRow1)
    model.appendTaskGroup(taskGroupRow2)
    model.appendTaskGroup(taskGroupRow3)

    const taskRow1: TaskRow = {
      id: 'task_id_1',
      title: 'title_1',
      description: 'desc_1',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow2: TaskRow = {
      id: 'task_id_2',
      title: 'title_2',
      description: 'desc_2',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    const taskRow3: TaskRow = {
      id: 'task_id_3',
      title: 'title_3',
      description: 'desc_3',
      dueDate: new Date(),
      projectId: 'project_id_1',
      taskGroupId: 'task_group_id_1',
    }

    model.appendTask(taskRow1)
    model.appendTask(taskRow2)
    model.appendTask(taskRow3)

    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equal('task_group_id_1')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equal('task_group_id_2')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equal('task_group_id_3')

    model.moveTaskGroup('project_id_1', 'task_group_id_1', 'task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equal('task_group_id_2')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equal('task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equal('task_group_id_1')

    model.moveTaskGroup('project_id_1', 'task_group_id_2', 'task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equal('task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equal('task_group_id_2')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equal('task_group_id_1')

    model.moveTaskGroup('project_id_1', 'task_group_id_1', 'task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equal('task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equal('task_group_id_1')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equal('task_group_id_2')

    model.moveTaskGroup('project_id_1', 'task_group_id_1', undefined)
    expect(model.getTaskGroupByIndex('project_id_1', 0).id).equal('task_group_id_1')
    expect(model.getTaskGroupByIndex('project_id_1', 1).id).equal('task_group_id_3')
    expect(model.getTaskGroupByIndex('project_id_1', 2).id).equal('task_group_id_2')

    // // 2, 3, 1 => 3, 2, 1
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // model.moveTaskGroup('project_id_1', taskGroup.id, 'task_group_id_3')
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // expect(taskGroup.id).equals('task_group_id_3')

    // // 3, 2, 1 => 3, 1, 2
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 2)
    // model.moveTaskGroup('project_id_1', taskGroup.id, 'task_group_id_3')
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 1)
    // expect(taskGroup.id).equals('task_group_id_1')

    // // 3, 2, 1 => 1, 2, 3
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // model.moveTaskGroup('project_id_1', taskGroup.id, 'task_group_id_3')
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // expect(taskGroup.id).equals('task_group_id_1')

    // // 1, 2, 3 => 1, 2, 3
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // model.moveTaskGroup('project_id_1', taskGroup.id, 'task_group_id_3')
    // taskGroup = model.getTaskGroupByIndex('project_id_1', 0)
    // expect(taskGroup.id).equals('task_group_id_1')

    // expect(model.getProject('project_id_2').id).equal('project_id_2')
    // model.removeProject('project_id_2')
    // expect(model.getProject('project_id_2')).equal(undefined)

    // expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal('project_id_1')
    // model.removeTaskGroup('project_id_1', 'task_group_id_2')
    // expect(model.getProjectIdByTaskGroupId('task_group_id_2')).equal(undefined)

    // expect(model.getProjectIdByTaskId('task_id_1')).equal('project_id_1')
    // model.removeTask('project_id_1', 'task_group_id_1', 'task_id_1')
    // expect(model.getProjectIdByTaskId('task_id_1')).equal(undefined)
  })
})