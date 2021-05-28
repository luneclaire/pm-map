import { Radio } from 'antd';

export function PmData() {
	function onChange(e) {
		console.log(`radio checked:${e.target.value}`);
	}

	return (
		<div className="databox">
			<Radio.Group onChange={onChange} defaultValue="pm" size="large" style={{margin: '5px'}}>
				<Radio.Button value="pm">미세먼지</Radio.Button>
				<Radio.Button value="fpm">초미세먼지</Radio.Button>
    	</Radio.Group>
			<h1 style={{margin: '15px'}}>서울특별시</h1>
			<p style={{fontSize: 'xx-large', margin: '15px'}}>40</p>
		</div>
	);
}