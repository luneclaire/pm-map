import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { News } from './News';

const request = require('request')
const fs = require('fs');
const NAVER_CLIENT_ID     = 'aFTNbrc5Jy6sygbQRhZN'
const NAVER_CLIENT_SECRET = 'wxcwuCX9Vr'



export function NaverApi(){
  const [newsList, setNewsList] = useState(null);
  const onClick = async () => {
    const url = 'https://openapi.naver.com/v1/search/news';

    const response = await axios.get(url, {
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
    }, function(err, res, body){
      let json = JSON.parse(body) //json으로 파싱 
      console.log(json)
      fs.writeFile("NewsList.json", JSON.stringify(json, null, 2), function(err){
        if(err){
          console.log(err);
        }
      })
      //setNewsList(response.data);
    })
  };

  return(
    <div>
      <button onClick={onClick}>새로고침</button>
      {JSON.stringify(newsList, null, 2)}
    </div>
  );
}