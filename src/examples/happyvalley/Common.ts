import {Client, DefaultClientCallback} from "../../TableFlowClient";
import {RowId, SessionId, TableId} from "../../Core";
import {ErrorCode, Table} from "../../TableFlowMessages";

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
        console.log('connected')
        client.login(this.user, this.password)
    }

    connectFailure: () => void = () => {
        console.log('failed to connect')
    }

    loginSuccess: (sessionId: SessionId) => void  = sessionId => {
        console.log('login success')
        this.client.subscribeTables()
    }

    loginFailure: (errorCode: ErrorCode, reason: string) => void  = (errorCode, reason) => {
        console.log(`failed to login ${reason}`)
        this.client.logout()
    }

    logoutSuccess: () => void = () => {
        this.client.login(this.user, this.password)
    }

    logoutFailure: (reason: string) => void = reason => {
        console.log(`failed to logout ${reason}`)
    }
}
