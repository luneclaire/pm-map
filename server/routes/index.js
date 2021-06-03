var express = require('express');
var router = express.Router();

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
    console.log(dateTime);
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
    console.log(dateTime);
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

module.exports = router;