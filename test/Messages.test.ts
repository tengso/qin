import { expect } from 'chai';
import { createUser, createTable, appendTableRow, removeTableRow } from '../src/Messages'

describe('Messages', function() {
  it('createUser', function() {
    let r = JSON.parse(createUser('user_id', 'user_name', 'creator_id'))
    expect(r.payLoad.userId).equal("user_id")
    expect(r.payLoad.userName).equal("user_name")
    expect(r.payLoad.creatorId).equal("creator_id")
    expect(r.payLoad.creatorId).equal("creator_id")
    expect(r.msgType).equal("createUser")
  });

  it('createTable', function() {
    let r = JSON.parse(createTable('table_id', 'table_name', ['col1', 'col2'], 'creator_id'))
    expect(r.payLoad.tableId).equal("table_id")
    expect(r.payLoad.tableName).equal("table_name")
    expect(r.payLoad.columns).deep.equal(["col1", 'col2'])
    expect(r.payLoad.creatorId).equal("creator_id")
    expect(r.msgType).equal("createTable")
  });

  it('appendRow', function() {
    let r = JSON.parse(appendTableRow('row_id', ['value_1', 'value_2', 'value_3'], 'appender_id'))
    expect(r.payLoad.rowId).equal("row_id")
    expect(r.payLoad.values).deep.equal(["value_1", 'value_2', 'value_3'])
    expect(r.payLoad.appenderId).equal("appender_id")
    expect(r.msgType).equal("appendRow")
  });

  it('removeRow', function() {
    let r = JSON.parse(removeTableRow('row_id', 'remover_id'))
    expect(r.payLoad.rowId).equal("row_id")
    expect(r.payLoad.removerId).equal("remover_id")
    expect(r.msgType).equal("removeRow")
  });
});