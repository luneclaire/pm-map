import './App.css';
import { Layout, Tabs } from 'antd';
import { Info } from './Info';
import { PmData } from './PmData';
import { SelectDayPm } from './SelectDayPm';
import { Map } from './Map';
import { SearchBar } from './SearchBar';
import { News } from './News';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const changeAddr = (value) => {
    setAddr(value);
    var Addr = value;
    const split = Addr?.split(' ');
    if(Addr.trim() === split[0]){ //sido만 검색
      for(var i=0; i<SidoDB.length; i++){
        if(split !== undefined && SidoDB[i].sidonm === split[0]){
          setPm(SidoDB[i].pm);
          setFpm(SidoDB[i].fpm);
          setDateTime(SidoDB[i].dateTime);
          break;
        }
        setPm(-1);
        setFpm(-1);
        setDateTime('');
      }
    }
    else{ //sigungu 검색
      for(var i=0; i<SigunguDB.length; i++){
        if(SigunguDB[i].sidonm === split[0] && SigunguDB[i].sigungunm === split[1]){
          setPm(SigunguDB[i].pm);
          setFpm(SigunguDB[i].fpm);
          setDateTime(SigunguDB[i].dateTime);
          break;
        }
        setPm(-1);
        setFpm(-1);
        setDateTime('');
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

