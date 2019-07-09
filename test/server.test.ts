// import 'mocha'
// import { expect } from 'chai'
// import { describe } from 'mocha'
import { UserInfo, Table, SessionId, appendTableRowSuccess, RowId, TableId, ColumnName } from '../src/Messages';
import { TableFlowServer } from '../src/server'
import { Client } from '../src/client'


interface callback {
  loginSuccess: (sessionId: SessionId) => void
  logoutSuccess: (sessionId: SessionId) => void
  createUserSuccess: () => void
  createTableSuccess: () => void
  subscribeTableSuccess: () => void
  appendRowSuccess: (rowId: RowId) => void
  removeRowSuccess: (rowId: RowId) => void
  updateCellSuccess: (tableId: TableId, rowId: RowId, columnName: ColumnName) => void
  tableSnap: (table: Table) => void
  appendRow: (tableId: TableId, rowId: RowId, values: Object[]) => void 
  removeRow: (rowId: RowId) => void
  updateCell: (rowId: RowId, columnIndex: number, value: Object) => void
}

const callback = {
  loginSuccess: sessionId => {
    console.log(`login success`)
  }
}

let server: TableFlowServer = new TableFlowServer()
setTimeout(() => {
  const c = new Client('localhost', 8080, callback)    
  setTimeout(() => {
    c.login('root', 'root')
  }, 3000)
}, 5000)


// before(() => {
//   console.log('before')
//   server = new TableFlowServer()
// })

// after(() => {
// })

// describe('Test Session Id', function() {
//   it('test', function(done) {
//     // const callback = {
//     //   loginSuccess: sessionId => {

//     //   }
//     // }
//     // const c = new Client('localhost', 8080, callback)    
//     // c.login('root', 'root')
//   })
// })