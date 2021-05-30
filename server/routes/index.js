var express = require('express');
var router = express.Router();

const { getSido } = require("./getSido");

const sidoAirdata = (callback) => {
    const sidoNames = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];
    var result = []
    var cnt = 0;
    for (const sidoName of sidoNames){ // 모든 시도에 대해서 반복적으로 api 호출
        getSido(sidoName, (err, {air}={})=>{
            if(err){
                console.log('에러발생!');
            }
            cnt++;
            result.push(air);
            if (cnt === sidoNames.length){
                callback({
                    result:result
                })
            }
        });
    }    
}
router.get('/', function(req, res, next){
    sidoAirdata((result)=>{
        res.send(result)
    });
});

module.exports = router;