const axios = require('axios')
const dayjs = require('dayjs')

const serviceKey = 'Vtgkpa6WDF3%2BrOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg%3D%3D'
// const serviceKey = 'JzAjCMSkJKezoT9lpf%2FilQVb5808SC4cc7FU83dGJdO939K0UWHTn%2Bj2J6l%2FaxyCityrbAoQLJIV3w8x2hdqmQ%3D%3D'
// const serviceKey = 'dC0Mal22V6WU0%2BFhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg%3D%3D'

async function requestApi(searchDate) {
    const today = searchDate.format('YYYY-MM-DD')

    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?'
    var queryParams = encodeURIComponent('ServiceKey') + '=' + serviceKey
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1')
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json') //josn으로 받기
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100')

    queryParams += '&' + encodeURIComponent('searchDate') + '=' + encodeURIComponent(today)
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.0')

    const uri = url + queryParams
    // console.log(uri)
    var { data } = await axios.get(uri)
    data = data.response.body.items
    return data
}

// 시도명 축약형 매핑(서울 -> 서울특별시)
const sidoNameData = require("./sidoNameMapping.json")
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
    var searchDate = dayjs()
    
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
    var sidoNames = []
    var pmResult = []
    var fpmResult = []
    pmTomorrow.informGrade.split(',').forEach(async (val, index, arr) => {
        var [sido, pm] = val.split(':')
        sidoNames.push(nameMapping(sido.trim()))
        pmResult.push(pm.trim())
    })

    const fpmTomorrow = data.filter((item) => {
        return item.informCode === 'PM25' & item.informData === tomorrow
    })[0]
    var fpmResult = []
    fpmTomorrow.informGrade.split(',').forEach(async (val, index, arr) => {
        var [sido, fpm] = val.split(':')
        fpmResult.push(fpm)
    })

    result = []
    sidoNames.forEach((sidoName, idx)=>{
        result.push({
            informData: tomorrow,
            dataTime: pmTomorrow.dataTime.slice(0,-4)+":00",
            sidoName: sidoName,
            pm: pmResult[idx],
            fpm: fpmResult[idx]
        })
    })
    
    return result
}

async function getForecast() {
    const data = await getData()
    return data
}

exports.getForecast = getForecast
