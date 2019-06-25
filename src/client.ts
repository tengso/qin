// FIXME: use import
import {createUser} from './Messages';

let userId = 'ts'
let userName = 'song' 
let creatorId = 'xyz'

import WebSocket = require('ws');

const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
  connection.send(createUser(userId, userName, creatorId)) 
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}