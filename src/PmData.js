import { Radio } from 'antd';
import { SearchBar } from './SearchBar';
import React, {useState, useEffect, Component} from 'react'


export function PmData(props) {

	return (
		<div className="databox">
			<h1 style={{margin: '15px'}}>위치: {props.addr}</h1>	
			<p style={{fontSize: 'xx-large', margin: '15px'}}>
				{
					props.daySwitch == true //조건에 따라서 미세먼지 띄울지 초미세먼지 띄울지
					? <p2>오늘</p2>
					: <p2>내일</p2>
				}
				{
					props.pmSwitch == true //조건에 따라서 미세먼지 띄울지 초미세먼지 띄울지
					? <p2>{props.pm}</p2>
					: <p2>{props.fpm}</p2>
				}
			</p>
		</div>
	);
}
