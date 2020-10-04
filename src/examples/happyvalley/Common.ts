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


