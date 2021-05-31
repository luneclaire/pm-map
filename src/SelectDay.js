import { Radio } from 'antd';

export function SelectDay(props) {
  	function onChangeDay(e) {
		console.log('Day radio checked:${e.target.value}');
		props.swapDay();
	}
	function onChangePm(e) {
		console.log('Pm radio checked:${e.target.value}');
		props.swapPm();
	}

	return (
		<>
		<Radio.Group onChange={onChangeDay} defaultValue="today" size="large">
      		<Radio.Button value="today">오늘</Radio.Button>
      		<Radio.Button value="tomorrow">내일</Radio.Button>
    	</Radio.Group>
		<Radio.Group onChange={onChangePm} defaultValue="pm" size="large" style={{marginLeft: '165px'}}>
			<Radio.Button value="pm">미세먼지</Radio.Button>
			<Radio.Button value="fpm">초미세먼지</Radio.Button>
		</Radio.Group>
		</>
	);
}
