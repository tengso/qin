import {Client, DefaultClientCallback} from "../../TableFlowClient";
import {RowId, SessionId, TableId} from "../../Core";
import {ErrorCode, Table} from "../../TableFlowMessages";
import { GenericTableCallback } from "./Common"
const redis = require('redis')
const WebSocket = require('ws');

class Callback extends GenericTableCallback {
    private columns
    private redisClient
    private readonly redisKey
    private readonly redisChannel

    constructor(tableFlowUser, tableFlowPassword, redisHost, redisPort, redisChannel, redisKey, actionTableId) {
        super(tableFlowUser, tableFlowPassword, actionTableId)
        this.redisClient = redis.createClient(redisPort, redisHost)
        this.redisChannel = redisChannel
        this.redisKey = redisKey
    }

    tableSnap = table => {
        if (table.tableId == this.tableId) {
            console.log('received table')

            for (const column of table.columns) {
                console.log(column)
            }

            this.columns = table.columns
        }
    }

    appendRow = (tableId, rowId, values) => {
        if (tableId == this.tableId) {
            const actionName = values[0]
            const actionContent = values[1]
            const sender = values[2]
            const sentTime = values[3]

            const message = JSON.stringify([new Date(), {
                'name': actionName,
                'sender': sender,
                'sent_time': sentTime,
                'content': JSON.parse(actionContent),
            }])
            this.redisClient.rpush(this.redisKey, message)
            this.redisClient.publish(this.redisChannel, message)
            console.log(`send message ${this.redisChannel} ${message}`)
        }
    }
}


const actionTableId = 'action_table_v1_id'

const tableFlowUser = 'hv_action'
const tableFlowPassword = 'hv_action'

const tableFlowHost = 'hv1'
const tableFlowPort = 8080

const redisHost = 'hv2'
const redisPort = 6400

const strategy = 'dawn'

const now = new Date()
const year = now.getFullYear()
const month = (now.getMonth() + 1).toString().padStart(2, '0')
const day = now.getDate().toString().padStart(2, '0')
const date = `${year}${month}${day}`

const redisChannel = `${strategy}_${date}_action_channel`
const redisKey = `${strategy}_${date}_action_key`

const client = new Client(WebSocket)
const callback = new Callback(tableFlowUser, tableFlowPassword, redisHost, redisPort, redisChannel, redisKey, actionTableId)

client.addCallback(callback)
client.connect(tableFlowHost, tableFlowPort)
