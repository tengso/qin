import {Client, DefaultClientCallback} from '../../TableFlowClient'
import {RowId, SessionId, TableId} from '../../Core'
import {ErrorCode, Table} from '../../TableFlowMessages'
import {AnalysisTableColumns} from './Common'
import TimeChart from "timechart";

const uuid = require('uuid')

export interface SeriesProperties {
    name: string
    color: string
    lineWidth: number
    columnIndex: number
}

export class SeriesViewer {
    private readonly seriesList: Array<SeriesProperties>
    private initialized = false
    private chart
    private data = {}
    private readonly startHour
    private readonly startMinute
    private name
    private readonly viewerElement
    private readonly plotElement
    private readonly valueElements = {}
    private startTime
    private skipZero: boolean

    constructor(parentElement: HTMLElement, name: string, id, seriesList: Array<SeriesProperties>, startHour: number, startMinute: number,
                skipZero) {
        this.name = name
        this.seriesList = seriesList
        this.startHour = startHour
        this.startMinute = startMinute
        this.skipZero = skipZero

        this.viewerElement = document.createElement('div')
        this.viewerElement.id = id
        parentElement.appendChild(this.viewerElement)
        this.viewerElement.classList.add('series_viewer')
        // this.viewerElement.id = 'series_viewer_container_' + name
        this.plotElement = document.createElement('div')
        this.plotElement.classList.add('series_plot_viewer')
        this.viewerElement.appendChild(this.plotElement)

        const valueListElement = document.createElement('div')
        valueListElement.classList.add('series_value_viewer_list')
        this.viewerElement.appendChild(valueListElement)

        for (const prop of this.seriesList) {
            const element = document.createElement('div')
            element.classList.add('series_value_viewer')
            valueListElement.appendChild(element)

            const labelElement = document.createElement('label')
            labelElement.innerText = prop.name + ': '
            element.appendChild(labelElement)

            const valueElement = document.createElement('label')
            element.appendChild(valueElement)

            this.valueElements[prop.name] = valueElement
        }
    }

    push(now: Date, seriesName, seriesValue) {
        // console.log(now, seriesName, seriesValue)
        if ((now.getHours() == this.startHour && now.getMinutes() >= this.startMinute)
            || now.getHours() > this.startHour) {
            if (!this.initialized) {
                this.initialize(now)
                this.initialized = true
            }

            if ((this.skipZero && seriesValue > 0) || !this.skipZero) {
                // console.log('plot', seriesName, seriesValue)
                this.data[seriesName].push({
                    // @ts-ignore
                    x: now - this.startTime,
                    y: seriesValue
                })
                // console.log(this.data)
                this.chart.update()
                this.valueElements[seriesName].innerText = seriesValue.toFixed(2)
                // this.updateCurrentValue(seriesName, seriesValue)
            }
        }
    }

    private initialize(start) {
        this.startTime = start
        const seriesOption = []
        for (const prop of this.seriesList) {
            const name = prop.name
            this.data[name] = []
            const color = prop.color
            const lineWidth = prop.lineWidth
            seriesOption.push({name: name, data: this.data[name], color: color, lineWidth: lineWidth})
        }

        // @ts-ignore
        const baseX = start - new Date(0)
        // console.log(seriesOption)
        this.chart = new TimeChart(this.plotElement, {
            // @ts-ignore
            baseTime: baseX,
            series: seriesOption,
            xRange: 'auto',
            yRange: 'auto',
            realTime: false,
            paddingLeft: 30,
            paddingRight: 30,
            zoom: {
                x: {
                    autoRange: true,
                },
                y: {
                    autoRange: true,
                }
            }
        });
    }

    // updateCurrentValue(name, value: number) {
    //     const labels = document.getElementsByClassName(className)
    //     for (let i = 0; i < labels.length; i++) {
    //         labels[i].innerHTML = String(value)
    //     }
    // }
}
/*
    "strategy_name", 0
    "pnl", 1
    "position", 2
    "future_price", 3
    "index_price", 4
    "future_open_price", 5
    "future_price_at_stock_match", 6
    "index_future_spread", 7
    "future_price_moving_average", 8
    "future_price_lower_bound", 9
    "future_price_upper_bound", 10
    "update_time", 11
*/

class ActionSender {
    private user
    private client
    private actionTableId

    constructor(user, client, actionTableId) {
        this.user = user
        this.client = client
        this.actionTableId = actionTableId
    }

    getDateTime() {
        const now = new Date()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const day = now.getDate().toString().padStart(2, '0')
        const hour = now.getHours().toString().padStart(2, '0')
        const minute = now.getMinutes().toString().padStart(2, '0')
        const second = now.getSeconds().toString().padStart(2, '0')
        const microSecond = (now.getMilliseconds() * 1000).toString().padStart(6, '0')
        return `${now.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}.${microSecond}`
    }

