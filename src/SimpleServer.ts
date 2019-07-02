import { MessageType as mt, SessionId, UserId, TableColumn, TableRow, TableId, RowId, ColumnIndex, ColumnType, LogoutRequest, AddTableFailure, AddTableSuccess, RemoveTableFailure, RemoveTableSuccess, AddRowSuccess, AddRowFailure, RemoveRowFailure, RemoveRowSuccess, UpdateCellFailure, UpdateCellSuccess} from "./Core"
import { LoginFailure, LoginSuccess, LogoutFailure, LogoutSuccess, AddUserSuccess, AddUserFailure, RemoveUserSuccess, RemoveUserFailure } from './Core'
import { Request, AddUserRequest, RemoveUserRequest, Message, LoginRequest, AddTableRequest, RemoveTableRequest } from './Core'
import { AddRowRequest, RemoveRowRequest, UpdateCellRequest } from './Core'
import { Server } from 'ws'

class SimpleServer {
  constructor(port: number) {
    const wss = new Server({ port: 8080 })
    wss.on('connection', this.handleConnection)
  }

  handleConnection = (ws): void => {
    ws.on('message', msg => {
      // const message = JSON.parse(msg.toString())
      const response = this.handleMessage(ws, msg as Message)
    })
  }
      
  handleMessage = (ws, message: Message): void => {
    if (message.type === mt.Login) {
      // @ts-ignore
      let payload = message.payLoad as LoginRequest
      let {userId, password} = payload
      ws.send(this.login(userId, password))
      return
    }
    else if (message.type === mt.Logout) {
      // @ts-ignore
      let payload = message.payLoad as LogoutRequest
      let {userId, sessionId} = payload
      ws.send(this.logout(userId, sessionId))
      return
    }

    let request = message.payLoad as Request
    let {sessionId, requestId} = request

    // FIXME: check sessionId

    switch (message.type) {
      case mt.AddUser: {
        // @ts-ignore
        let payload = message.payLoad as AddUserRequest
        let {newUserId, newUserName, newUserPassword} = payload
        ws.send(this.addUser(newUserId, newUserName, newUserPassword))
        break
      }
      case mt.RemoveUser: {
        // @ts-ignore
        let payload = message.payLoad as RemoveUserRequest
        let {userId} = payload
        ws.send(this.removeUser(userId))
        break
      }
      case mt.AddTable: {
        // @ts-ignore
        let payload = message.payLoad as AddTableRequest
        let {tableId, tableName, columns, ownerId} = payload
        ws.send(this.addTable(tableId, tableName, columns, ownerId))
        break
      }
      case mt.RemoveTable: {
        // @ts-ignore
        let payload = message.payLoad as RemoveTableRequest
        let {tableId} = payload
        ws.send(this.removeTable(tableId))
        break
      }
      case mt.AddRow: {
        // @ts-ignore
        let payload = message.payLoad as AddRowRequest
        let {row} = payload
        ws.send(this.addRow(row))
        break
      }
      case mt.RemoveRow: {
        // @ts-ignore
        let payload = message.payLoad as RemoveRowRequest
        let {rowId} = payload
        ws.send(this.removeRow(rowId))
        break
      }
      case mt.UpdateCell: {
        // @ts-ignore
        let payload = message.payLoad as UpdateCellRequest
        let {tableId, rowId, columnIndex, newValue} = payload
        ws.send(this.updateCell(tableId, rowId, columnIndex, newValue))
        break
      }
      default: {
        console.log(`Unknown Msg`)
        break
      }
    }
  }    

  login(userId: string, password: string): LoginFailure | LoginSuccess {
      throw new Error("Method not implemented.");
  }    
  
  logout(userId: UserId, sessionId: SessionId): LogoutFailure | LogoutSuccess {
      throw new Error("Method not implemented.");
  }

  addUser(userId: string, userName: string, password: string): AddUserFailure | AddUserSuccess {
      throw new Error("Method not implemented.");
  }

  removeUser(userId: string): RemoveUserFailure | RemoveUserSuccess {
      throw new Error("Method not implemented.");
  }

  addTable(tableId: string, tableName: string, tableColumns: TableColumn[], owner: string): AddTableFailure | AddTableSuccess{
      throw new Error("Method not implemented.");
  }

  removeTable(tableId: string): RemoveTableFailure | RemoveTableSuccess{
      throw new Error("Method not implemented.");
  }

  addRow(row: TableRow): AddRowSuccess | AddRowFailure {
      throw new Error("Method not implemented.");
  }

  removeRow(rowId: string): RemoveRowFailure | RemoveRowSuccess {
      throw new Error("Method not implemented.");
  }

  updateCell(tableId: TableId, rowId: RowId, columnIndex: ColumnIndex, newValue: ColumnType): UpdateCellFailure | UpdateCellSuccess{
      throw new Error("Method not implemented.");
  }
}