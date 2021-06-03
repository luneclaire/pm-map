import './App.css';
import { Layout } from 'antd';
import { Info } from './Info';
import { PmData } from './PmData';
import { SelectDay } from './SelectDay';
import { Map } from './Map';
import { SearchBar } from './SearchBar';
import { News } from './News';
import React, { useState, Component } from 'react';





function App() {
  const { Header, Footer, Sider, Content } = Layout;
  const [pmSwitch, setPmSwitch] = useState(true)
  const [daySwitch, setDaySwitch] = useState(true)
  const [addr, setAddr] = useState('');
  const [pm, setPm] = useState(50);
  const [fpm, setFpm] = useState(100);

  const swapPm = () =>{
    setPmSwitch(!pmSwitch)
  }
  const swapDay = () =>{
    setDaySwitch(!daySwitch)
  }
  const changeAddr = (value) =>{
    //var sido_sigungu = AddrFilter(value);
    setAddr(value);
  }

  return (
    <Layout className="pm-app">
      <Header>
        <p className="title">미세먼지 지도</p>
      </Header>
      <Layout>
        <Sider width={600} className="maparea">
          <SelectDay swapPm = {swapPm} swapDay = {swapDay}/>
          <Map pmSwitch = {pmSwitch} changeAddr = {changeAddr}/>
        </Sider>
        <Content className="pmdataarea">
          <SearchBar changeAddr = {changeAddr}/>
          <PmData addr = {addr} pm = {pm} fpm = {fpm} pmSwitch = {pmSwitch} daySwitch = {daySwitch}/>
          <News/>
        </Content>
      </Layout>
      <Footer>
        <Info/>
      </Footer>
    </Layout>
  );
}

export default App;

