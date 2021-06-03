const Sido = require("../models/sido")
const axios = require('axios')

// const serviceKey = 'Vtgkpa6WDF3%2BrOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg%3D%3D'
const serviceKey = 'JzAjCMSkJKezoT9lpf%2FilQVb5808SC4cc7FU83dGJdO939K0UWHTn%2Bj2J6l%2FaxyCityrbAoQLJIV3w8x2hdqmQ%3D%3D'
// const serviceKey = 'dC0Mal22V6WU0%2BFhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg%3D%3D'

const sidoNameData = require("./sidoNameMapping.json")
const nameMapping = async (sidoName) => {
    const result = sidoNameData.filter(({ name, abbrev }) => {
        return abbrev === sidoName
    })
    return result[0].name
}

async function requestApi(sidoName) {
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?'
    var queryParams = encodeURIComponent('ServiceKey') + '=' + serviceKey
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100')
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1')
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3') //버젼
    queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(sidoName) //시도 이름
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json') //josn으로 받기

    const uri = url + queryParams
    var { data } = await axios.get(uri)
    data = data.response.body.items

    return data
}

async function getSidoData(sidoName) {
    const airs = await requestApi(sidoName)
    var pm10Sum = 0
    var pm25Sum = 0
    var cnt = 0
    const dateTime = airs[0].dataTime

    for (const air of airs) { // 도(특별시)별 모든 측정장소의 pm10/25Value 평균값 구하기
        pm10Value = air.pm10Value
        pm25Value = air.pm25Value

        if ((pm10Value === '-') | (pm10Value === null)) {  // 미세먼지 null값 처리
            continue
        }
        if ((pm25Value === '-') | (pm25Value === null)) {  // 초미세먼지 null값 처리
            continue
        }
        pm10Sum += Number(pm10Value)
        pm25Sum += Number(pm25Value)
        cnt++
    }

    const data = {
        dateTime: dateTime, // 측정시간
        sidonm: await nameMapping(sidoName), // 시도 이름
        pm: Math.round(pm10Sum / cnt), // 해당 지역의 평균 미세먼지 수치
        fpm: Math.round(pm25Sum / cnt), // 해당 지역의 평균 초미세먼지 수치
    }
    return data
}


function updateDB(data) {
    const query = {
        "sidonm": data.sidonm,
        "dateTime": data.dateTime
    }
    const update = {
        "$set": {
            "pm": data.pm,
            "fpm": data.fpm
        }
    }
    const options = { "upsert": true }

    Sido.updateOne(query, update, options)
        .catch((e) => { console.log(data) })
}


async function getAllSidoData() {
    const sidoNames = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종']
    for (const sidoName of sidoNames) { // 모든 시도에 대해서 반복적으로 api 호출
        const data = await getSidoData(sidoName)
        updateDB(data) // 해당 지역 수치 DB 업데이트
    }
}

exports.getAllSidoData = getAllSidoData
