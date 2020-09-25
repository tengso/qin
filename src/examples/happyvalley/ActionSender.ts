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

function unwindAction(strategy) {
    const name = 'unwind_risk'
    const sender = user

    const sentTime = getDateTime()

    const content = JSON.stringify({strategy: strategy})
    const rowId = uuid()
    const values = [name, content, sender, sentTime]
    client.appendRow(tableId, rowId, values)
}

function  placeOrderAction(strategy) {
    const name = 'place_order'
    const sender = user
    const sentTime = getDateTime()

    const quantity = 1
    const symbol = 'HK.MHI2009'
    const side = 'B'
    const price = Number((document.getElementById('place_order_price') as HTMLInputElement).value)
    const mark = (document.getElementById('place_order_mark') as HTMLInputElement).value
    const content = JSON.stringify({strategy: strategy, symbol: symbol, side: side, price: price, quantity: quantity, remark: mark})
    const values = [name, content, sender, sentTime]
    const rowId = uuid()
    client.appendRow(tableId, rowId, values)
}

function  cancelOrderAction(strategy) {
    const name = 'cancel_order'
    const sender = user
    const sentTime = getDateTime()

    const order_id = (document.getElementById('cancel_order_id') as HTMLInputElement).value
    const price = Number((document.getElementById('place_order_price') as HTMLInputElement).value)
    const quantity = 1
    const content = JSON.stringify({strategy: strategy, order_id: order_id, price: price, quantity: quantity})
    const values = [name, content, sender, sentTime]
    const rowId = uuid()
    client.appendRow(tableId, rowId, values)
}


function  modifyOrderAction(strategy) {
    const name = 'modify_order'
    const sender = user
    const sentTime = getDateTime()

    const order_id = (document.getElementById('modify_order_id') as HTMLInputElement).value
    const price = Number((document.getElementById('modify_order_price') as HTMLInputElement).value)
    const quantity = 1
    const content = JSON.stringify({strategy: strategy, order_id: order_id, price: price, quantity: quantity})
    const values = [name, content, sender, sentTime]
    const rowId = uuid()
    client.appendRow(tableId, rowId, values)
}

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
window['unwindAction'] = unwindAction
window['placeOrderAction'] = placeOrderAction
window['cancelOrderAction'] = cancelOrderAction
window['modifyOrderAction'] = modifyOrderAction

