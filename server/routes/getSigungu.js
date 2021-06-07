const stationData = require("./sigunguStation.json")
const axios = require('axios')

const Sigungu = require("../models/sigungu")

// const serviceKey = 'Vtgkpa6WDF3%2BrOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg%3D%3D'
// const serviceKey = 'JzAjCMSkJKezoT9lpf%2FilQVb5808SC4cc7FU83dGJdO939K0UWHTn%2Bj2J6l%2FaxyCityrbAoQLJIV3w8x2hdqmQ%3D%3D'
const serviceKey = 'dC0Mal22V6WU0%2BFhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg%3D%3D'

async function requestApi(stationName) {
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?'
    var queryParams = encodeURIComponent('ServiceKey') + '=' + serviceKey
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1')
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json') //josn으로 받기

    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1')
    queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName) //시도 이름
    queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('daily') //시도 이름
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.0') //시도 이름

    const uri = url + queryParams
    // console.log(uri)
    var { data } = await axios.get(uri)
    data = data.response.body.items[0]
    return data
}

async function getData(sidonm, sigungunm, stationNames) {
    var pm10Sum = 0
    var pm25Sum = 0
    var cnt = 0
    var dateTime = ''
    for (const stationName of stationNames) {
        try {
            const air = await requestApi(stationName)
            const pm10Value = air.pm10Value
            const pm25Value = air.pm25Value

            if ((pm10Value === '-') | (pm10Value === null) | (pm10Value === NaN)) {  // 미세먼지 null값 처리
                continue
            }
            if ((pm25Value === '-') | (pm25Value === null) | (pm25Value === NaN)) {  // 초미세먼지 null값 처리
                continue
            }
            dateTime = air.dataTime
            pm10Sum += Number(pm10Value)
            pm25Sum += Number(pm25Value)
            cnt++

        } catch (e) {
            // console.error(e)
            console.error(sidonm, sigungunm, stationName)
        }
    }
    const data = {
        dateTime: dateTime, // 측정시간
        sidonm: sidonm, // 시군구 이름
        sigungunm: sigungunm, // 시군구 이름
        pm: Math.round(pm10Sum / cnt), // 해당 지역의 평균 미세먼지 수치
        fpm: Math.round(pm25Sum / cnt), // 해당 지역의 평균 초미세먼지 수치
    }
    return data
}

function updateDB(data) {
    const query = {
        "sidonm": data.sidonm,
        "sigungunm": data.sigungunm,
        "dateTime": data.dateTime
    }
    const update = {
        "$set": {
            "pm": data.pm,
            "fpm": data.fpm
        }
    }
    const options = { "upsert": true }

    Sigungu.updateOne(query, update, options)
        .catch((e) => { console.log(data) })
}

async function getAllSiGunGuData() {
    for (const [sido, data] of Object.entries(stationData)) {
        for (const [key, value] of Object.entries(data)) {
            const data = await getData(sido, key, value)
            try {
                updateDB(data)
            } catch (e) {
                console.error(e)
                console.log(key, value)
            }
        }
    }
}
exports.getAllSiGunGuData = getAllSiGunGuData
