const axios = require('axios')

const NAVER_CLIENT_ID     = 'aFTNbrc5Jy6sygbQRhZN'
const NAVER_CLIENT_SECRET = 'wxcwuCX9Vr'

async function getNews() {
    const response = await axios.get("https://openapi.naver.com/v1/search/news", {
        params:{
            query  : '미세먼지', //뉴스 검색 키워드
            start  : 1, //검색 시작 위치
            display: 3, //가져올 이미지 갯수
            sort   : 'sim' //정렬 유형 (sim:유사도, date:날짜)
        },
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    })
    if (response) {
        return response.data
    }
}

exports.getNews = getNews
