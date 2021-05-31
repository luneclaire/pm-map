import './App.css';
import { Layout } from 'antd';
import { Info } from './Info';
import { PmData } from './PmData';
import { SelectDay } from './SelectDay';
import { Map } from './Map';
import { SearchBar } from './SearchBar';

function App() {
  const { Header, Footer, Sider, Content } = Layout;

  return (
    <Layout className="pm-app">
      <Header>
        <p className="title">미세먼지 지도</p>
      </Header>
      <Layout>
        <Sider width={600} className="maparea">
          <SelectDay/>
          <Map/>
        </Sider>
        <Content className="pmdataarea">
          <SearchBar/>
        </Content>
      </Layout>
      <Footer>
        <Info/>
      </Footer>
    </Layout>
  );
}

export default App;
