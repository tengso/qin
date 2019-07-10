import { expect } from 'chai'
import { describe } from 'mocha'
import { ColumnValue, Row, ErrorCode, UserInfo, Table, SessionId, appendTableRowSuccess, RowId, TableId, ColumnName } from '../Messages';
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

    client.addCallback(new CreateUserTest((client, sessionId) => {
      client.createUser(newUserId, newUserName, newUserPassword)
    }))

    client.connect(host, port) 
  })
})

describe('Test Create Table', function() {
  it('basic cases', function(done) {

    const tableId = 'test_table_id'
    const tableName = 'test_table'
    const columns = ['col1', 'col2', 'col3']

    class CreateTableTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createTableSuccess = () => {
        done()
      }

      createTableFailure = (tableId, errorCode, reason) => {
        if (errorCode === ErrorCode.TableExists) {
          client.removeTable(tableId)
        }
        else {
          fail(`failed to create table ${reason}`)
          done()
        }
      }

      removeTableSuccess = () => {
        client.createTable(tableId, tableName, columns)
      }
    }

    client.addCallback(new CreateTableTest((client, sessionId) => {
      client.createTable(tableId, tableName, columns)
    }))

    client.connect(host, port) 
  })
})

describe('Test Subscribe Table', function() {
  it('basic cases', function(done) {

    const tableId = 'test_table_id'
    const tableName = 'test_table'
    const columns = ['col1', 'col2', 'col3']

    let receivedResponse = false
    let receivedSnap = false

    class SubscribeTableTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createTableSuccess = () => {
        client.subscribeTables()
      }

      createTableFailure = (tableId, errorCode, reason) => {
        if (errorCode === ErrorCode.TableExists) {
          client.removeTable(tableId)
        }
        else {
          fail(`failed to create table ${reason}`)
          done()
        }
      }

      removeTableSuccess = () => {
        client.createTable(tableId, tableName, columns)
      }

      tableSnap = (table) => {
        if (table.tableId === tableId) {
          expect(table.tableName).equal(tableName)
          expect(table.columns).deep.equal(columns)
          expect(table.rows).deep.equal([])
          expect(table.version).equal(0)
          receivedSnap = true
          if (receivedResponse && receivedSnap) {
            done()
          }
        }
      }

      subscribeTablesSuccess = () => {
        receivedResponse = true
        if (receivedResponse && receivedSnap) {
          done()
        }
      }
    }

    client.addCallback(new SubscribeTableTest((client, sessionId) => {
      client.createTable(tableId, tableName, columns)
    }))

    client.connect(host, port) 
  })
})

describe('Test Add Row', function() {
  it('basic cases', function(done) {

    const tableId = 'test_table_id'
    const tableName = 'test_table'
    const columns = ['col1', 'col2', 'col3']
    const rowId = 'row_id_1' 
    const rowValue = ['val1', 'val2']

    let receivedResponse = false
    let receivedUpdate = false

    class AddRowTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createTableSuccess = () => {
        client.subscribeTables()
      }

      createTableFailure = (tableId, errorCode, reason) => {
        if (errorCode === ErrorCode.TableExists) {
          client.removeTable(tableId)
        }
        else {
          fail(`failed to create table ${reason}`)
          done()
        }
      }

      removeTableSuccess = () => {
        client.createTable(tableId, tableName, columns)
      }

      tableSnap = (table: Table) => {
        if (table.tableId === tableId) {
          expect(table.tableName).equal(tableName)
          expect(table.columns).deep.equal(columns)
          expect(table.rows).deep.equal([])
          expect(table.version).equal(0)

          const row: Row = {
            rowId: rowId,
            values: rowValue,
          }

          client.appendRow(tableId, row)
        }
      }

      appendRowSuccess = (newRowId) => {
        expect(newRowId).equal(rowId)
        receivedResponse = true
        if (receivedResponse && receivedUpdate) {
          done()
        }
      }

      appendRow = (newTableId: TableId, newRowId: RowId, newRowValue: ColumnValue[]) => {
        expect(newTableId).equal(tableId)
        expect(newRowId).equal(newRowId)
        expect(newRowValue).deep.equal(rowValue)
        receivedUpdate = true
        if (receivedResponse && receivedUpdate) {
          done()
        }
      }

      subscribeTablesSuccess = () => {
      }
    }

    client.addCallback(new AddRowTest((client, sessionId) => {
      client.createTable(tableId, tableName, columns)
    }))

    client.connect(host, port) 
  })
})

