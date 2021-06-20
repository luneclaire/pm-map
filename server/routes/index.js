var express = require('express')
var router = express.Router()

const Sido = require("../models/Sido")
const Sigungu = require("../models/Sigungu")

const { getForecast } = require("./getForecast");
const { getNews } = require('./getNews');

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
    
async function findDB(DB, query) {
    const result = await DB.findOne(query,{ _id: 0, "__v": 0 },{
        sort: {'dateTime': -1}
    }).exec()
    return result
}

router.get('/sido', async function (req, res, next) {
    const result = await findDB(Sido, {})
    res.send(result)
})

router.get('/sigungu', async function (req, res, next) {
    const allSigunguData = async () => {
        let result = []
        for(const sidoName of sidoNames){
            const sigunguData = await findDB(Sigungu, {
                'sidoName' : sidoName
            })
            result.push(sigunguData)
        }
        return result
    }
    res.send(await allSigunguData())
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