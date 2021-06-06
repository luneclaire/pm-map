const axios = require('axios')
const cheerio = require("cheerio");
const { link } = require('fs');

const getHtml = async (link) => {
  try {
    return await axios.get(link);
  } catch (error) {
    console.error(error);
  }
};



const NAVER_CLIENT_ID     = 'aFTNbrc5Jy6sygbQRhZN'
const NAVER_CLIENT_SECRET = 'wxcwuCX9Vr'

async function getNews() {
    const response = await axios.get("https://openapi.naver.com/v1/search/news", {
        params:{
            query  : '미세먼지', //뉴스 검색 키워드
            start  : 1, //검색 시작 위치
            display: 3, //가져올 뉴스 갯수
            sort   : 'sim' //정렬 유형 (sim:유사도, date:날짜)
        },
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    })
    if (response) {
        result = []
        for(const news of response.data.items){
            const html = await getHtml(news.link)
            const $ = cheerio.load(html.data);
            const thumbnail = $("#articleBodyContents").find("span.end_photo_org > img").attr('src');
            result.push({
                title: news.title,
                link: news.link,
                description: news.description,
                pubDate: news.pubDate,
                thumbnail: thumbnail
            })
        }
    }
    return result
    
}

exports.getNews = getNews
