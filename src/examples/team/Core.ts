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
