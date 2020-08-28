import { DefaultClientCallback, Client } from './TableFlowClient'
import { TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue } from './TableFlowMessages'
import { Callbacks } from './examples/team/Callback';

const uuid = require('uuid')

const WebSocket = require('ws');
const redis = require('redis')


class RedisSubscriberCallback extends DefaultClientCallback {
    private channel: String
    private callback
    private client
    private tableId

    constructor(channel: String, callback, tableId) {
        super()
        this.channel = channel
        this.callback = callback
        this.tableId = tableId
    }

    connectSuccess: (client: Client) => void = (client) => {
        this.client = client
        console.log('connected!!')
        client.login('hv', 'hv')
    }

    connectFailure: () => void = () => {
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log('login success')

        this.client.removeAllRows(this.tableId)

    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(`login failure ${reason}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login('hv', 'hv')
    }

    logoutFailure: (reason: string) => void = reason => {
        console.log(`logout failure ${reason}`)
    }

    removeAllRows: (tableId: TableId) => void = tableId => {

    }

    removeAllRowsSuccess: () => void = () => {
        const cb = this.callback
        const client = this.client

        const subscriber = redis.createClient(6381)

        subscriber.subscribe(this.channel);

        console.log(`subscribe to ${this.channel}`)

        subscriber.on("message", function(channel, message) {
            cb(channel, message, client) 
        });
    }

    removeAllRowsFailure: (errorCode: ErrorCode, reason: string) => void = (errorCode, reason) => {
        console.log(`remove all rows failure ${errorCode} ${reason}`)
    }
}

const callback = (channel, message, client) => {
    const data = JSON.parse(message)
    console.log(data)
    // console.log("Message '" + data + "' on channel '" + channel + "' arrived!")
    const payload = data[1]
    const ts = payload[0]
    const analysis = payload[1]
    // // console.log(ts, analysis)
    const pnl = analysis['pnl'][symbol]
    const position = analysis['position'][symbol]
    console.log(ts, pnl, position)
    // client.updateCell(tableId, rowId, 'pnl', pnl)
    // client.updateCell(tableId, rowId, 'position', position)
    const rowId = uuid()
    const values = [strategy, pnl, position, ts]
    client.appendRow(tableId, rowId, values)
}

export class RedisSubscriber {
    private client = new Client(WebSocket)

    constructor(channel, callback, tableId) {
        this.client.addCallback(new RedisSubscriberCallback(channel, callback, tableId))
        this.client.connect('127.0.0.1', 8080)
    }
}

const strategy = 'dawn'
const today =  '20200828'
const channel = `strategy_${strategy}_${today}_analytics_channel`
const symbol = 'HK.HSI2008'
const tableId = 'strategy_table_v2_id'

new RedisSubscriber(channel, callback, tableId)





