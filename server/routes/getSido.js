var request = require('request');

const serviceKey = 'Vtgkpa6WDF3%2BrOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg%3D%3D';


const getSido = (sidoName, callback) => {
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?';

    var queryParams = encodeURIComponent('ServiceKey') + '=' + serviceKey;
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); //버젼
    queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(sidoName); //시도 이름
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); //josn으로 받기

    request({
        url: url + queryParams,
        method: 'GET',
    }, function (err, res, body) {

        const airs = JSON.parse(body).response.body.items;
        var pm10Sum = 0;
        var pm25Sum = 0;
        var sidoLength = airs.length;
        const dataTime = airs[0].dataTime;

        for (const air of airs){ // 도(특별시)별 모든 측정장소의 pm10/25Value 평균값 구하기
            pm10Value = air.pm10Value;
            pm25Value = air.pm25Value;

            if ((pm10Value === '-' ) | (pm10Value === null )) {  // 미세먼지 null값 처리
                sidoLength -= 1;
                continue
            }
            if ((pm25Value === '-' ) | (pm25Value === null )) {  // 초미세먼지 null값 처리
                sidoLength -= 1;
                continue
            }
            pm10Sum += Number(pm10Value);
            pm25Sum += Number(pm25Value);
        }

        callback(undefined, {
            air:{
                sidoName: sidoName, // 시도 이름
                dataTime: dataTime, // 측정시간
                pm10Value: Math.round(pm10Sum/sidoLength), // 해당 지역의 평균 미세먼지 수치
                pm25Value: Math.round(pm25Sum/sidoLength), // 해당 지역의 평균 초미세먼지 수치
            }
        });
    });
};






exports.getSido = getSido;
