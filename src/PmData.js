import { Radio } from 'antd';

export function PmData() {
	function onChange(e) {
		console.log(`radio checked:${e.target.value}`);
	}

	const addr = '서울특별시'
	{/*표기할 주소 받아오기*/}
	const pm = 40
	{/*미세/초미세에 따른 값 변화 + 지역에 따른 값 변화 동시에 처리*/}
	return (
		<div className="databox">
			<h1 style={{margin: '15px'}}>{addr}</h1>
			<p style={{fontSize: 'xx-large', margin: '15px'}}>{pm}</p>
		</div>
	);
}