import {Client} from '../../TableFlowClient'
import {GenericTableCallback} from './Common'
import {ErrorCode, RowId} from "../../TableFlowMessages";

const uuid = require('uuid')


function getDateTime() {
    const now = new Date()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')
    const microSecond = (now.getMilliseconds() * 1000).toString().padStart(6, '0')
    return `${now.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}.${microSecond}`
}

function  pegOrderAction(strategy) {
    const name = 'peg_order'
    const sender = user
    const sentTime = getDateTime()

    const symbol = (document.getElementById('peg_symbol') as HTMLInputElement).value
    const side = (document.getElementById('peg_side') as HTMLInputElement).value
    const pegType = (document.getElementById('peg_type') as HTMLInputElement).value
    const offset = Number((document.getElementById('peg_offset') as HTMLInputElement).value)
    const quantity = Math.min(1, Number((document.getElementById('peg_quantity') as HTMLInputElement).value))
    const content = JSON.stringify({
        strategy: strategy, peg_type: pegType, offset: offset, quantity: quantity, side: side, symbol: symbol
    })
    const values = [name, content, sender, sentTime]
    const rowId = uuid()
    client.appendRow(tableId, rowId, values)
}


class Callback extends GenericTableCallback {
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

window['pegOrderAction'] = pegOrderAction

const tableId = 'action_table_v1_id'
const host = 'localhost'
const port = 8080
const user = 'hv_action_client'
const password = 'hv_action_client'

const client = new Client(WebSocket)
const callback = new Callback(user, password, tableId)
client.addCallback(callback)
client.connect(host, port)
