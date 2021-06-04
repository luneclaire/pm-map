var express = require('express')
var router = express.Router()
var axios = require('axios');

const dayjs = require('dayjs')

const Sido = require("../models/sido")
const Sigungu = require("../models/sigungu")
const { getForecast } = require("./getForecast")

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

const NAVER_CLIENT_ID     = 'aFTNbrc5Jy6sygbQRhZN'
const NAVER_CLIENT_SECRET = 'wxcwuCX9Vr'
router.get('/news', async function(req, res, next){
    const response = await axios.get("https://openapi.naver.com/v1/search/news", {
        params:{
            query  : '미세먼지', //뉴스 검색 키워드
            start  : 1, //검색 시작 위치
            display: 3, //가져올 이미지 갯수
            sort   : 'sim' //정렬 유형 (sim:유사도, date:날짜)
        },
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    })
    if (response) {
        console.log('======= response.data =========')
        console.log(response.data)
        res.send(response.data)
    }
});

module.exports = router