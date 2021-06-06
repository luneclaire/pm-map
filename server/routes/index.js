var express = require('express')
var router = express.Router()
var axios = require('axios');

const dayjs = require('dayjs')

const Sido = require("../models/sido")
const Sigungu = require("../models/sigungu")
const { getForecast } = require("./getForecast");
const { getNews } = require('./getNews');

async function findDB(DB, now, callback) {
    const dateTime = now.format('YYYY-MM-DD HH:00');
    var result = await DB.find({ "dateTime": dateTime },
        { _id: 0, "__v": 0 }).exec()
    if (result.length > 0) {
        callback({
            result: result
        })
    } else {
        const before = now.subtract(1, 'hour')
        findDB(DB, before, callback)
    }
}

router.get('/sido', async function (req, res, next) {
    const now = dayjs()
    findDB(Sido, now, (result) => {
        res.send(result)
    })
})

router.get('/sigungu', async function (req, res, next) {
    const now = dayjs()
    findDB(Sigungu, now, (result) => {
        res.send(result)
    })

})
router.get('/forecast', async function (req, res, next) {
    const forecast = await getForecast()
    res.send(forecast)
})

router.get('/news', async function(req, res, next){
    const news = await getNews()
    res.send(news)
})

module.exports = router