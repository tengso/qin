const yargs = require('yargs')
const express = require('express')

const port = yargs.argv.port ? yargs.argv.port : 80
const path = yargs.argv.path ? yargs.argv.path : '/home/ubuntu/qin'

const app = express()
app.use(express.static(path))
app.listen(port, () => console.log(`listening on port ${port} at ${path}`))
