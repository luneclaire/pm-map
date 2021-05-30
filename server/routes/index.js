var express = require('express');
var router = express.Router();
const Sido = require("../models/sido");
const { GetsidoAirdata } = require("./getSido");

// 숫자 formatting (두 자리 맞추기)
const leadingZero = (data) => { 
    return ("0"+data).slice(-2);
}

// DB에서 현재(가장 최신의) 미세먼지/초미세먼지 수치 가져오기
const findSido = (year, month, date, hour, callback) => {
    var dateTime = '';

    if (hour === 0){ // n일 00시 -> (n-1)일 24시로 변환 (이유: 미세먼지 api에서는 0시를 24시로 표기)
        dateTime = year+"-"+month+"-"+leadingZero(date-1)+" 24:00"; // 아직 해결 못한것 : date=0되면..?
    }else{
        dateTime = year+"-"+month+"-"+leadingZero(date)+" "+leadingZero(hour)+":00";
    }

    // DB에서 dateTime이 현재 시각과 가장 가까운 데이터 가져오기
    Sido.find({dateTime: dateTime}, function(error,sido){
        if(error){
            console.log(error);
        }else{
            if(sido.length === 17){
                callback({
                    sido:sido
                });
            }else{ // 최신 데이터로 업데이트
                GetsidoAirdata(sido.length===0);
                console.log('updated');
                findSido(year, month, date, hour, callback);
            }
        }
    });
}
                    
router.get('/', function(req, res, next){

    // dateTime 가져오기
    var today = new Date();
    var year = today.getFullYear();
    var month = leadingZero(today.getMonth()+1);
    var date = today.getDate();
    var hour = today.getHours();

    // DB에서 현재 미세먼지/초미세먼지 수치 가져오기
    findSido(year, month, date, hour, (sido)=>{
        res.send(sido);
    });
});

module.exports = router;