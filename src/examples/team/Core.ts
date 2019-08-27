export const projectTableId = 'project_table_id'
export const taskGroupTableId = 'task_group_table_id'
export const taskTableId = 'task_table_id'

export type ProjectId = string
export type TaskGroupId = string
export type TaskId = string

export type Title = string
export type Description = string

export interface ProjectRow {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date
}

export interface TaskGroupRow {
  id: TaskGroupId
  title: Title
  description: Description
  projectId: ProjectId
}

export interface TaskRow {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
  projectId: ProjectId
  taskGroupId: TaskGroupId
}

export enum ProjectTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  DueDate = 'dueDate',
}

export enum TaskGroupTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  ProjectId = 'projectId',
}

export enum TaskTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  DueDate = 'dueDate',
  ProjectId = 'projectId',
  TaskGroupId = 'taskGroupId'
}

export const projectTableColumns = [
  ProjectTableColumnName.Id,
  ProjectTableColumnName.Title, 
  ProjectTableColumnName.Description,
  ProjectTableColumnName.DueDate,
]

export const taskGroupTableColumns = [
  TaskGroupTableColumnName.Id,
  TaskGroupTableColumnName.Title, 
  TaskGroupTableColumnName.Description,
  TaskGroupTableColumnName.ProjectId,
]

export const taskTableColumns = [
  TaskTableColumnName.Id,
  TaskTableColumnName.Title, 
  TaskTableColumnName.Description,
  TaskTableColumnName.DueDate,
  TaskTableColumnName.ProjectId,
  TaskTableColumnName.TaskGroupId,
]

