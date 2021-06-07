import { Radio } from 'antd';

export function SelectPmTabOn(props) {
  	function onChangePmTabOn(e) {
		props.swapPmTabOn();
	}

	return (
		<>
			<Radio.Group onChange={onChangePmTabOn} defaultValue="pm" size="large">
      			<Radio.Button value="pm">미세먼지</Radio.Button>
      			<Radio.Button value="news">뉴스</Radio.Button>
    		</Radio.Group>
		</>
	);
}