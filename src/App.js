import './App.css';
import { Layout } from 'antd';
import { Info } from './Info';
import { PmData } from './PmData';
import { SelectDay } from './SelectDay';
import { Map } from './Map';
import { SearchBar } from './SearchBar';
import { News } from './News';
import { NaverApi } from './NaverApi';
import React, { useState, Component, useEffect } from 'react';
import axios from 'axios';





function App() {
  const { Header, Footer, Sider, Content } = Layout;

  const [SidoDB, setSidoDB] = useState(null);
  const [SigunguDB, setSigunguDB] = useState(null);

  const [pmSwitch, setPmSwitch] = useState(true)
  const [daySwitch, setDaySwitch] = useState(true)
  const [addr, setAddr] = useState('');
  const [pm, setPm] = useState(0);
  const [fpm, setFpm] = useState(0);

  const swapPm = () =>{
    setPmSwitch(!pmSwitch)
  }
  const swapDay = () =>{
    setDaySwitch(!daySwitch)
  }
  const changeAddr = (value) =>{
    //var sido_sigungu = AddrFilter(value);
    setAddr(value);
    var Addr = value;
    const split = Addr?.split(' ');
    if(Addr == split){ //sido 검색
      for(var i=0; i<SidoDB.result.length; i++){
        if( split !== undefined && SidoDB.result[i].sidonm == split[0]){
          setPm(SidoDB.result[i].pm);
          setFpm(SidoDB.result[i].fpm);
          console.log(SidoDB.result[i].pm);
          break;
        }
      }
    }
    else{ //sigungu 검색
      for(var i=0; i<SigunguDB.result.length; i++){
        if(SigunguDB.result[i].sidonm == split[0] && SigunguDB.result[i].sigungunm == split[1]){
          setPm(SigunguDB.result[i].pm);
          setFpm(SigunguDB.result[i].fpm);
          break;
        }
      }
    }
  }

  //db에서 sido, sigungu 데이터 받아오기
  useEffect(() => {
    const fetchSidoData = async () => {
      try {
        const response = await axios.get('./sido')
        //yconsole.log(response)
        setSidoDB(response.data)
      } catch (error){
        console.log(error)
      }
    }
    const fetchSigunguData = async () => {
      try {
        const response = await axios.get('./sigungu')
        setSigunguDB(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSidoData()
    fetchSigunguData()
  }, []);

  return (
    <Layout className="pm-app">
      <Header>
        <p className="title">미세먼지 지도</p>
      </Header>
      <Layout>
        <Sider width={600} className="maparea">
          <SelectDay swapPm = {swapPm} swapDay = {swapDay}/>
          <Map pmSwitch = {pmSwitch} changeAddr = {changeAddr} SidoDB = {SidoDB} SigunguDB = {SigunguDB} />
        </Sider>
        <Content className="pmdataarea">
          <SearchBar changeAddr = {changeAddr}/>
          <PmData addr = {addr} pm = {pm} fpm = {fpm} pmSwitch = {pmSwitch} daySwitch = {daySwitch}/>
          <NaverApi/>
        </Content>
      </Layout>
      <Footer>
        <Info/>
      </Footer>
    </Layout>
  );
}

export default App;

