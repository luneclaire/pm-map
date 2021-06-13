var express = require('express')
var router = express.Router()
const dayjs = require('dayjs')

const Sido = require("../models/sido")
const newSido = require("../models/newSido")
const Sigungu = require("../models/sigungu")
const newSigungu = require("../models/newSigungu")

const { getForecast } = require("./getForecast");
const { getNews } = require('./getNews');

const getDateTime = (now) => {
    let dateTime = now.format('YYYY-MM-DD HH:00')
    if(now.get('hour') === 0 ){
        dateTime = now.subtract(1, 'day').format('YYYY-MM-DD 24:00')
    }
    return dateTime
}

async function findSidoDB(DB, now) {
    const dateTime = getDateTime(now)
    const result = await DB.find({
        "dateTime": dateTime,
    },{ _id: 0, "__v": 0 }).exec()

    if (result.length > 0) {
        return result[0]
    } else {
        const before = now.subtract(1, 'hour')
        return findSidoDB(DB, before)
    }
}

async function findSigunguDB(DB, sido, now) {
    const dateTime = getDateTime(now)
    const result = await DB.find({ 
        "dateTime": dateTime,
        "sidoName": sido
    },{ _id: 0, "__v": 0 }).exec()
    if (result.length > 0) {
        return result
    } else {
        const before = now.subtract(1, 'hour')
        return findSigunguDB(DB, sido, before)
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
    const start = new Date()
    const result = await findSidoDB(newSido, now)
    const end = new Date()
    console.log(end - start)
    res.send(result)
})

router.get('/sigungu', async function (req, res, next) {
    const now = dayjs()
    const start = new Date()
    const allSigunguData = async () => {
        let result = []
        for(const sidoName of sidoNames){
            const sigunguData = await findSigunguDB(newSigungu, sidoName, now)
            result.push(...sigunguData)
        }
        return result
    }
    res.send(await allSigunguData())
    const end = new Date()
    console.log(end - start)
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