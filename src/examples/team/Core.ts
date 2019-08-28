import { UserId } from '../../TableFlowMessages'

export type Title = string
export type Description = string

/**
 * Project
 */
export type ProjectId = string
export const projectTableId = 'project_table_id'

export interface ProjectRow {
  id: ProjectId
  title: Title
  description: Description
  dueDate: Date
}

export enum ProjectTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  DueDate = 'dueDate',
}

export const projectTableColumns = [
  ProjectTableColumnName.Id,
  ProjectTableColumnName.Title, 
  ProjectTableColumnName.Description,
  ProjectTableColumnName.DueDate,
]

/**
 * Task Group
 */
export type TaskGroupId = string

export const taskGroupTableId = 'task_group_table_id'

export interface TaskGroupRow {
  id: TaskGroupId
  title: Title
  description: Description
  projectId: ProjectId
}

export enum TaskGroupTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  ProjectId = 'projectId',
}

export const taskGroupTableColumns = [
  TaskGroupTableColumnName.Id,
  TaskGroupTableColumnName.Title, 
  TaskGroupTableColumnName.Description,
  TaskGroupTableColumnName.ProjectId,
]

/**
 * Task
 */
export type TaskId = string

export const taskTableId = 'task_table_id'

export interface TaskRow {
  id: TaskId
  title: Title
  description: Description
  dueDate: Date
  projectId: ProjectId
  taskGroupId: TaskGroupId
}

export enum TaskTableColumnName {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  DueDate = 'dueDate',
  ProjectId = 'projectId',
  TaskGroupId = 'taskGroupId'
}

export const taskTableColumns = [
  TaskTableColumnName.Id,
  TaskTableColumnName.Title, 
  TaskTableColumnName.Description,
  TaskTableColumnName.DueDate,
  TaskTableColumnName.ProjectId,
  TaskTableColumnName.TaskGroupId,
]

/**
 * Asset
 */
export type AssetId = string
export type AssetName = string
export type AssetType = string

export const assetTableId = 'asset_table_id'

export interface AssetRow {
  id: AssetId
  name: AssetName
  type: AssetType 
  description: Description
  creatorId: UserId
  creationTime: Date
  updatorId: UserId
  updateTime: Date
  content: any
}

export enum AssetTableColumnName {
  Id = 'id',
  Name = 'name',
  Type = 'type',
  Description = 'description',
  CreatorId = 'creatorId',
  CreationTime = 'creationTime',
  UpdatorId = 'updatorId',
  UpdateTime = 'updateTime',
  Content = 'content',
}

export const assetTableColumns = [
  AssetTableColumnName.Id,
  AssetTableColumnName.Name,
  AssetTableColumnName.Type,
  AssetTableColumnName.Description,
  AssetTableColumnName.CreatorId,
  AssetTableColumnName.CreationTime,
  AssetTableColumnName.UpdatorId,
  AssetTableColumnName.UpdateTime,
  AssetTableColumnName.Content,
]
