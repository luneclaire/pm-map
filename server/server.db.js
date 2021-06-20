const mongoose = require('mongoose')
const dbconfig = require('./dbconfig.json')

// mongodb atlas 연결
function DBconnection(){
    mongoose.connect(dbconfig.url, {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    })
    
    const connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'))
    connection.once('open', function callback() {
      connection.db.listCollections().toArray(function (err, names) {
        if (err) {
          console.log(err)
        }
      })
    })
}

exports.DBconnection = DBconnection