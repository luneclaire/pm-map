import './App.css';
import { Layout } from 'antd';
import { Info } from './Info';
import { PmData } from './PmData';
import { SelectDayPm } from './SelectDayPm';
import { Map } from './Map';
import { SearchBar } from './SearchBar';
import { News } from './News';
import {SelectPmTabOn} from './SelectPmTabOn'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const { Header, Footer, Sider, Content } = Layout;

  const [SidoDB, setSidoDB] = useState(null);
  const [SigunguDB, setSigunguDB] = useState(null);
  const [forecastDB, setForecastDB] = useState(null);

  const [isPm, setIsPm] = useState(true)
  const [isToday, setIsToday] = useState(true)
  const [pmTabOn, setPmTabOn] = useState(true)
  const [addr, setAddr] = useState('');
  const [pm, setPm] = useState('');
  const [fpm, setFpm] = useState('');

  const swapIsPm = () => {
    setIsPm(!isPm)
  }
  const swapIsToDay = () => {
    setIsToday(!isToday)
  }
  const swapPmTabOn = () => {
    setPmTabOn(!pmTabOn)
  }
  const changeAddr = (value) => {
    setAddr(value);
    var Addr = value;
    const split = Addr?.split(' ');
    if(Addr.trim() === split[0]){ //sido만 검색
      for(var i=0; i<SidoDB.result.length; i++){
        if(split !== undefined && SidoDB.result[i].sidonm === split[0]){
          setPm(SidoDB.result[i].pm);
          setFpm(SidoDB.result[i].fpm);
          break;
        }
        setPm(-1);
        setFpm(-1);
      }
    }
    else{ //sigungu 검색
      for(var i=0; i<SigunguDB.result.length; i++){
        if(SigunguDB.result[i].sidonm === split[0] && SigunguDB.result[i].sigungunm === split[1]){
          setPm(SigunguDB.result[i].pm);
          setFpm(SigunguDB.result[i].fpm);
          break;
        }
        setPm(-1);
        setFpm(-1);
      }
    }
  }

  //db에서 sido, sigungu 데이터 받아오기
  useEffect(() => {
    const fetchSidoData = async () => {
      try {
        const response = await axios.get('./sido')
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
    const fetchForecastData = async () => {
      try {
        const response = await axios.get('./forecast')
        setForecastDB(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSidoData()
    fetchSigunguData()
    fetchForecastData()
  }, []);

  return (
    <Layout className="pm-app">
      <Header>
        <p className="title">미세먼지 지도</p>
      </Header>
      <Layout>
        <Sider width={510} className="maparea">
          <SelectDayPm swapIsPm = {swapIsPm} swapIsToDay = {swapIsToDay}/>
          <Map isPm = {isPm} isToday = {isToday} changeAddr = {changeAddr} addr = {addr} SidoDB = {SidoDB} SigunguDB = {SigunguDB} forecastDB = {forecastDB}/>
        </Sider>
        <Content className="pmdataarea">
          <SearchBar changeAddr = {changeAddr}/>
          <SelectPmTabOn swapPmTabOn = {swapPmTabOn}/>
          <div>
            {
              pmTabOn
              ? <PmData addr = {addr} pm = {pm} fpm = {fpm} isPm = {isPm} isToday = {isToday}/>
              : <News/>
            }
          </div>
        </Content>
      </Layout>
      <Footer>
        <Info/>
      </Footer>
    </Layout>
  );
}

export default App;

