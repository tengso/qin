import { expect } from 'chai'
import { describe } from 'mocha'
import { RedisStorage } from '../src/RedisStorage'
import { UserInfo, Table } from '../src/Messages';

let s

beforeEach(() => {
  s = new RedisStorage('test')
})

afterEach(() => {
  s.close()
})

describe('Test Session Id', function() {
  it('basic cases', function(done) {

    s.removeSessionId('user_id', (res: number) => {

      s.setSessionId('user_id', 'session_id', (res: number) => {
        expect(res).equal(1)

        s.setSessionId('user_id_2', 'session_id_2', (res: number) => {
          expect(res).equal(1)

          s.getSessionId('user_id', (res: string) => {
            expect(res).equal('session_id')

            s.removeSessionId('user_id', (res: number) => {
              expect(res).equal(1)

              s.removeSessionId('user_id', (res: number) => {
                expect(res).equal(0)

                s.removeSessionId('user_id_2', (res: number) => {
                  expect(res).equal(1)

                  s.getSessionId('user_id_2', (res: string) => {
                    expect(res).equal(null)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

describe('Test User Id', function() {
  it('basic cases', function(done) {
      const userInfo1: UserInfo = {
        userId: 'user_id',
        userName: 'song',
        password: 'teng'
      }

      const userInfo2: UserInfo = {
        userId: 'user_id_2',
        userName: 'song',
        password: 'teng'
      }

    s.removeUser(userInfo1.userId, (res: number) => {

      s.setUser(userInfo1.userId, userInfo1, (res: number) => {
        expect(res).equal(1)
        
        s.setUser(userInfo2.userId, userInfo2, (res: number) => {
          s.getUser(userInfo1.userId, (res: UserInfo) => {
            expect(res).deep.equal(userInfo1)

            s.removeUser(userInfo1.userId, (res: number) => {
              expect(res).equal(1)

              s.removeUser(userInfo1.userId, (res: number) => {
                expect(res).equal(0)

                s.getUser(userInfo1.userId, (res: UserInfo) => {
                  expect(res).equal(null)

                  done()
                })
              })
            })
          })
        })
      })
    })
  })
})

describe('Test Subscriber', function() {
  it('basic cases', function(done) {

    s.removeSubscriber('session_id', (res: number) => {

      s.removeSubscriber('session_id_2', (res: number) => {

        s.setSubscriber('session_id', 'user_id', (res: number) => {
          expect(res).equal(1)

          s.setSubscriber('session_id_2', 'user_id_2', (res: number) => {
            expect(res).equal(1)

            s.getSubscribers((res) => {
              expect(res.sort()).deep.equal(['session_id', 'session_id_2'])

              s.removeSubscriber('session_id', (res: number) => {
                expect(res).equal(1)

                s.removeSubscriber('session_id', (res: number) => {
                  expect(res).equal(0)

                  s.removeSubscriber('session_id_2', (res: number) => {
                    expect(res).equal(1)

                    s.getSubscribers((res) => {
                      expect(res).equal(null)
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

describe('Test Table Snap', function() {
  it('basic cases', function(done) {

    const table1: Table = {
      tableId: 'table_id',
      tableName: 'table_name',
      version: 0,
      columns: ['col1', 'col2'],
      rows:  [
        {
          rowId: 'row_id', 
          values: ['val1', 'val2']
        }, 
        {
          rowId: 'row_id_2',
          values: ['val_1', 'val_2']
        }
      ],
      creatorId: 'creator_id'
    }

    const table2: Table = {
      tableId: 'table_id_2',
      tableName: 'table_name_2',
      version: 0,
      columns: ['col1', 'col2'],
      rows:  [
        {
          rowId: 'row_id', 
          values: ['val1', 'val2']
        }, 
        {
          rowId: 'row_id_2',
          values: ['val_1', 'val_2']
        }
      ],
      creatorId: 'creator_id_2'
    }

    s.removeTableSnap(table1.tableId, (res: number) => {

      s.removeTableSnap(table2.tableId, (res: number) => {

        s.setTableSnap(table1.tableId, table1, (res: number) => {
          expect(res).equal(1)

          s.setTableSnap(table2.tableId, table2, (res: number) => {
            expect(res).equal(1)

            s.getTables((res) => {
              expect(res).deep.equal({
                table_id: table1,
                table_id_2: table2,
              })

              s.removeTableSnap(table1.tableId, (res: number) => {
                expect(res).equal(1)

                s.removeTableSnap(table1.tableId, (res: number) => {
                  expect(res).equal(0)

                  s.removeTableSnap(table2.tableId, (res: number) => {
                    expect(res).equal(1)

                    s.getTables((res: object) => {
                      expect(res).equal(null)
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

describe('Test Table Update', function() {
  it('basic cases', function(done) {
    const update = {
      msg: 'msg'
    }
    s.setTableUpdate('table_id', 0, update, (res) => {
      s.getTableUpdate('table_id', 0, (res) => {
        expect(res).deep.equal(update)
        s.getTableUpdate('table_id', 1, (res) => {
          expect(res).equal(null)
          done()
        })
      })  
    })
  })
})

describe('Test Row Index', function() {
  it('basic cases', function(done) {

    s.removeRowIndex('row_id', (res: number) => {

      s.removeRowIndex('row_id_2', (res: number) => {

        s.setRowIndex('row_id', 10, (res: number) => {
          expect(res).equal(1)

          s.setRowIndex('row_id_2', 20, (res: number) => {
            expect(res).equal(1)

            s.getRowIndex('row_id', (res) => {
              expect(res).equal(10)

              s.removeRowIndex('row_id', (res: number) => {
                expect(res).equal(1)

                s.removeRowIndex('row_id', (res: number) => {
                  expect(res).equal(0)

                  s.removeRowIndex('row_id_2', (res: number) => {
                    expect(res).equal(1)

                    s.getRowIndex('row_id_2', (res) => {
                      expect(res).equal(null)
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})