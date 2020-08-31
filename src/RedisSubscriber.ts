import { DefaultClientCallback, Client } from './TableFlowClient'
import { Table, TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue } from './TableFlowMessages'
import { Callbacks } from './examples/team/Callback';

const uuid = require('uuid')
const WebSocket = require('ws');
const redis = require('redis')
const yargs = require('yargs')


class RedisSubscriberCallback extends DefaultClientCallback {
    private channel: string
    private callback
    private client: Client
    private tableId: string
    private user: string
    private password: string
    private redisHost
    private redisPort
    private cleanStart

    constructor(redisHost, redisPort, user: string, password: string, channel: string, callback, tableId, cleanStart) {
        super()

        this.redisHost = redisHost
        this.redisPort = redisPort
        this.channel = channel
        this.callback = callback
        this.tableId = tableId
        this.user = user
        this.password = password
        this.cleanStart = cleanStart
    }

    connectSuccess: (client: Client) => void = (client) => {
        this.client = client
        console.log('connected!!')
        client.login(this.user, this.password)
    }

    connectFailure: () => void = () => {
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log('login success')

        if (this.cleanStart == 'yes') {
            this.client.removeAllRows(this.tableId)
        }
        else {
            this.startRedisSubs()
        }
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
        if (this.cleanStart == 'yes') {
            this.startRedisSubs()
        }
    }

    startRedisSubs() {
        const cb = this.callback
        const client = this.client

        const subscriber = redis.createClient(this.redisPort, this.redisHost)

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
    const content = payload[1]
    const contract_price = content?.analysis?.futures_price
    const index_price = content?.analysis?.index_price
    const pnl = content?.risk?.pnl[symbol]
    const position = content?.risk?.position[symbol]

    console.log(ts, pnl, position, contract_price,index_price)

    const rowId = uuid()
    const values = [strategy, pnl, position, contract_price, index_price, ts]

    // console.log(values)
    client.appendRow(tableId, rowId, values)
}

export class RedisSubscriber {
    private client = new Client(WebSocket)

    constructor(redisHost, redisPort, user, password, channel, callback, tableId, cleanStart) {
        this.client.addCallback(new RedisSubscriberCallback(redisHost, redisPort, user, password, channel, callback, tableId, 
            cleanStart))
        this.client.connect('127.0.0.1', 8080)
    }
}

const date = new Date()
const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date) 
const today =  `${year}${month}${day}`

const strategy = 'dawn'
const channel = `strategy_${strategy}_${today}_analytics_channel`
const tableId = 'strategy_table_v4_id'
const user = 'hv'
const password = 'hv'

const redisHost = yargs.argv.redisHost ? yargs.argv.redisHost : 'localhost'
const redisPort = yargs.argv.redisPort ? yargs.argv.redisPort : 6381
const symbol = yargs.argv.symbol ? yargs.argv.symbol : 'HK.HSI2009'

const cleanStart = yargs.argv.cleanStart ? yargs.argv.cleanStart : 'no'

new RedisSubscriber(redisHost, redisPort, user, password, channel, callback, tableId, cleanStart)





