import './App.css';
import { Layout, Tabs } from 'antd';
import { Info } from './component/Info';
import { PmData } from './component/PmData';
import { SelectDayPm } from './component/SelectDayPm';
import { Map } from './component/Map';
import { SearchBar } from './component/SearchBar';
import { News } from './component/News';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSidoData, getSigunguData } from './util';

function App() {
  const { Header, Footer, Sider, Content } = Layout;
  const { TabPane } = Tabs

  const [SidoDB, setSidoDB] = useState(null);
  const [SigunguDB, setSigunguDB] = useState(null);
  const [forecastDB, setForecastDB] = useState(null);

  const [isPm, setIsPm] = useState(true)
  const [isToday, setIsToday] = useState(true)
  const [addr, setAddr] = useState('');
  const [pm, setPm] = useState('');
  const [fpm, setFpm] = useState('');
  const [dateTime, setDateTime] = useState('');

  const swapIsPm = () => {
    setIsPm(!isPm)
  }
  const swapIsToDay = () => {
    setIsToday(!isToday)
  }
  const changeAddr = (newAddr) => {
    if(newAddr === undefined)
      newAddr = ' ';
    setAddr(newAddr);
    const split = newAddr?.split(' ');
    if(newAddr.trim() === split[0]){ //sido만 검색
      const sidoData = getSidoData(SidoDB.data, split[0])
      setPm(sidoData[0])
      setFpm(sidoData[1])
      setDateTime(SidoDB.dateTime)
    }
    else{ //sigungu 검색
      const sigunguData = getSigunguData(SigunguDB, split[0], split[1])
      setPm(sigunguData[0])
      setFpm(sigunguData[1])
      setDateTime(sigunguData[2])
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
          <div>
            <Tabs size='large' defaultActiveKey='pm' centered>
              <TabPane tab='미세먼지' key='pm'>
                <PmData addr = {addr} pm = {pm} fpm = {fpm} dateTime = {dateTime} isToday = {isToday}/>
              </TabPane>
              <TabPane tab='뉴스' key='news'>
                <News/>
              </TabPane>
            </Tabs>
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

