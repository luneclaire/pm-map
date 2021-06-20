const dayjs = require('dayjs')
const Sido = require("../models/Sido")
let {requestApi, sidoNameMapping} = require("./util")

async function getSidoData(sidoName) {
    const airs = await requestApi(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?', { 
            sidoName: sidoName
        })
    let pm10Sum = 0
    let pm25Sum = 0
    let cnt = 0

    for (const air of airs) { 
        
        if ((!!air.pm10Flag) | (!!air.pm25Flag)) {  // 미세먼지 null값 처리
            continue
        }
        pm10Sum += Number(air.pm10Value)
        pm25Sum += Number(air.pm25Value)
        cnt += 1
    }

    const data = {
        sidoName: sidoNameMapping(sidoName), // 시도 이름 축약형 매핑
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

    Sido.updateOne(query, update, options)
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
