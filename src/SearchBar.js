import { Input } from 'antd';
import React from 'react';

const sido_sigungu = require('./data/sido_sigungu.json')
function AddrFilter(input_addr){
  var sido = '';
  var sigungu = '';
  var is_sido = false; //성북구, 서구 같이 앞을 빼고 뒤만 친 경우 처리
  var temp_addr = '';
  outer : for(let i = 0; i<17; i++){
    temp_addr = input_addr; //only 시군구 처리용
    if(input_addr.includes(sido_sigungu[i].name[0]) || input_addr.includes(sido_sigungu[i].name[1])){
      sido = sido_sigungu[i].name[0];
      is_sido = true; 
    }
    if(is_sido){
      temp_addr = temp_addr.replace(sido_sigungu[i].name[0], '').replace(sido_sigungu[i].name[1], '').replace(' ', ''); //서울 성북구 -> 성북구
      if(temp_addr.charAt(0) === '시') //name이 서울, 서울특별시 뿐이라서 서울시 성북구로 검색하면 시성북구 이런 식으로 표기됨.
        temp_addr = temp_addr.substr(1, temp_addr.length-1);
      if(temp_addr === '') //광역시와 경기도 광주시 처리
        break;
    }

    for(let j = 0; j<sido_sigungu[i].regions.length; j++){
      if(temp_addr.includes(sido_sigungu[i].regions[j]) || //종로구
        ((temp_addr.includes(sido_sigungu[i].regions[j].substr(0, sido_sigungu[i].regions[j].length-1))) && //종로->종로구
        (sido_sigungu[i].regions[j].length-1 > 1))){ //서구,중구... 거르기. 놔두면 서귀포도 서구가 인식함.
          sigungu = sido_sigungu[i].regions[j];
          if(sido === '' && temp_addr === input_addr){ //시군구만 입력 시
            sido = sido_sigungu[i].name[0];
            //break outer; //break outer을 놔두면 광주 서구도 부산 서구로 인식해서 빠져버림
          }
          if(is_sido)
            break outer;
      }
    }
    is_sido = false;
  }
  return sido + ' ' + sigungu;
}

export function SearchBar({changeAddr}) {
  const { Search } = Input;
  const onSearch = (value) => {
    var sido_sigungu = AddrFilter(value);
    changeAddr(sido_sigungu);  
  }; // 검색창에 엔터 치면 value값으로 전송.
  
  //onSearch = 검색버튼을 눌렀을 때
  return (
    <div style={{padding: '10px'}}>
      <Search placeholder="xx시 xx동 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400, alignSelf: 'center'}}/>
    </div>
  );
}
