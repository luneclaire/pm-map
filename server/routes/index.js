var express = require('express')
var router = express.Router()
var axios = require('axios');

const dayjs = require('dayjs')

const Sido = require("../models/sido")
const Sigungu = require("../models/sigungu")
const { getForecast } = require("./getForecast");
const { getNews } = require('./getNews');

async function findDB(DB, sido, now) {
    const dateTime = now.format('YYYY-MM-DD HH:00');
    const result = await DB.find({ 
        "dateTime": dateTime,
        "sidonm": sido
    },{ _id: 0, "__v": 0 }).exec()

    if (result) {
        return result
    } else {
        const before = now.subtract(1, 'hour')
        findDB(DB, sido, before)
    }
}
const sidoNames = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도']

router.get('/sido', async function (req, res, next) {
    const now = dayjs()
    let result = []
    for(const sidoName of sidoNames){
        const sidoData = await findDB(Sido, sidoName, now)
        result = result.concat(sidoData)
    }
    res.send(result)
})


router.get('/sigungu', async function (req, res, next) {
    const now = dayjs()
    let result = []
    for(const sidoName of sidoNames){
        const sigunguData = await findDB(Sigungu, sidoName, now)
        result = result.concat(sigunguData)
    }
    res.send(result)
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