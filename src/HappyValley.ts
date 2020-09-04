import { DefaultClientCallback, Client } from './TableFlowClient'
import { TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue, Table } from './TableFlowMessages'
import { Callbacks } from './examples/team/Callback';
import TimeChart from 'timechart'



const tableId = 'strategy_table_v4_id'

class Chart {
    private data = {}
    private start
    private chart
    private elementName: string
    private seriesProperties: string

    private initializedChart = false

    constructor(elementName: string, seriesProperties) {
        this.elementName = elementName
        this.seriesProperties = seriesProperties
    }

    push(ts: Date, name: string, value: number) {
        if (!this.initializedChart) {
            this.start = ts
            this.initChart(this.start)
            this.initializedChart = true
        }

        this.data[name].push(
            // @ts-ignore
            { x: ts - this.start, y: value}
        )
        this.chart.update()
    }    

    initChart(start: Date) {
        const el = document.getElementById(this.elementName);

        console.log(el, this.elementName)

        const seriesOption = []
        for (const prop of this.seriesProperties) {
            const name = prop['name']
            const color = prop['color']
            this.data[name] = []
            seriesOption.push({name: name, data: this.data[name], color: color})
        }

        // @ts-ignore
        const baseX = start - new Date(0)
        console.log(seriesOption)
        this.chart = new TimeChart(el, {
            // @ts-ignore
            baseTime: baseX,
            series: seriesOption,
            xRange: 'auto',
            yRange: 'auto',
            realTime: false,
            paddingLeft: 350,
            paddingRight: 100,
            zoom: {
                x: {
                    autoRange: true,
                },
                y: {
                    autoRange: true,
                }
            }
        });

        const legends = document.getElementsByTagName("chart-legend")
        console.log(legends)
        for (let i = 0; i < legends.length; i++) {
            const legend = legends[i] as HTMLElement
            const ls = legend.style
            ls.position = 'absolute'
            ls.left = '5px'
            ls.top = '5px'
        }
    }
}

class HappyValleyCallback extends DefaultClientCallback {
    private client
    private priceChart = new Chart('price_chart', [{name: 'contract price', color: '#0000FF'}, {name: 'index price', color: '#DC143C'}])
    private stockAuctionStartPriceChart = new Chart('stock_auction_start_price_chart', [{name: 'contract price', color: '#0000FF'}, {name: 'index price', color: '#DC143C'}])
    private futureOpenPriceChart = new Chart('future_open_price_chart', [{name: 'contract price', color: '#0000FF'}, {name: 'index price', color: '#DC143C'}])
    private stockAuctionEndPriceChart = new Chart('stock_auction_end_price_chart', [{name: 'contract price', color: '#0000FF'}, {name: 'index price', color: '#DC143C'}])
    private pnlChart = new Chart('pnl_chart', [{name: 'pnl', color: '#000000'}])
    private positionChart = new Chart('position_chart', [{name: 'position', color: '#000000'}])

    private cutoffStockAuctionStartHours = 8
    private cutoffStockAuctionStartMinutes = 59

    private cutoffFutureStartHours = 9
    private cutoffFutureStartMinutes = 14

    private cutoffStockAuctionEndHours = 9
    private cutoffStockAuctionEndMinutes = 19

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

    tableSnap: (table: Table) => void = table => {
        if (table.tableId == tableId) {
            console.log('received table')

            for (const column of table.columns) {
                console.log(column)
            }
            
            for (const row of table.rows) {
                this.plot(row.values)
            }
        }
    }

    plot(values) {
        const ts = values[5] as string
        console.log(ts)
        const d = new Date(ts)

        const pnl = Number(values[1])
        const position = Number(values[2])
        const contract_price = Number(values[3])
        const index_price = Number(values[4])

        if (pnl != NaN) {
            this.pnlChart.push(d, 'pnl', pnl)
        }
        else {
            console.log(`wrong pnl format ${values[1]}`)
        }

        if (position != NaN) {
            this.positionChart.push(d, 'position', position)
        }
        else {
            console.log(`wrong position format ${values[2]}`)
        }

        if (contract_price != NaN && contract_price != 0) {
            this.priceChart.push(d, 'contract price', contract_price)

            if ((d.getHours() == this.cutoffStockAuctionStartHours && d.getMinutes() >= this.cutoffStockAuctionStartMinutes) 
               || d.getHours() > this.cutoffStockAuctionStartHours) {
                this.stockAuctionStartPriceChart.push(d, 'contract price', contract_price)
            }

            if ((d.getHours() == this.cutoffFutureStartHours && d.getMinutes() >= this.cutoffFutureStartMinutes) 
               || d.getHours() > this.cutoffFutureStartHours) {
                this.futureOpenPriceChart.push(d, 'contract price', contract_price)
            }

            if ((d.getHours() == this.cutoffStockAuctionEndHours && d.getMinutes() >= this.cutoffStockAuctionEndMinutes) 
               || d.getHours() > this.cutoffStockAuctionEndHours) {
                this.stockAuctionEndPriceChart.push(d, 'contract price', contract_price)
            }

        }
        else {
            console.log(`wrong contract price format ${values[3]}`)
        }

        if (index_price != NaN && index_price != 0) {
            this.priceChart.push(d, 'index price', index_price)

            if ((d.getHours() == this.cutoffStockAuctionStartHours && d.getMinutes() >= this.cutoffStockAuctionStartMinutes) 
               || d.getHours() > this.cutoffStockAuctionStartHours) {
                this.stockAuctionStartPriceChart.push(d, 'index price', index_price)
            }

            if ((d.getHours() == this.cutoffFutureStartHours && d.getMinutes() >= this.cutoffFutureStartMinutes) 
               || d.getHours() > this.cutoffFutureStartHours) {
                this.futureOpenPriceChart.push(d, 'index price', index_price)
            }

            if ((d.getHours() == this.cutoffStockAuctionEndHours && d.getMinutes() >= this.cutoffStockAuctionEndMinutes) 
               || d.getHours() > this.cutoffStockAuctionEndHours) {
                this.stockAuctionEndPriceChart.push(d, 'index price', index_price)
            }
        }
        else {
            console.log(`wrong index price format ${values[4]}`)
        }
    }

    appendRow: (tableIdParam: TableId, rowId: RowId, values: Object[]) => void = (tableIdParam, rowId, values) => {
        if (tableIdParam == tableId) {
            this.plot(values)
        }
    }
}


const callback = new HappyValleyCallback()
const client = new Client(WebSocket)
client.addCallback(callback)
client.connect('127.0.0.1', 8080)

// main()