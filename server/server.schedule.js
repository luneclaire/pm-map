const schedule = require('node-schedule')

const { getAllSidoData } = require("./routes/getSido")
const { getAllSiGunGuData } = require("./routes/getSigungu")

function scheduleJob(){
  schedule.scheduleJob('0 20 * * * *', function () {
    getAllSidoData()
      .then(() => { console.log('sido update complete') })
    getAllSiGunGuData()
      .then(() => { console.log('sigungu update complete') })
  })
}

exports.scheduleJob = scheduleJob