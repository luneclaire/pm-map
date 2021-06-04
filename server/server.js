const express = require('express')
const mongoose = require('mongoose')
const schedule = require('node-schedule')

const { getAllSidoData } = require("./routes/getSido")
const { getAllSiGunGuData } = require("./routes/getSigungu")

const fs = require('fs')
var text = fs.readFileSync("./server/dbconnection.txt").toString('utf-8')

const app = express()
const port = 3001

// mongodb atlas 연결
mongoose.connect(text, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', function callback() {
  connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err)
    }
  })
})

// xx시 10분에 DB업데이트 
var j = schedule.scheduleJob('0 15 * * * *', function () {
  getAllSidoData()
    .then(() => { console.log('sido update complete') })
  getAllSiGunGuData()
    .then(() => { console.log('sigungu update complete') })
})

const api = require('./routes/index')
app.use('/', api)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})