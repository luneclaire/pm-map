import { Input } from 'antd';
import React from 'react';

const sido_sigungu = require('./data/sido_sigungu.json')
function AddrFilter(input_addr){
  var sido = '';
  var sigungu = '';
  var is_sido = false;
  var temp_addr = input_addr;
  outer : for(var i = 0; i<17; i++){
    if(input_addr.includes(sido_sigungu[i].name[0]) || input_addr.includes(sido_sigungu[i].name[1])){
      sido = sido_sigungu[i].name[0];
      is_sido = true; //성북구, 서구 같이 앞을 빼고 뒤만 친 경우 처리
    }
      if(is_sido){
        temp_addr = input_addr;
        temp_addr = temp_addr.replace(sido_sigungu[i].name[0], '').replace(sido_sigungu[i].name[1], '').replace(' ', '');
      }

      inner : for(var j = 0; j<sido_sigungu[i].regions.length; j++){
        if(temp_addr.includes(sido_sigungu[i].regions[j]) || //종로구
          ((temp_addr.includes(sido_sigungu[i].regions[j].substr(0, sido_sigungu[i].regions[j].length-1))) && //종로->종로구
          (sido_sigungu[i].regions[j].length-1 > 1))){ //서구,중구... 거르기. 놔두면 서귀포도 서구가 인식함.
            sigungu = sido_sigungu[i].regions[j];
            if(sido == ''){
              sido = sido_sigungu[i].name[0];
              break outer;
            }
            if(is_sido)
              break outer;
        }
      } 
  }
  return sido + ' ' + sigungu;
}

export function SearchBar(props) {
  const { Search } = Input;
  const onSearch = (value) => {
    console.log(value);
    var sido_sigungu = AddrFilter(value);
    console.log(sido_sigungu);
    props.changeAddr(sido_sigungu);  
  }; // 검색창에 엔터 치면 value값으로 전송.
  
  //onSearch = 검색버튼을 눌렀을 때
  return (
    <div>
      <Search placeholder="xx시 xx동 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400}}/>
    </div>
  );
}