    pegOrderAction(strategy, pegType, symbol, side, quantity, offset) {
        const sender = this.user
        const sentTime = this.getDateTime()

        const content = JSON.stringify({
            strategy: strategy, peg_type: pegType, offset: offset, quantity: quantity, side: side, symbol: symbol
        })
        const values = ['peg_order', content, sender, sentTime]
        const rowId = uuid()
        console.log('send to action table', this.actionTableId, rowId, values)
        this.client.appendRow(this.actionTableId, rowId, values)
    }

    unwindRiskAction(strategy) {
        const sender = this.user
        const sentTime = this.getDateTime()

        const content = JSON.stringify({strategy: strategy})
        const rowId = uuid()
        const values = ['unwind_risk', content, sender, sentTime]
        client.appendRow(this.actionTableId, rowId, values)
    }

    enableStrategyAction(strategy) {
        const name = 'enable_strategy'
        const sender = this.user
        const sentTime = this.getDateTime()

        const content = JSON.stringify({
            strategy: strategy,
        })
        const values = [name, content, sender, sentTime]
        const rowId = uuid()
        client.appendRow(this.actionTableId, rowId, values)
    }

    disableStrategyAction(strategy) {
        const name = 'disable_strategy'
        const sender = this.user
        const sentTime = this.getDateTime()

        const content = JSON.stringify({
            strategy: strategy,
        })
        const values = [name, content, sender, sentTime]
        const rowId = uuid()
        client.appendRow(this.actionTableId, rowId, values)
    }
}


class DashboardCallback extends DefaultClientCallback {
    private readonly user
    private readonly password
    private readonly tableId
    private client
    private analysisViewer
    private pnlViewer
    private positionViewer

    private analysisProperties: Array<SeriesProperties> = [
            { name: 'future price', color: '#0000FF', lineWidth: 2, columnIndex: AnalysisTableColumns.future_return },
            { name: 'moving average', color: '#DC143C', lineWidth: 1, columnIndex: AnalysisTableColumns.future_return_moving_average },
            { name: 'lower bound', color: '#33cc33', lineWidth: 1, columnIndex: AnalysisTableColumns.future_return_lower_bound },
            { name: 'upper bound', color: '#33cc33', lineWidth: 1, columnIndex: AnalysisTableColumns.future_return_upper_bound },
        ]

    private pnlProperties: Array<SeriesProperties> = [
            { name: 'pnl', color: '#000000', lineWidth: 1, columnIndex: AnalysisTableColumns.pnl }
        ]

    private positionProperties: Array<SeriesProperties> = [
            { name: 'position', color: '#000000', lineWidth: 1, columnIndex: AnalysisTableColumns.position }
        ]

    // // private spreadChart = new Chart('spread_chart', [ {name: 'spread', color: '#000000'} ], 0, 0)

    constructor(user, password, tableId) {
        super()

        this.user = user
        this.password = password
        this.tableId = tableId

        const appElement = document.getElementById('app')
        const viewerContainerList = document.createElement('div')
        viewerContainerList.classList.add('viewer_list')
        appElement.appendChild(viewerContainerList)

        const tradingContainer = document.createElement('div')
        tradingContainer.id = 'trading_viewer'
        viewerContainerList.appendChild(tradingContainer)

        const tradingPnlPositionContainer = document.createElement('div')
        tradingPnlPositionContainer.id = 'trading_pnl_position_viewer'
        tradingContainer.appendChild(tradingPnlPositionContainer)

        const tradingAnalysisContainer = document.createElement('div')
        tradingAnalysisContainer.id = 'trading_analysis_viewer'
        tradingContainer.appendChild(tradingAnalysisContainer)

        const startHour = 9
        const startMinute = 13

        this.analysisViewer = new SeriesViewer(
            tradingAnalysisContainer,
            'analysis',
            '',
            this.analysisProperties,
            startHour, startMinute, false)

        this.pnlViewer = new SeriesViewer(
            tradingPnlPositionContainer,
            'pnl',
            'trading_pnl_viewer',
            this.pnlProperties,
            startHour, startMinute, false)

        this.positionViewer = new SeriesViewer(
            tradingPnlPositionContainer,
            'position',
            'trading_position_viewer',
            this.positionProperties,
            startHour, startMinute, false)
    }

    connectSuccess: (client: Client) => void = (client) => {
        this.client = client
        console.log('dashboard connected')
        client.login(this.user, this.password)
    }

