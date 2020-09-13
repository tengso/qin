import { DefaultClientCallback, Client } from './TableFlowClient'
import { TableId, SessionId, TableName, RowId } from './Core'
import { ErrorCode, CreatorId, ColumnName, ColumnValue, Table } from './TableFlowMessages'
import { Callbacks } from './examples/team/Callback';
import TimeChart from 'timechart'
import { showCompletionScript } from 'yargs';



const tableId = 'strategy_table_v5_id'

class Chart {
    private data = {}
    private start
    private chart
    private elementName: string
    private seriesProperties: string

    private initializedChart = false
    private startHour: number
    private startMinute: number

    constructor(elementName: string, seriesProperties, startHour: number, startMinute: number) {
        this.elementName = elementName
        this.seriesProperties = seriesProperties
        this.startHour = startHour
        this.startMinute = startMinute
    }

    push(ts: Date, name: string, value: number, filterZero=false) {

        if ((ts.getHours() == this.startHour && ts.getMinutes() >= this.startMinute) || ts.getHours() > this.startHour) {
            if (!this.initializedChart) {
                this.start = ts
                this.initChart(this.start)
                this.initializedChart = true
            }

            // console.log(name)
            // console.log(this.data)

            if ((isNaN(value)) || (filterZero && value == 0)) {
                return
            }

            this.data[name].push(
                // @ts-ignore
                { x: ts - this.start, y: value}
            )
            this.chart.update()
        }
    }    

    initChart(start: Date) {
        const el = document.getElementById(this.elementName);

        // console.log(el, this.elementName)

        const seriesOption = []
        for (const prop of this.seriesProperties) {
            const name = prop['name']
            const color = prop['color']
            const lineWidth = prop['lineWidth']
            this.data[name] = []
            seriesOption.push({name: name, data: this.data[name], color: color, lineWidth: lineWidth})
        }

        // @ts-ignore
        const baseX = start - new Date(0)
        // console.log(seriesOption)
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

        // const legends = document.getElementsByTagName("chart-legend")
        // // console.log(legends)
        // for (let i = 0; i < legends.length; i++) {
        //     const legend = legends[i] as HTMLElement
        //     const ls = legend.style
        //     ls.position = 'absolute'
        //     ls.left = '5px'
        //     ls.top = '5px'
        // }
    }
}

class HappyValleyCallback extends DefaultClientCallback {
    private client

    private pricePlotOptions = 
        [
            {name: 'future price', color: '#0000FF', lineWidth: 2}, 
            {name: 'index price', color: '#000066'},
            {name: 'open price', color: '#ff33cc', lineWidth: 2}, 
            {name: 'at stock open', color: '#00cc99', lineWidth: 2},
            {name: 'moving average', color: '#DC143C'},
            {name: 'lower bound', color: '#33cc33'},
            {name: 'upper bound', color: '#DC143C'},
        ]

    private priceChart = new Chart('price_chart', this.pricePlotOptions, 0, 0)
    private stockAuctionStartPriceChart = new Chart('stock_auction_start_price_chart', this.pricePlotOptions, 8, 59) 
    private futureOpenPriceChart = new Chart('future_open_price_chart', this.pricePlotOptions, 9, 14)
    private stockAuctionEndPriceChart = new Chart('stock_auction_end_price_chart', this.pricePlotOptions, 9, 19)

    private pnlChart = new Chart('pnl_chart', [ {name: 'pnl', color: '#000000'} ], 0, 0)
    private positionChart = new Chart('position_chart', [ {name: 'position', color: '#000000'} ], 0, 0) 

    private spreadChart = new Chart('spread_chart', [ {name: 'spread', color: '#000000'} ], 0, 0) 

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
/*
    "strategy_name",
    "pnl", 
    "position", 
    "future_price", 
    "index_price", 
    "future_open_price", 
    "future_price_at_stock_match", 
    "index_future_spread", 
    "future_price_moving_average", 
    "future_price_lower_bound", 
    "future_price_upper_bound",
    "update_time",
*/
        const strategy = values[0]
        const ts = new Date(values[11] as string)

        const pnl = Number(values[1])
        this.pnlChart.push(ts, 'pnl', pnl)

        const position = Number(values[2])
        this.positionChart.push(ts, 'position', position)

        const futurePrice = Number(values[3])
        this.pushToPriceCharts(ts, 'future price', futurePrice)
        this.updateLabel(futurePrice, 'future_price')

        const indexPrice = Number(values[4])
        this.pushToPriceCharts(ts, 'index price', indexPrice)
        if (indexPrice != 0) {
            this.updateLabel(indexPrice, 'index_price')
        }

        const futureOpenPrice = Number(values[5])
        this.pushToPriceCharts(ts, 'open price', futureOpenPrice)

        const futurePriceAtStockMatch = Number(values[6])
        this.pushToPriceCharts(ts, 'at stock open', futurePriceAtStockMatch)

        const indexFutureSpread = values[7] == null ? NaN : Number(values[7])
        if (!isNaN(indexFutureSpread)) {
            this.spreadChart.push(ts, 'spread', indexFutureSpread)
            this.updateLabel(indexFutureSpread, 'index_future_spread')
        }

        const futurePriceMovingAverage = Number(values[8])
        this.pushToPriceCharts(ts, 'moving average', futurePriceMovingAverage)

        const futurePriceLowerBound = Number(values[9])
        this.pushToPriceCharts(ts, 'lower bound', futurePriceLowerBound)

        const futurePriceUpperBound = Number(values[10])
        this.pushToPriceCharts(ts, 'upper bound', futurePriceUpperBound)
    }

    appendRow: (tableIdParam: TableId, rowId: RowId, values: Object[]) => void = (tableIdParam, rowId, values) => {
        if (tableIdParam == tableId) {
            this.plot(values)
        }
    }

    pushToPriceCharts(ts: Date, name: string, value: number) {
        this.priceChart.push(ts, name, value, true)
        this.stockAuctionStartPriceChart.push(ts, name, value, true)
        this.futureOpenPriceChart.push(ts, name, value, true)
        this.stockAuctionEndPriceChart.push(ts, name, value, true)
    }

    updateLabel(value: number | string, className: string) {
        const labels = document.getElementsByClassName(className)
        for (let i = 0; i < labels.length; i++) {
            labels[i].innerHTML = String(value)
        }
    }
}


const callback = new HappyValleyCallback()
const client = new Client(WebSocket)
client.addCallback(callback)
client.connect('127.0.0.1', 8080)

// main()
/*
future_price=futures_price,
index_price=index,
future_open_price=future_open_price,
index_future_spread=index - futures_price,
future_price_at_stock_match=future_price_at_stock_match,
future_price_moving_average=future_price_moving_average,
future_price_lower_bound=future_price_lower_bound,
future_price_upper_bound=future_price_upper_bound,
strategy_table_v5_id
*/