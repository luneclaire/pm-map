const axios = require('axios')
const qs = require('qs');
const dayjs = require('dayjs')

const Sido = require("../models/sido")
const newSido = require("../models/newSido")
const sidoNameData = require("./sidoNameMapping.json");

const serviceKey = 'Vtgkpa6WDF3+rOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg=='
// const serviceKey = 'JzAjCMSkJKezoT9lpf/ilQVb5808SC4cc7FU83dGJdO939K0UWHTn+j2J6l/axyCityrbAoQLJIV3w8x2hdqmQ=='
// const serviceKey = 'dC0Mal22V6WU0+Fhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg=='
// const serviceKey = 'G1746kXbwSMNDX+Z+Pl9Fwhq9i7t8+8NvV5vVc0BFactDgkkZEQxlfEguygCbXWlGmtY+cyHh/Nm/S0qq5yuZw=='


async function requestApi(sidoName) {
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?'
    const queryParams = {
        ServiceKey: serviceKey,
        numOfRows: 100,
        pageNo: 1,
        ver: '1.0',
        sidoName: sidoName,
        returnType: 'json'
    }
    const uri = url + qs.stringify(queryParams)

    let { data } = await axios.get(uri)
    data = data.response.body.items

    return data
}

async function getSidoData(sidoName) {
    const airs = await requestApi(sidoName)
    let pm10Sum = 0
    let pm25Sum = 0
    let cnt = 0

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
        cnt += 1
    }

    const data = {
        sidoName: sidoNameData.find(data => { return data.abbrev === sidoName }).name, // 시도 이름 축약형 매핑
        pm: Math.round(pm10Sum / cnt), // 해당 지역의 평균 미세먼지 수치
        fpm: Math.round(pm25Sum / cnt), // 해당 지역의 평균 초미세먼지 수치 
    }

    return data
}


function updateDB(data) {
    const query = {
        "dateTime": data.dateTime,
    }
    const update = {
        "$set": {
            "data": data.sidoData
        }
    }
    const options = { "upsert": true }

    newSido.updateOne(query, update, options)
        .catch(e => { console.log })
}


async function getAllSidoData() {
    const sidoNames = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종']

    const now = dayjs()
    let dateTime = now.format('YYYY-MM-DD HH:00')
    if (now.get('hour') === 0) {
        dateTime = now.subtract(1, 'day').format('YYYY-MM-DD 24:00')
    }

    const sidoData = async () => {
        let result = []
        for (const sidoName of sidoNames) { // 모든 시도에 대해서 반복적으로 api 호출
            result.push(await getSidoData(sidoName))
        }
        return result
    }

    const allSidoData = {
        dateTime: dateTime,
        sidoData: await sidoData()
    }

    updateDB(allSidoData)
}

exports.getAllSidoData = getAllSidoData
