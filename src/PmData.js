import React from 'react'
import { Empty } from 'antd'
import { SmileTwoTone, MehTwoTone, FrownTwoTone, AlertTwoTone} from '@ant-design/icons';

export function DataZone(val){
	if (val.val === -1) { return <><Empty description={false}/><p style={{fontSize: "medium"}}>측정 데이터가 없습니다.</p></>}
	else if (val.val < 31) { return <SmileTwoTone twoToneColor = "#1C3FFD" style={{fontSize: '400%'}}/> }
	else if (val.val < 81) { return <MehTwoTone twoToneColor = "#87ae22" style={{fontSize: '400%'}}/> }
	else if (val.val < 151) { return <FrownTwoTone twoToneColor = "#FFD10F" style={{fontSize: '400%'}}/> }
	else { return <AlertTwoTone twoToneColor = "#D90000" style={{fontSize: '400%'}}/> }
}

export function PmData({addr, pm, fpm, dateTime, isToday}) {
	return (
		<div className="databox">
			
			<p style={{fontSize: 'xx-large', margin: '15px'}}>
				{
					addr === '' || addr === ' '
					? (isToday ? <p>지역을 검색하거나 지도를 클릭하세요</p> : <p>내일 예보를 보고 계십니다.</p>)
					:
					<>
						<h1 style={{fontSize: 'x-large', margin: '15px'}}>위치: {addr}</h1>	
						<div className = "datazone">
							<div>
								<DataZone val = {pm}/>
								{pm !== -1 ? <p>미세먼지: {pm}</p> : <p>미세먼지</p>}
							</div>
							<div>
								<DataZone val = {fpm}/>
								{fpm !== -1 ? <p>초미세먼지: {fpm}</p> : <p>초미세먼지</p>}
							</div>
						</div>
						<div style={{fontSize: 'small'}}>측정일시:{dateTime}</div>
					</>
				}
			</p>
		</div>
	);
}
