import React from 'react';
import { SmileTwoTone, MehTwoTone, FrownTwoTone, AlertTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

export function ColorLegend() {
  return (
    <ul className="color-legend">
      <li>
        <SmileTwoTone className="align-left" twoToneColor="#1C3FFD" />
        <span className="alight-right">좋음 ~30</span>
      </li>
      <li>
        <MehTwoTone className="align-left" twoToneColor="#87ae22" />
        <span className="alight-right" />보통 ~80
      </li>
      <li>
        <FrownTwoTone className="align-left" twoToneColor="#FFD10F" />
        <span className="alight-right" /> 나쁨 ~150
      </li>
      <li>
        <AlertTwoTone className="align-left" twoToneColor="#D90000" />
        <span className="alight-right" />&nbsp;&nbsp;&nbsp;최악 151~
      </li>
      <li>
        <CloseCircleTwoTone className="align-left" twoToneColor="#565656" />
        <span className="align-right">정보 없음</span>
      </li>
    </ul>
  );
}
