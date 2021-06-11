const stationData = require("./sigunguStation.json")
const axios = require('axios')
const qs = require('qs');
const dayjs = require('dayjs')

const Sigungu = require("../models/sigungu")
const newSigungu = require("../models/newSigungu")

// const serviceKey = 'Vtgkpa6WDF3+rOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg=='
// const serviceKey = 'JzAjCMSkJKezoT9lpf/ilQVb5808SC4cc7FU83dGJdO939K0UWHTn+j2J6l/axyCityrbAoQLJIV3w8x2hdqmQ=='
const serviceKey = 'dC0Mal22V6WU0+Fhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg=='
// const serviceKey = 'G1746kXbwSMNDX+Z+Pl9Fwhq9i7t8+8NvV5vVc0BFactDgkkZEQxlfEguygCbXWlGmtY+cyHh/Nm/S0qq5yuZw=='

async function requestApi(stationName) {
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?'
    const queryParams = {
        ServiceKey: serviceKey,
        returnType: 'json',
        pageNo : 1,
        numOfRows: 1, 
        stationName: stationName,
        dataTerm: 'daily',
        ver: '1.0'
    }

    const uri = url + qs.stringify(queryParams)

    let { data } = await axios.get(uri)
    data = data.response.body.items[0]
    return data
}

async function getData(sigungunm, stationNames) {
    let pm10Sum = 0
    let pm25Sum = 0
    let cnt = 0
    // let dateTime = ''
    for (const stationName of stationNames) {
        try {
            const air = await requestApi(stationName)

            if((!!air.pm10Flag) | (!!air.pm25Flag)){
                continue
            }

            // dateTime = air.dataTime
            pm10Sum += Number(air.pm10Value)
            pm25Sum += Number(air.pm25Value)
            cnt++

        } catch (e) {
            // console.error(e)
            console.error(sigungunm, stationName)
            continue
        }
    }

    if(cnt == 0){
        return false
    }

    const data = {
        sigunguName: sigungunm, // 시군구 이름
        pm: Math.round(pm10Sum / cnt), // 해당 지역의 평균 미세먼지 수치
        fpm: Math.round(pm25Sum / cnt), // 해당 지역의 평균 초미세먼지 수치
    }
    return data
}

function updateDB(AllSiGunGuData) {
    const query = {
        "dateTime": AllSiGunGuData.dateTime,
        "sidoName": AllSiGunGuData.sidoName
    }
    const update = {
        "$set": {
            "data": AllSiGunGuData.sigunguData
        }
    }
    const options = { "upsert": true }

    newSigungu.updateOne(query, update, options)
    .then(()=>{
        console.log(AllSiGunGuData.sidoName)})
    .catch(e=>{
        console.error(e)
        console.log(AllSiGunGuData.sidoName)
    })
}

async function getAllSiGunGuData() {

    const now = dayjs()
    let dateTime = now.format('YYYY-MM-DD HH:00')

    for (const [sido, data] of Object.entries(stationData)) {
        const sigunguData = async () => {
            let result = []
            for (const [key, value] of Object.entries(data)) {
                const data = await getData(key, value)
                if(data){
                    result.push(data)
                }
            }
            return result
        }

        const allSigunguData = {
            dateTime: dateTime,
            sidoName: sido,
            sigunguData: await sigunguData()
        }
        
        updateDB(allSigunguData)
    }
}
exports.getAllSiGunGuData = getAllSiGunGuData
