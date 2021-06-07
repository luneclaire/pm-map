import { Radio } from 'antd';

export function SelectTab(props) {
  	function onChangeTab(e) {
		props.swapTab();
	}

	return (
		<>
			<Radio.Group onChange={onChangeTab} defaultValue="pm" size="large">
      			<Radio.Button value="pm">미세먼지</Radio.Button>
      			<Radio.Button value="news">뉴스</Radio.Button>
    		</Radio.Group>
		</>
	);
}