import { Input } from 'antd';
import React from 'react';
import {AddrFilter} from './AddrFilter';

export function SearchBar({changeAddr}) {
  const { Search } = Input;
  const onSearch = (value) => {
    let sido_sigungu = AddrFilter(value);
    changeAddr(sido_sigungu);  
  }; // 검색창에 엔터 치면 value값으로 전송.
  
  //onSearch = 검색버튼을 눌렀을 때
  return (
    <div style={{padding: '10px'}}>
      <Search placeholder="xx도 xx시 혹은 xx시 xx구 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400, alignSelf: 'center'}}/>
    </div>
  );
}
