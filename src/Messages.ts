export function createUser(
  userId: string,
  userName: string,
  creatorId: string
) {
  const msg = {
    msgType: "createUser",
    payLoad: {
        userId: userId,
        userName: userName,
        creatorId: creatorId,
    } 
  }

  return JSON.stringify(msg)
}

export function createTable(
  tableId: string,
  tableName: string,
  columns: string[],
  creatorId: string
) {
  const msg = {
    msgType: "createTable",
    payLoad: {
      tableId: tableId,
      tableName: tableName,
      columns: columns,
      creatorId: creatorId
    }
  }

  return JSON.stringify(msg)
}

export function appendTableRow(
  rowId: string,
  values: string[],
  appenderId: string
) {
  const msg = {
    msgType: "appendRow",
    payLoad: {
      rowId: rowId,
      values: values,
      appenderId: appenderId
    }
  }

  return JSON.stringify(msg)
}

export function removeTableRow(rowId: string, removerId: string) {
  const msg = {
    msgType: "removeRow",
    payLoad: {
      rowId: rowId,
      removerId: removerId
    }
  }

  return JSON.stringify(msg)
}