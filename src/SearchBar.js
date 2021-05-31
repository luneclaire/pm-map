import { Input } from 'antd';
import { PmData } from './PmData';
import React, { useState, Component } from 'react';


export function SearchBar() {
  const { Search } = Input;
  const [addr, setAddr] = useState('안성시');
  
  const onSearch = value => {
    setAddr(value);
    console.log(addr);
  }; // 검색창에 엔터 치면 value값으로 전송.
  
  
  //onSearch = 검색버튼을 눌렀을 때
  return (
    <div>
      <Search placeholder="xx시 xx동 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400}}/>
      <PmData addr = {addr} onSearch = {onSearch}/>
    </div>
  );
}
