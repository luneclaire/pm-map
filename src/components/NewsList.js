import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem.js';
import axios from 'axios';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async를 사용하는 함수 따로 선언
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
            'https://newsapi.org/v2/top-headlines?country=kr&pageSize=5&apiKey=0a8c4202385d4ec1bb93b7e277b3c51f',
            //'https://newsapi.org/v2/everything?qInTitle=bitcoin&sortBy=popularity&apiKey=56b49796ba004932a95b01636f039228'
          );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <NewsListBlock>대기중...</NewsListBlock>;
  }

  if (!articles) {
    // map 함수를 사용하기 전에 해당값이 null인지 확인하자
    // 이 작업을 하지 않으면, 아직 데이터가 없을 때 null에는
    // map 함수가 없기 때문에 렌더링 과정에서 오류난다.
    return null;
  }

  return (
    <NewsListBlock>
      {articles.map(article => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;