import {Client, DefaultClientCallback} from "../../TableFlowClient";
import {RowId, SessionId, TableId} from "../../Core";
import {ErrorCode, Table} from "../../TableFlowMessages";

export enum AnalysisTableColumns {
    strategy_name = 0,
    enabled = 1,
    pnl = 2,
    position = 3,
    future_price = 4,
    index_price = 5,
    future_open_price = 6,
    future_price_at_stock_match = 7,
    index_future_spread = 8,
    future_price_moving_average = 9,
    future_price_lower_bound = 10,
    future_price_upper_bound = 11,
    future_return = 12,
    future_return_moving_average = 13,
    future_return_lower_bound = 14,
    future_return_upper_bound = 15,
    trade_in_start_time = 16,
    trade_in_end_time = 17,
    force_trade_out_time = 18,
    update_time = 19,
}


export class GenericTableCallback extends DefaultClientCallback {
    protected client
    protected tableId
    protected user: string
    private password: string

    constructor(user: string, password: string, tableId: string) {
        super()
        this.tableId = tableId
        this.user = user
        this.password = password
    }

    connectSuccess: (client: Client) => void = (client) => {
        this.client = client
        console.log(this.user, 'connected')
        client.login(this.user, this.password)
    }

    connectFailure: () => void = () => {
        console.log(this.user, 'failed to connect')
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log(this.user, 'login success')
        this.client.subscribeTables()
    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(this.user, `failed to login ${reason}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login(this.user, this.password)
    }

    logoutFailure: (reason: string) => void = reason => {
        console.log(this.user, `failed to logout ${reason}`)
    }
}


