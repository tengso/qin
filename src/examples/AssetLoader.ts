import { Client, DefaultClientCallback } from '../TableFlowClient'
import { UserId, TableId, RowId, ColumnValue, ErrorCode, SessionId } from '../TableFlowMessages'
import { AssetTableColumnName, AssetId, AssetName, AssetRow, AssetType, AssetTableColumns } from './team/Core'

const uuid = require('uuid/v4')


const userId: UserId = 'root'
const password = 'root'

class Callback extends DefaultClientCallback {
  client: Client

  constructor(client: Client) {
    super()
    this.client = client
  }

  loginSuccess = (sessionId: SessionId) => {
    this.client.subscribeTables()
  }

  appendRow = (tableId: TableId, rowId: RowId, values: Object[]) => {
    console.log(`appended: ${tableId}, ${rowId}`)

    const image = document.getElementById('image') as HTMLImageElement
    if (image) {
      const i = AssetTableColumns.indexOf(AssetTableColumnName.Content)
      console.log(i)
      console.log(values.length)
      const content = values[i] as string
      image.src = content
    }
    else {
      console.log(`image element not found`)
    }
  }

  removeRow = (rowId: RowId, tableId: TableId, values: ColumnValue[]) => {
    console.log(`removed: ${tableId}, ${rowId}`)

  }

  connectSuccess = (client: Client) => {
    console.log('connect success')
    client.login(userId, password)
  }


  loginFailure = (errorCode: ErrorCode, reason: string) => {
    console.log(`login failure ${reason} ${errorCode}`)

    if (errorCode === ErrorCode.UserAlreadyLogin) {
      this.client.logout()
    }
  }

  logoutSuccess = () => {
    console.log(`logout success`)
    this.client.login(this.client.userId, this.client.password)
  }
}

const client = new Client(WebSocket)
const callback = new Callback(client)
client.addCallback(callback)
client.connect('localhost', 8080)


function uploadAsset(name: AssetName, type: AssetType, description, file) {

  const tableId = 'asset_table_id'
  const rowId = uuid()
  const ts = new Date()

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = (evt) => {
    // @ts-ignore
    const content = evt.target.result
    console.log(content)

    const values = [
      rowId as AssetId,
      name as AssetName,
      type as AssetType,
      description,
      userId,
      ts,
      userId,
      ts,
      content, 
    ]

    client.appendRow(tableId, rowId, values)
  }
}

// @ts-ignore
window.uploadAsset = uploadAsset