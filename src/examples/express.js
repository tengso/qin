const express = require('express')
const app = express()
const port = 8888

app.use(express.static('/home/ubuntu/qin'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))