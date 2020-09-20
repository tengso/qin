import {Client} from '../../TableFlowClient'
import {GenericTableCallback} from './Common'
import {ErrorCode, RowId} from "../../TableFlowMessages";

const uuid = require('uuid')
const tableId = 'action_table_v1_id'

const host = 'hv1'
const port = 8080
const user = 'hv_action_client'
const password = 'hv_action_client'

class ActionCallback extends GenericTableCallback {
    constructor(user, password, tableId) {
        super(user, password, tableId)
    }

    appendRowSuccess = (rowId: RowId) => {
        console.log(`appended row ${rowId}`)
    }

    appendRowFailure = (rowId: RowId, errorCode: ErrorCode, reason: string) => {
        console.log(`failed to appended row ${rowId} ${reason}`)
    }
}

const client = new Client(WebSocket)
const callback = new ActionCallback(user, password, tableId)
client.addCallback(callback)
client.connect(host, port)

const sendUnwindAction = (strategy) => {
    const name = 'unwind_risk'
    const sender = user

    const now = new Date()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')
    const microSecond = (now.getMilliseconds() * 1000).toString().padStart(6, '0')
    const sentTime =  `${now.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}.${microSecond}`

    const content = JSON.stringify({strategy: strategy})
    const rowId = uuid()
    const values = [name, content, sender, sentTime]
    client.appendRow(tableId, rowId, values)
}

window['sendUnwindAction'] = sendUnwindAction

