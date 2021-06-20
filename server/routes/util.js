const axios = require('axios')
const qs = require('qs');
const sidoNameData = require("./sidoNameMapping.json");

const SERVICE_KEY = 'Vtgkpa6WDF3+rOl7MToep50Jv3ahvFmqv6fcyko7soqyfZTFQTAFCQOiSK7Is0Wud7kLs4WyEzTcRTl3Esbxbg=='
// const SERVICE_KEY = 'JzAjCMSkJKezoT9lpf/ilQVb5808SC4cc7FU83dGJdO939K0UWHTn+j2J6l/axyCityrbAoQLJIV3w8x2hdqmQ=='
// const SERVICE_KEY = 'dC0Mal22V6WU0+Fhs1pxRYGtxCk3gyIU84PpYDzSQJgl1A86QtlR5iPgjNHnNMPjEn55t7YbHljqayKmwclVlg=='
// const SERVICE_KEY = 'G1746kXbwSMNDX+Z+Pl9Fwhq9i7t8+8NvV5vVc0BFactDgkkZEQxlfEguygCbXWlGmtY+cyHh/Nm/S0qq5yuZw=='

async function requestApi(url, addParams) {
    const defaultParams = {
        ServiceKey: SERVICE_KEY,
        numOfRows: 100,
        pageNo: 1,
        ver: '1.0',
        returnType: 'json'
    }
    const queryParams = {...defaultParams, ...addParams}
    const uri = url + qs.stringify(queryParams)

    let { data } = await axios.get(uri)
    data = data.response.body.items

    return data
}

const sidoNameMapping = (sidoName) => {
    const result = sidoNameData.find( data => {
        return data.abbrev === sidoName
    })
    try {
        return result.name
    } catch {
        return sidoName
    }
}


exports.requestApi = requestApi
exports.sidoNameMapping = sidoNameMapping