const express = require('express')
const mongoose = require('mongoose')
const schedule = require('node-schedule');
const { GetsidoAirdata } = require("./routes/getSido");

const fs = require('fs')
var text = fs.readFileSync("./server/dbconnection.txt").toString('utf-8');

const app = express()
const port = 3001

// mongodb atlas 연결
mongoose.connect(text, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
});

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function callback () {
	connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err);
    } else {
      GetsidoAirdata((names.length === 0)); 
      console.log("updated");
    }
  });
});

// xx시 10분에 DB업데이트 
var j = schedule.scheduleJob('0 10 * * * *', function(){ 
  GetsidoAirdata(false);
});

const api = require('./routes/index');
app.use('/api', api);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})