var express = require('express');
var router = express.Router();
const axios = require('axios');

const Sido = require("../models/sido");
const Sigungu = require("../models/sigungu");


// 숫자 formatting (두 자리 맞추기)
function leadingZero (data){
    return ("0"+data).slice(-2);
}

function getDateTime(today, year, month, date, hour){
    if (hour === 0){ // n일 00시 -> (n-1)일 24시로 변환 (이유: 미세먼지 api에서는 0시를 24시로 표기)
        var yesterday = new Date(today.setDate(today.getDate() - 1)); //어제 날짜 가져오기
        yesterdayDate = yesterday.getDate(); 
        hour = 24+hour;
        if (Number(date) === 1){ // 만약 오늘이 n월 1일이면 전날은 (n-1)월 
            month = yesterday.getMonth()+1;
        }
        date = yesterdayDate;
    } else if (hour === -1){
        hour = 23;
    }    

    dateTime = year+"-"+leadingZero(month)+"-"+leadingZero(date)+" "+leadingZero(hour)+":00";
    return dateTime;
}

// DB에서 현재(가장 최신의) 미세먼지/초미세먼지 수치 가져오기
async function findSido(today, year, month, date, hour, callback){
    const dateTime = getDateTime(today, year, month, date, hour);
    //console.log(dateTime);
    var result = await Sido.find({"dateTime": dateTime},
    {_id:0, "__v":0} ).exec();
    if (result.length > 0){
        callback({
            result:result
        });
    }else{
        findSido(today, year, month, date, hour-1, callback);// 1시간 전 데이터 호출
    }   
}

async function findSigungu(today, year, month, date, hour, callback){
    const dateTime = getDateTime(today, year, month, date, hour);
    //console.log(dateTime);
    const result = await Sigungu.find({
        "dateTime": dateTime,
    }, {_id:0, "__v":0} ).exec();
    if (result.length > 0){
        callback({
            result:result
        });
    }else{
        findSigungu(today, year, month, date, hour-1, callback);// 1시간 전 데이터 호출
    } 
}

router.get('/sido', async function(req, res, next){
    
    // dateTime 가져오기
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var date = today.getDate();
    var hour = today.getHours();

    findSido(today, year, month, date, hour, (result)=>{
        res.send(result);
    });
});

router.get('/sigungu', async function(req, res, next){
    
    // dateTime 가져오기
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var date = today.getDate();
    var hour = today.getHours();
    
    findSigungu(today, year, month, date, hour, (result)=>{
        res.send(result);
    });
    
});

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

module.exports = router;