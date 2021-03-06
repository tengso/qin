import { DefaultClientCallback, Client } from '../../TableFlowClient'
import { TableId, SessionId } from '../../Core'
import { ErrorCode } from '../../TableFlowMessages'

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
        client.login(this.user, this.password)
    }

    connectFailure: () => void = () => {
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log(`login as ${this.user}`)

        if (this.cleanStart == 'yes') {
            this.client.removeAllRows(this.tableId)
        }
        else {
            this.startRedisSubs()
        }
    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(`login failure ${reason} as ${this.user}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login(this.user, this.password)
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
        console.log(`connected to redis`, this.redisHost, this.redisPort)

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

const date = new Date()
const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date) 
const today =  `${year}${month}${day}`

const redisHost = yargs.argv.redisHost ? yargs.argv.redisHost : 'localhost'
const redisPort = yargs.argv.redisPort ? yargs.argv.redisPort : 6381
// const symbol = yargs.argv.symbol ? yargs.argv.symbol : 'HK.MHI2011'
const tableId = yargs.argv.tableId ? yargs.argv.tableId : 'strategy_table_v9_id'
const user = yargs.argv.user ? yargs.argv.user : 'hv'
const password = yargs.argv.password ? yargs.argv.password : 'hv'
// const strategy = yargs.argv.strategy ? yargs.argv.strategy : 'dawn'
const cleanStart = yargs.argv.cleanStart ? yargs.argv.cleanStart : 'no'
const hanHost = yargs.argv.hanHost ? yargs.argv.hanHost : 'localhost'
const hanPort = yargs.argv.hanPort ? yargs.argv.hanPort : 6383

const channel = `strategy_analytics_channel`

export class RedisSubscriber {
    private client = new Client(WebSocket)

    constructor(redisHost, redisPort, user, password, channel, callback, tableId, cleanStart) {
        this.client.addCallback(new RedisSubscriberCallback(redisHost, redisPort, user, password, channel, callback, tableId,
            cleanStart))
        this.client.connect(hanHost, hanPort)
        console.log('connected to', hanHost, hanPort)
    }
}


const callback = (channel, message, client) => {
    const data = JSON.parse(message)
    console.log(data)
    // console.log("Message '" + data + "' on channel '" + channel + "' arrived!")
    const payload = data[1]

    const ts = payload[0]
    const content = payload[1]
    const enabled = content?.enabled
    const strategy = content?.strategy

    // const pnl = content?.risk?.pnl[symbol]
    // const position = content?.risk?.position[symbol]
    //
    // const future_price = content?.analysis?.future_price
    // const index_price = content?.analysis?.index_price
    // const future_open_price = content?.analysis?.future_open_price
    // const future_price_at_stock_match_start = content?.analysis?.future_price_at_stock_match_start
    // const future_price_at_stock_match_end = content?.analysis?.future_price_at_stock_match_end
    // const index_future_spread = content?.analysis?.index_future_spread
    // const future_price_moving_average = content?.analysis?.future_price_moving_average
    // const future_price_lower_bound = content?.analysis?.future_price_lower_bound
    // const future_price_upper_bound = content?.analysis?.future_price_upper_bound
    //
    // const future_return = content?.analysis?.future_return
    // const future_return_moving_average = content?.analysis?.future_return_moving_average
    // const future_return_lower_bound = content?.analysis?.future_return_lower_bound
    // const future_return_upper_bound = content?.analysis?.future_return_upper_bound
    //
    // const trade_in_threshold = content?.analysis?.trade_in_threshold
    // const take_profit = content?.analysis?.take_profit
    // const cut_loss = content?.analysis?.cut_loss


    // let trade_in_start_time = content?.analysis?.trade_in_time_interval_start
    // let trade_in_end_time = content?.analysis?.trade_in_time_interval_end
    // let force_trade_out_time = content?.analysis?.force_trade_out_time

    const rowId = uuid()
    // const values = [
    //     strategy, enabled, pnl, position,
    //     future_price, index_price, future_open_price, future_price_at_stock_match_end, index_future_spread,
    //     future_price_moving_average, future_price_lower_bound, future_price_upper_bound,
    //     future_return, future_return_moving_average, future_return_lower_bound, future_return_upper_bound,
    //     trade_in_start_time, trade_in_end_time, force_trade_out_time, trade_in_threshold, take_profit, cut_loss, future_price_at_stock_match_start,
    //     ts
    // ]
    const values = [strategy, enabled, JSON.stringify(content), ts]
    // console.log(values)

    // console.log(values)
    client.appendRow(tableId, rowId, values)
}

new RedisSubscriber(redisHost, redisPort, user, password, channel, callback, tableId, cleanStart)





