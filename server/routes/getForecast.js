const axios = require('axios')
const dayjs = require('dayjs')
const qs = require('qs');

const sidoNameData = require("./sidoNameMapping.json")

const serviceKey = 'JzAjCMSkJKezoT9lpf/ilQVb5808SC4cc7FU83dGJdO939K0UWHTn+j2J6l/axyCityrbAoQLJIV3w8x2hdqmQ=='
// const serviceKey = 'dC0Mal22V6WU0+Fhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg=='
// const serviceKey = 'G1746kXbwSMNDX+Z+Pl9Fwhq9i7t8+8NvV5vVc0BFactDgkkZEQxlfEguygCbXWlGmtY+cyHh/Nm/S0qq5yuZw=='

async function requestApi(searchDate) {
    const today = searchDate.format('YYYY-MM-DD')

    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?'
    const queryParams = {
        ServiceKey: serviceKey,
        returnType: 'json',
        pageNo : 1,
        numOfRows: 100, 
        searchDate: today,
        ver: '1.0'
    }

    const uri = url + qs.stringify(queryParams)
    
    let { data } = await axios.get(uri)
    data = data.response.body.items
    return data
}

// 시도명 축약형 매핑(서울 -> 서울특별시)
const nameMapping = (sidoName) => {
    const result = sidoNameData.filter(({ name, abbrev }) => {
        return abbrev == sidoName
    })
    try {
        return result[0].name
    } catch {
        return sidoName
    }
}


async function getData() {
    let searchDate = dayjs()
    
    // 예보는 하루 4번 발표(5시,11시,17시,23시) -> 5시 이전에 api호출할 시 전날 데이터 조회.
    const tomorrow = searchDate.add(1, 'day').format('YYYY-MM-DD')
    if (searchDate.hour() < 5) {
        searchDate = dayjs().subtract(1, 'day')
    }
    const data = await requestApi(searchDate)

    // 내일 미세먼지 수치
    const pmTomorrow = data.filter((item) => {
        return item.informCode === 'PM10' & item.informData === tomorrow
    })[0]

    // 예보 등급은 '서울: 나쁨,  제주: 나쁨, 전남: 나쁨 …' 형태의 string이라 
    // object로 수정 -> {'서울':'나쁨', '제주':'나쁨', ...}
    let sidoNames = []
    let pmResult = []
    let fpmResult = []
    pmTomorrow.informGrade.split(',').forEach(async (val, index, arr) => {
        let [sido, pm] = val.split(':')
        sidoNames.push(nameMapping(sido.trim()))
        pmResult.push(pm.trim())
    })

    const fpmTomorrow = data.filter((item) => {
        return item.informCode === 'PM25' & item.informData === tomorrow
    })[0]

    fpmTomorrow.informGrade.split(',').forEach(async (val, index, arr) => {
        let [sido, fpm] = val.split(':')
        fpmResult.push(fpm.trim())
    })

    let result = []
    const steps = ["좋음", "보통", "나쁨"]
    sidoNames.forEach((sido, idx)=>{
        let sidoname = sido
        const dateTime = pmTomorrow.dataTime.slice(0,-4)+":00"
        const pm = steps.indexOf(pmResult[idx])+1
        const fpm = steps.indexOf(fpmResult[idx])+1

        if ( sido === '경기남부' ){
            sidoname = '경기도'
        } else if (sido === '경기북부'){
            return
        } else if (sido === '영동'){
            sidoname = '강원도'
        } else if (sido === '영서'){
            return
        }

        result.push({
            informData: tomorrow,
            dateTime: dateTime,
            sidoName: sidoname,
            pm: pm,
            fpm: fpm
        })
    })
    
    return result
}

async function getForecast() {
    const data = await getData()
    return data
}

exports.getForecast = getForecast
