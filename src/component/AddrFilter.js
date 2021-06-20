const sido_sigungu = require('.././data/sido_sigungu.json')
export function AddrFilter(input_addr){
  var sido = '';
  var sigungu = '';
  var is_sido = false; //성북구, 서구 같이 앞을 빼고 뒤만 친 경우 처리
  var temp_addr = '';
  var sido_number = 0;
  for(let i = 0; i<17; i++){
    temp_addr = input_addr; //only 시군구 처리용
    if(input_addr.includes(sido_sigungu[i].name[0]) || input_addr.includes(sido_sigungu[i].name[1])){
      sido = sido_sigungu[i].name[0];
      is_sido = true;
      sido_number = i;
      temp_addr = temp_addr.replace(sido_sigungu[i].name[0], '').replace(sido_sigungu[i].name[1], '').replace(' ', ''); //서울 성북구 -> 성북구
      if(temp_addr.charAt(0) === '시') //name이 서울, 서울특별시 뿐이라서 서울시 성북구로 검색하면 시성북구 이런 식으로 표기됨.
        temp_addr = temp_addr.substr(1, temp_addr.length-1);
    }  
  }

  if(is_sido){ //시도가 있는 시군구 or 시도만 있는
    for(let j = 0; j<sido_sigungu[sido_number].regions.length; j++){
      if(temp_addr.includes(sido_sigungu[sido_number].regions[j]) || //종로구
        ((temp_addr.includes(sido_sigungu[sido_number].regions[j].substr(0, sido_sigungu[sido_number].regions[j].length-1))) && //종로->종로구
        (sido_sigungu[sido_number].regions[j].length-1 > 1))){ //서구,중구... 거르기. 놔두면 서귀포도 서구가 인식함.
          sigungu = sido_sigungu[sido_number].regions[j];
      }
    }
  }
  else{ //시도가 없는 시군구
    outer: for(let i = 0; i<17; i++){
      for(let j = 0; j<sido_sigungu[i].regions.length; j++){
        if(temp_addr.includes(sido_sigungu[i].regions[j]) || //종로구
          ((temp_addr.includes(sido_sigungu[i].regions[j].substr(0, sido_sigungu[i].regions[j].length-1))) && //종로->종로구
          (sido_sigungu[i].regions[j].length-1 > 1))){ //서구,중구... 거르기. 놔두면 서귀포도 서구가 인식함.
            sigungu = sido_sigungu[i].regions[j];
            sido = sido_sigungu[i].name[0];
            break outer;
        }
      }
    }
  }

  return sido + ' ' + sigungu;
}