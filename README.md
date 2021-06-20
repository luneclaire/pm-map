# 미세먼지 지도

Node.js, React로 개발한 미세먼지 수치 조회 웹 서비스입니다.

더 자세한 정보는 [wiki](https://github.com/luneclaire/pm-map/wiki)를 참조하세요.

## Overview
![2021-06-16 16_06_16-React App 외 페이지 2개 - 개인 - Microsoft​ Edge](https://user-images.githubusercontent.com/37368388/122173580-d48b3b00-cebc-11eb-879b-d8c8efe57c97.jpg)

## 구동 방법
1. Clone repository
2. Install dependencies
3. Run
~~~
git clone https://github.com/luneclaire/pm-map/
cd pm-map
yarn
yarn start
~~~
`localhost://3000`에서 확인

## 레퍼런스
- 디자인: [Ant Design](https://ant.design/)
- 지도: [react-map-gl](https://visgl.github.io/react-map-gl/)
- API
  - [네이버 뉴스 API](https://developers.naver.com/docs/search/news/)
  - 에어코리아 오픈 API
    - [한국환경공단 에어코리아 측정소정보](https://data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073877)
    - [한국환경공단 에어코리아 대기오염정보](https://data.go.kr/data/15073861/openapi.do)