    connectFailure: () => void = () => {
        console.log('dashboard failed to connect!!')
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log('dashboard login success')
        this.client.subscribeTables()
    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(`dashboard login failure ${reason}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login(this.user, this.password)
    }

    logoutFailure: (reason: string) => void = reason => {
        console.log(`dashboard logout failure ${reason}`)
    }

    tableSnap: (table: Table) => void = table => {
        if (table.tableId == this.tableId) {
            console.log('received table', this.tableId)

            for (const column of table.columns) {
                console.log(column)
            }

            for (const row of table.rows) {
                this.updateViewer(row.values)
            }
        }
    }

    appendRow: (tableIdParam: TableId, rowId: RowId, values: Object[]) => void = (tableIdParam, rowId, values) => {
        if (tableIdParam == this.tableId) {
            this.updateViewer(values)
        }
    }

    updateViewer(values) {
        // console.log('row', values)
        const strategy = values[AnalysisTableColumns.strategy_name]
        const ts = new Date(values[AnalysisTableColumns.update_time] as string)
        const enabled = values[AnalysisTableColumns.enabled] as string == 'true'

        console.log(values)

        let tradeInStartTime = values[AnalysisTableColumns.trade_in_start_time]
        let tradeInEndTime = values[AnalysisTableColumns.trade_in_end_time]
        let forceTradeOutTime = values[AnalysisTableColumns.force_trade_out_time]

        this.updateTime(tradeInStartTime, 'trade_in_start_time')
        this.updateTime(tradeInEndTime, 'trade_in_end_time')
        this.updateTime(forceTradeOutTime, 'force_trade_out_time')

        const enableDisableButton = document.getElementById('enable_disable_strategy') as HTMLButtonElement
        if (enabled && (enableDisableButton.innerText == 'Enable')) {
            enableDisableButton.innerText = 'Disable'
        }
        else if (!enabled && (enableDisableButton.innerText == 'Disable')) {
            enableDisableButton.innerText = 'Enable'
        }

        for (const prop of this.analysisProperties) {
            const value = Number(values[prop.columnIndex])
            this.analysisViewer.push(ts, prop.name, value)
        }

        for (const prop of this.pnlProperties) {
            const value = Number(values[prop.columnIndex])
            this.pnlViewer.push(ts, prop.name, value)
        }

        for (const prop of this.positionProperties) {
            const value = Number(values[prop.columnIndex])
            this.positionViewer.push(ts, prop.name, value)
        }
    }

    updateTime(timestamp, elementId) {
        if (timestamp) {
            const element = document.getElementById(elementId) as HTMLLabelElement
            const time = new Date(timestamp * 1000)
            const hours = String(time.getHours()).padStart(2, '0')
            const minutes = String(time.getMinutes()).padStart(2, '0')
            const seconds = String(time.getSeconds()).padStart(2, '0')
            element.innerText = `${hours}:${minutes}:${seconds}`
        }
    }

    // updateLabel(value: number | string, className: string) {
    //     const labels = document.getElementsByClassName(className)
    //     for (let i = 0; i < labels.length; i++) {
    //         labels[i].innerHTML = String(value)
    //     }
    // }
}

const analysisTableId = 'strategy_table_v7_id'
const actionTableId = 'action_table_v1_id'
const user = 'hv_dashboard_client'
const password = 'hv_dashboard_client'

// hv1
// const qinHost = '106.52.39.195'
const qinHost = 'localhost'
const qinPort = 8080

const callback = new DashboardCallback(user, password, analysisTableId)
const client = new Client(WebSocket)
const actionSender = new ActionSender(user, client, actionTableId)
client.addCallback(callback)
client.connect(qinHost, qinPort)

function takeLongPosition() {
    const quantity = Number((document.getElementById('quantity') as HTMLInputElement).value.trim())
    const symbol = (document.getElementById('symbol') as HTMLInputElement).value.trim()
    const strategy = (document.getElementById('strategy') as HTMLInputElement).value.trim()
    const pegType = 'peg_aggressive'
    const offset = 0
    const side = 'B'
    actionSender.pegOrderAction(strategy, pegType, symbol, side, quantity, offset)
}

function takeShortPosition() {
    const quantity = Number((document.getElementById('quantity') as HTMLInputElement).value.trim())
    const symbol = (document.getElementById('symbol') as HTMLInputElement).value.trim()
    const strategy = (document.getElementById('strategy') as HTMLInputElement).value.trim()
    const pegType = 'peg_aggressive'
    const offset = 0
    const side = 'S'
    actionSender.pegOrderAction(strategy, pegType, symbol, side, quantity, offset)
}


function unwindRisk() {
    const strategy = (document.getElementById('strategy') as HTMLInputElement).value.trim()
    actionSender.unwindRiskAction(strategy)
}

function enableOrDisable() {
    const enableDisableButton = document.getElementById('enable_disable_strategy') as HTMLButtonElement
    const strategy = (document.getElementById('strategy') as HTMLInputElement).value.trim()
    if (enableDisableButton.innerText == 'Enable') {
        actionSender.enableStrategyAction(strategy)
    }
    else if (enableDisableButton.innerText == 'Disable') {
        actionSender.disableStrategyAction(strategy)
    }
}

window['takeLongPosition'] = takeLongPosition
window['takeShortPosition'] = takeShortPosition
window['unwindRisk'] = unwindRisk
window['enableOrDisable'] = enableOrDisable
