const request = require('request')
const fs = require('fs');
const NAVER_CLIENT_ID     = 'aFTNbrc5Jy6sygbQRhZN'
const NAVER_CLIENT_SECRET = 'wxcwuCX9Vr'
const option = {
    query  : '미세먼지', //뉴스 검색 키워드
    start  : 1, //검색 시작 위치
    display: 3, //가져올 이미지 갯수
    sort   : 'sim', //정렬 유형 (sim:유사도, date:날짜)
  }
  

request.get({
  uri:'https://openapi.naver.com/v1/search/news', //xml 요청 주소는 https://openapi.naver.com/v1/search/image.xml
  qs :option,
  headers:{
    'X-Naver-Client-Id':NAVER_CLIENT_ID,
    'X-Naver-Client-Secret':NAVER_CLIENT_SECRET
  }
  }, function(err, res, body) {
    let json = JSON.parse(body) //json으로 파싱 
    console.log(json)
    fs.writeFile("News.json", JSON.stringify(json, null, 2), function(err){
      if(err){
        console.log(err);
      }
    })
})
