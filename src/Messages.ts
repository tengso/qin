export function createUser(
  userId: string,
  userName: string,
  creatorId: string
) {
  return `
  {
    "msgType": "createUser",
    "payLoad": {
        "userId": ${JSON.stringify(userId)},
        "userName": ${JSON.stringify(userName)},
        "creatorId": ${JSON.stringify(creatorId)}
    } 
  }
 `;
}

export function createTable(
  tableId: string,
  tableName: string,
  columns: string[],
  creatorId: string
) {
  return `
  {
    "msgType": "createTable",
    "payLoad": {
      "tableId": ${JSON.stringify(tableId)},
      "tableName": ${JSON.stringify(tableName)},
      "columns": ${JSON.stringify(columns)},
      "creatorId": ${JSON.stringify(creatorId)}
    }
  }
  `;
}

export function appendTableRow(
  rowId: string,
  values: string[],
  appenderId: string
) {
  return `
  {
    "msgType": "appendRow",
    "payLoad": {
      "rowId": ${JSON.stringify(rowId)},
      "values": ${JSON.stringify(values)},
      "appenderId": ${JSON.stringify(appenderId)}
    }
  }
  `;
}

export function removeTableRow(rowId: string, removerId: string) {
  return `
  {
    "msgType": "removeRow",
    "payLoad": {
      "rowId": ${JSON.stringify(rowId)},
      "removerId": ${JSON.stringify(removerId)}
    }
  }
  `;
}