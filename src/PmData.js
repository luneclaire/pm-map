import { Radio } from 'antd';
import { SearchBar } from './SearchBar';
import React, {useState, useEffect, Component} from 'react'


export function PmData(props) {
	const [addr, setAddr] = useState(props.addr);
    const [pm, setPm] = useState(50);
    const [fpm, setFpm] = useState(100);
	
	//const changeAddr = (props.)

	return (
		<div className="databox">
			<h1 style={{margin: '15px'}}>위치: {addr}</h1>	
			<p style={{fontSize: 'xx-large', margin: '15px'}}>{pm}</p>
		</div>
	);
}
