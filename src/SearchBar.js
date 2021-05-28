import { Input } from 'antd';

export function SearchBar() {
  const { Search } = Input;
  
  const onSearch = value => console.log(value);

  return (
    <Search placeholder="xx시 xx동 형태로 검색해주세요" onSearch={onSearch} style={{ width: 400}} />
  );
}
