const express = require('express')
const app = express()
const port = 80

app.use(express.static('/home/song_teng/projects/qin'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))