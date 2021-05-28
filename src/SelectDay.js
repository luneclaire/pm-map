import { Radio } from 'antd';

export function SelectDay() {
  function onChange(e) {
		console.log(`radio checked:${e.target.value}`);
	}

	return (
		<Radio.Group onChange={onChange} defaultValue="today" size="large">
      <Radio.Button value="today">오늘</Radio.Button>
      <Radio.Button value="tomorrow">내일</Radio.Button>
    </Radio.Group>
	);
}
