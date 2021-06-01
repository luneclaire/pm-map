const axios = require('axios');
const serviceKey = 'Vtgkpa6WDF3%2BrOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg%3D%3D';

async function requestApi(sidoName, addr){
    const url = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList?';
    var queryParams = encodeURIComponent('ServiceKey') + '=' + serviceKey;
    queryParams += '&' + encodeURIComponent('addr') + '=' + encodeURIComponent(sidoName + ' '+ addr); //시도 이름
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); //josn으로 받기
    
    const uri = url + queryParams;
    // console.log(uri);
    var {data} = await axios.get(uri);
    data = data.response.body.items;

    return data;
}


async function getRegionData(sidoNames, addr){
    var stations = [];
    for (const sidoName of sidoNames){
        const items = await requestApi(sidoName, addr);
        for (const item of items){
            stations.push(item.stationName);
        }
    }
    return stations;
}

async function getStationList (data){
    var result2 = {};
    for (const sido of data){
        var result1 = {};
        for (const addr of sido.regions){
            const stations = await getRegionData(sido.name, addr);
            result1[`${addr}`] = stations;
        }
        result2[`${sido.name[0]}`] = result1;
    }

    return result2;
}

async function main(){
    const fs = require('fs');
    const regionData = require("./sido_sigungu.json")
    
    let result = await getStationList(regionData);
    let data = JSON.stringify(result);
    fs.writeFileSync('sigunguStation.json', data);
}

main();