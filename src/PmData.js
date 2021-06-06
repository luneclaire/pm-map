import React from 'react'
import { SmileTwoTone, MehTwoTone, FrownTwoTone, AlertTwoTone} from '@ant-design/icons';

export function DataZone(val){
	if (val.val == 0) { return <p>데이터가 없습니다.</p>}
	else if (val.val < 31) { return <SmileTwoTone twoToneColor = "#1C3FFD" style={{fontSize: '400%'}}/> }
	else if (val.val < 81) { return <MehTwoTone twoToneColor = "#87ae22" style={{fontSize: '400%'}}/> }
	else if (val.val < 151) { return <FrownTwoTone twoToneColor = "#FFD10F" style={{fontSize: '400%'}}/> }
	else { return <AlertTwoTone twoToneColor = "#D90000" style={{fontSize: '400%'}}/> }
}

export function PmData({addr, pm, fpm, daySwitch}) {
	return (
		<div className="databox">
			
			<p style={{fontSize: 'xx-large', margin: '15px'}}>
				{
					addr == '' || addr == ' '
					? (daySwitch ? <p>지역을 검색하거나 지도를 클릭하세요</p> : <p>내일 예보를 보고 계십니다.</p>)
					:
					<>
						<h1 style={{fontSize: 'x-large', margin: '15px'}}>위치: {addr}</h1>	
						<div className = "datazone">
							<div>
								<DataZone val = {pm}/>
								<p>미세먼지: {pm}</p>
							</div>
							<div>
								<DataZone val = {fpm}/>
								<p>초미세먼지: {fpm}</p>
							</div>
						</div>
					</>
				}
			</p>
		</div>
	);
}