describe('Test Remove Row', function() {
  it('basic cases', function(done) {

    const tableId = 'test_table_id'
    const tableName = 'test_table'
    const columns = ['col1', 'col2', 'col3']
    const rowId = 'row_id_1' 
    const rowValue = ['val1', 'val2']

    let receivedAppendResponse = false
    let receivedAppendUpdate = false

    let receivedRemoveResponse = false
    let receivedRemoveUpdate = false

    class RemoveRowTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createTableSuccess = () => {
        client.subscribeTables()
      }

      createTableFailure = (tableId, errorCode, reason) => {
        if (errorCode === ErrorCode.TableExists) {
          client.removeTable(tableId)
        }
        else {
          fail(`failed to create table ${reason}`)
          done()
        }
      }

      removeTableSuccess = () => {
        client.createTable(tableId, tableName, columns)
      }

      tableSnap = (table: Table) => {
        if (table.tableId === tableId) {
          expect(table.tableName).equal(tableName)
          expect(table.columns).deep.equal(columns)
          expect(table.rows).deep.equal([])
          expect(table.version).equal(0)

          const row: Row = {
            rowId: rowId,
            values: rowValue,
          }

          client.appendRow(tableId, row)
        }
      }

      appendRowSuccess = (newRowId) => {
        expect(newRowId).equal(rowId)
        receivedAppendResponse = true
        if (receivedAppendResponse && receivedAppendUpdate) {
          client.removeRow(tableId, rowId)
        }
      }

      appendRow = (newTableId: TableId, newRowId: RowId, newRowValue: ColumnValue[]) => {
        expect(newTableId).equal(tableId)
        expect(newRowId).equal(newRowId)
        expect(newRowValue).deep.equal(rowValue)
        receivedAppendUpdate = true
        if (receivedAppendResponse && receivedAppendUpdate) {
          client.removeRow(tableId, rowId)
        }
      }

      removeRow = (removedRowId: RowId) => {
        expect(removedRowId).equal(rowId)
        receivedRemoveUpdate = true
        if (receivedRemoveResponse && receivedRemoveUpdate) {
          done()
        }
      }

      removeRowSuccess = (removedRowId: RowId) => {
        expect(removedRowId).equal(rowId)
        receivedRemoveResponse = true
        if (receivedRemoveResponse && receivedRemoveUpdate) {
          done()
        }
      }

      subscribeTablesSuccess = () => {
      }
    }

    client.addCallback(new RemoveRowTest((client, sessionId) => {
      client.createTable(tableId, tableName, columns)
    }))

    client.connect(host, port) 
  })
})

describe('Test Update Cell', function() {
  it('basic cases', function(done) {

    const tableId = 'test_table_id'
    const tableName = 'test_table'
    const columnIndex = 1 
    const columns = ['col1', 'col2', 'col3']
    const rowId = 'row_id_1' 
    const rowValue = ['val1', 'val2']
    const newValue = ['new_value']

    let receivedResponse = false
    let receivedUpdate = false

    let receivedCellResponse = false
    let receivedCellUpdate = false

    let awaitCellUpdate = false

    class AddRowTest extends Test {
      constructor(afterLogin) {
        super(afterLogin)
      }

      createTableSuccess = () => {
        client.subscribeTables()
      }

      createTableFailure = (tableId, errorCode, reason) => {
        if (errorCode === ErrorCode.TableExists) {
          client.removeTable(tableId)
        }
        else {
          fail(`failed to create table ${reason}`)
          done()
        }
      }

      removeTableSuccess = () => {
        client.createTable(tableId, tableName, columns)
      }

      tableSnap = (table: Table) => {
        if (table.tableId === tableId) {
          expect(table.tableName).equal(tableName)
          expect(table.columns).deep.equal(columns)
          expect(table.rows).deep.equal([])
          expect(table.version).equal(0)

          const row: Row = {
            rowId: rowId,
            values: rowValue,
          }

          client.appendRow(tableId, row)
        }
      }

      appendRowSuccess = (newRowId) => {
        expect(newRowId).equal(rowId)
        receivedResponse = true
        if (receivedResponse && receivedUpdate) {
          if (!awaitCellUpdate) {
            client.updateCell(tableId, rowId, columns[columnIndex], newValue)
            awaitCellUpdate = true
          }
        }
      }

      appendRow = (newTableId: TableId, newRowId: RowId, newRowValue: ColumnValue[]) => {
        expect(newTableId).equal(tableId)
        expect(newRowId).equal(newRowId)
        expect(newRowValue).deep.equal(rowValue)
        receivedUpdate = true
        if (receivedResponse && receivedUpdate) {
          if (!awaitCellUpdate) {
            client.updateCell(tableId, rowId, columns[columnIndex], newValue)
            awaitCellUpdate = true
          }
        }
      }

      subscribeTablesSuccess = () => {
      }

      updateCell = (updatedRowId: RowId, updatedColumnIndex: number, value: Object) => {
        expect(updatedRowId).equal(rowId)
        expect(updatedColumnIndex).equal(columnIndex)
        expect(value).deep.equal(newValue)
        receivedCellUpdate = true

        if(receivedCellResponse && receivedCellUpdate) {
          done()
        }
      }

      updateCellSuccess = (updatedTableId, updatedRowId, updatedColumnName) => {
        expect(updatedTableId).equal(tableId)
        expect(updatedRowId).equal(rowId)
        expect(updatedColumnName).equal(columns[columnIndex])
        receivedCellResponse = true

        if(receivedCellResponse && receivedCellUpdate) {
          done()
        }
      }

      updateCellFailure = (tableId, rowId, columnName, errorCode, reason) => {
        fail(`fail to update cell: ${errorCode} ${reason}`)
      }
    }

    client.addCallback(new AddRowTest((client, sessionId) => {
      client.createTable(tableId, tableName, columns)
    }))

    client.connect(host, port) 
  })
})