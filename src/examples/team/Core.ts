import { UserId } from '../../TableFlowMessages'

export type Title = string
export type Description = string

/**
 * Project
 */
export type ProjectId = string
export const ProjectTableId = 'project_table_id'

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

export const ProjectTableColumns = [
  ProjectTableColumnName.Id,
  ProjectTableColumnName.Title, 
  ProjectTableColumnName.Description,
  ProjectTableColumnName.DueDate,
]

/**
 * Task Group
 */
export type TaskGroupId = string

export const TaskGroupTableId = 'task_group_table_id'

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

export const TaskGroupTableColumns = [
  TaskGroupTableColumnName.Id,
  TaskGroupTableColumnName.Title, 
  TaskGroupTableColumnName.Description,
  TaskGroupTableColumnName.ProjectId,
]

/**
 * Task
 */
export type TaskId = string

export const TaskTableId = 'task_table_id'

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

export const TaskTableColumns = [
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

export const AssetTableId = 'asset_table_id'

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

export const AssetTableColumns = [
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

/**
 * Member
 */

export const MemberTableId = 'member_table_id'

export interface MemberRow {
  id: UserId
  name: string
  title: string
  description: Description
  avatar: AssetId
}

export enum MemberTableColumnName {
  Id = 'id',
  Name = 'name',
  Title = 'title',
  Description = 'description',
  Avatar = 'avatar',
}

export const MemberTableColumns = [
  MemberTableColumnName.Id,
  MemberTableColumnName.Name,
  MemberTableColumnName.Title,
  MemberTableColumnName.Description,
  MemberTableColumnName.Avatar,
]

/**
 * Project Member
 */

export const ProjectMemberTableId = 'project_member_table_id'

export interface ProjectMemberRow {
  memberId: UserId
  projectId: ProjectId
}

export enum ProjectMemberTableColumnName {
  MemberId = 'memberId',
  ProjectId = 'projectId',
}

export const ProjectMemberTableColumns = [
  ProjectMemberTableColumnName.MemberId,
  ProjectMemberTableColumnName.ProjectId,
]

/**
 * Task Owner
 */

export const TaskOwnerTableId = 'task_owner_table_id'

export interface TaskOwnerRow {
  ownerId: UserId
  taskId: TaskId
}

export enum TaskOwnerTableColumnName {
  OwnerId = 'ownerId',
  TaskId = 'taskId',
}

export const TaskOwnerTableColumns = [
  TaskOwnerTableColumnName.OwnerId,
  TaskOwnerTableColumnName.TaskId,
]

/**
 * Check List
 */

export type ItemId = string

export enum ItemStatus {
  Open = 'open',
  Closed = 'closed'
}

export const CheckListTableId = 'check_list_table_id'

export interface CheckListRow {
  id: ItemId
  projectId: ProjectId
  taskId: TaskId
  description: Description
  status: ItemStatus
}

export enum CheckListTableColumnName {
  Id = 'id',
  ProjectId = 'projectId',
  TaskId = 'taskId',
  Description = 'description',
  Status = 'status'
}

export const CheckListTableColumns = [
  CheckListTableColumnName.Id,
  CheckListTableColumnName.ProjectId,
  CheckListTableColumnName.TaskId,
  CheckListTableColumnName.Description,
  CheckListTableColumnName.Status,
]

/**
 * Chat
 */

export type MessageId = string
export type PosterId = string
export type Message = string


export const ProjectChatTableId = 'project_chat_table_id'
export const TaskChatTableId = 'task_chat_table_id'

export interface BaseChatRow {
  id: MessageId
  projectId: ProjectId
  replyToId: MessageId
  posterId: PosterId
  message: Message 
  postTime: Date
}

export interface TaskChatRow extends BaseChatRow {
  taskId: TaskId
}

export interface ProjectChatRow extends BaseChatRow {
}

export enum ChatTableColumnName {
  MessageId = 'id',
  ProjectId = 'projectId',
  ReplyToId = 'replyToId',
  PosterId = 'posterId',
  Message = 'message',
  PostTime = 'postTime',
  TaskId = 'taskId',
}

export const BaseChatTableColumns = [
  ChatTableColumnName.MessageId,
  ChatTableColumnName.ProjectId,
  ChatTableColumnName.ReplyToId,
  ChatTableColumnName.PosterId,
  ChatTableColumnName.Message,
  ChatTableColumnName.PostTime,
]

export const TaskChatTableColumns = BaseChatTableColumns.concat([ChatTableColumnName.TaskId])

export const ProjectChatTableColumns = BaseChatTableColumns
