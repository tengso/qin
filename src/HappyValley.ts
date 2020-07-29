import { DefaultClientCallback, Client } from './TableFlowClient'
import { TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue, Table } from './TableFlowMessages'
import { Callbacks } from './examples/team/Callback';
import TimeChart from 'timechart'



const strategy = 'dawn'
const tableId = 'strategy_table_v2_id'
const rowId = `${strategy}_row_id`
const symbol = 'HK.HSI2008'

class HappyValleyCallback extends DefaultClientCallback {
    private client
    private data = []
    private chart

    private initializedChart = false

    constructor() {
        super()
    }

    connectSuccess: (client: Client) => void = (client) => {
        this.client = client
        console.log('connected!!')
        client.login('hv2', 'hv2')
    }

    connectFailure: () => void = () => {
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log('login success')
        this.client.subscribeTables()
    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(`login failure ${reason}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login('hv2', 'hv2')
    }

    logoutFailure: (reason: string) => void = reason => {
        console.log(`logout failure ${reason}`)
    }

    updateCellSuccess: (tableId: TableId, rowId: RowId, columnName: ColumnName) => void = (tableId, rwoId, columnName) => {
    }

    updateCellFailure: (tableId: TableId, rowId: RowId, columnName: ColumnName, errorCode: ErrorCode, reason: string) => void = (tableId, rwoId, columnName, errorCode, reason) => {}

    updateCell: (tableId: TableId, rowId: RowId, columnIndex: number, value: Object) => void = (tableId, rowId, columnIndex, value) => {
        // if (!this.initializedChart) {
        //     this.initChart()
        //     this.initializedChart = true
        // }
        // console.log(`updated cell ${tableId} ${rowId} ${columnIndex} ${value}`)
        // this.data.push(
        //     { x: this.x, y: value}
        // )
        // this.chart.update()
        // this.x += 100
    }

    tableSnap: (table: Table) => void = table => {
        if (table.tableId == tableId) {
            console.log('received table')

            for (const column of table.columns) {
                console.log(column)
            }
            
            var start = null
            for (const row of table.rows) {
                const ts = row.values[3] as string
                console.log(ts)
                const d = new Date(ts)
                const pnl = row.values[1]

                if (!this.initializedChart) {
                    start = d
                    this.initChart(start)
                    this.initializedChart = true
                }
                this.data.push(
                    // @ts-ignore
                    { x: d - start, y: pnl}
                )
                this.chart.update()
            }
        }
    }

    initChart = (start: Date) => {
        console.log(start)
        // @ts-ignore
        const baseX = start - new Date(0)
        console.log(baseX)
        const el = document.getElementById('chart');
        this.chart = new TimeChart(el, {
            // @ts-ignore
            baseTime: baseX,
            series: [
                {
                    name: 'HappyValue',
                    data: this.data,
                },
            ],
            // xRange: { min: 0, max: 500 * 1000 },
            xRange: 'auto',
            yRange: 'auto',
            realTime: false,
            zoom: {
                x: {
                    autoRange: true,
                    minDomainExtent: 50,
                },
                y: {
                    autoRange: true,
                    minDomainExtent: 1,
                }
            },
        });
    }
}


const callback = new HappyValleyCallback()
const client = new Client(WebSocket)
client.addCallback(callback)
client.connect('127.0.0.1', 8080)

// main()