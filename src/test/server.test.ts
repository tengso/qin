import { expect } from 'chai'
import { describe } from 'mocha'
import { ErrorCode, UserInfo, Table, SessionId, appendTableRowSuccess, RowId, TableId, ColumnName } from '../Messages';
import { TableFlowServer } from '../server'
import { Client, DefaultClientCallback } from '../client'
import { fail } from 'assert';


let server: TableFlowServer
let client: Client
const host = 'localhost'
const port = 8080

class Test extends DefaultClientCallback {
  client: Client
  userId = 'root'
  password = 'root'

  afterLogin

  constructor(afterLogin) {
    super()
    this.afterLogin = afterLogin
  }

  connectSuccess = (client: Client) => {
    this.client = client
    this.client.login(this.userId, this.password)
  }

  loginSuccess = (sessionId: SessionId) => {
    console.log(`login success: ${sessionId}`)
    this.afterLogin(client, sessionId)
  }

  loginFailure = (errorCode: ErrorCode, reason: string) => {
    if (errorCode === ErrorCode.UserAlreadyLogin) {
      client.logout()
    }
    else {
      fail('failed to login')
    }
  }

  logoutSuccess = () => {
    console.log(`logout success`)
    client.login(this.userId, this.password)
  }

  logoutFailure = (reason: string) => {
    fail(`failed to logout: ${reason}`)
  }
}

beforeEach(() => {
  console.log('init')
  client = new Client()   
})

afterEach(() => {
  client.disconnect()
  console.log('done')
})

describe('Test Login', function() {
  it('basic cases', function(done) {

    client.addCallback(new Test((client, sessionId) => {
      expect(typeof sessionId).equal('string')
      expect(typeof sessionId.length).equal('number')
      expect(sessionId.length).greaterThan(0)
      done()
    }))

    client.connect(host, port) 
  })
})

describe('Test Create User', function() {
  it('basic cases', function(done) {

    const newUserId = 'song'
    const newUserName = 'song teng'
    const newUserPassword = 'hello'

    class CreateUserTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createUserSuccess = () => {
        done()
      }

      createUserFailure = (errorCode, reason) => {
        if (errorCode === ErrorCode.UserExists) {
          client.removeUser(newUserId)
        }
        else {
          fail(`failed to create user ${reason}`)
          done()
        }
      }

      removeUserSuccess = () => {
        client.createUser(newUserId, newUserName, newUserPassword)
      }
    }

    client.addCallback(new CreateUserTest((client, sessionoId) => {
      client.createUser(newUserId, newUserName, newUserPassword)
    }))

    client.connect(host, port) 
  })
})