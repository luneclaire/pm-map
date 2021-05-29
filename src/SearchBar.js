import { Input } from 'antd';

export function SearchBar() {
  const { Search } = Input;
  
  const onSearch = value => console.log(value); // 검색창에 엔터 치면 value값으로 전송.

  return (
    <Search placeholder="xx시 xx동 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400}} />
  );
}
