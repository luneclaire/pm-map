import { Radio } from 'antd';

export function SelectDayPm(props) {
  	function onChangeIsToDay(e) {
		console.log('Day radio checked:${e.target.value}');
		props.swapIsToDay();
	}
	function onChangeIsPm(e) {
		console.log('Pm radio checked:${e.target.value}');
		props.swapIsPm();
	}

	return (
		<>
		<Radio.Group onChange={onChangeIsToDay} defaultValue="today" size="large">
      		<Radio.Button value="today">오늘</Radio.Button>
      		<Radio.Button value="tomorrow">내일</Radio.Button>
    	</Radio.Group>
		<Radio.Group onChange={onChangeIsPm} defaultValue="pm" size="large" style={{marginLeft: '165px'}}>
			<Radio.Button value="pm">미세먼지</Radio.Button>
			<Radio.Button value="fpm">초미세먼지</Radio.Button>
		</Radio.Group>
		</>
	);
}
