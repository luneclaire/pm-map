const dayjs = require('dayjs')
const Sigungu = require("../models/Sigungu")
const stationData = require("./sigunguStation.json")
let {requestApi} = require("./util")

async function getData(sigungunm, stationNames) {
    let pm10Sum = 0
    let pm25Sum = 0
    let cnt = 0

    for (const stationName of stationNames) {
        try {
            let air = await requestApi('http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?', {
                stationName: stationName,
                dataTerm: 'daily',
                numOfRows: 1     
            })
            air = air[0]
            
            if((!!air.pm10Flag) | (!!air.pm25Flag)){
                continue
            }
            
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

    Sigungu.updateOne(query, update, options)
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
