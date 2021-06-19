const express = require('express')
const app = express()
const port = 3001

const DBconnection = require('./server.db').DBconnection
const scheduleJob = require('./server.schedule').scheduleJob
DBconnection() // DB연결
scheduleJob() // 1시간마다 미세먼지 데이터 받아오기

const api = require('./routes/index')
app.use('/', api)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})