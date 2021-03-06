import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function News(){
    const [newsList, setNewsList] = useState([]);
    
  useEffect(() => {
    const getNews = async () => {
        try{
            const response = await axios.get('./news')
            setNewsList(response.data)
        } catch (error){
            console.log(error)
        }
    }
    getNews()
  }, []);
  
  return(
    <div>
      {newsList.map((news, index) => (
        <div className="news">
            <a className="news-title" href={news.link} target="_blank" rel="noopener noreferrer">
              {news.title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </a>
            <div className="news-detail">
              <img className = "news-image" src={news.thumbnail} alt="thumbnail" style={{width:"20%", height:"20%"}}/>
              <p className="news-desc">
                {news.description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </p>
            </div>
              <div className="news-pubDate">
                {news.pubDate.slice(0,16)}
              </div>
        </div>
      ))}
    </div>
  );
}