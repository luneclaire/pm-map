import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function News(){
    const [newsList, setNewsList] = useState([{
        description: "",
        link: "",
        thumbnail: "",
        pubDate : "",
        title : ""
    },
    {
        description: "",
        link: "",
        thumbnail: "",
        pubDate : "",
        title : ""
    },
    {
        description: "",
        link: "",
        thumbnail: "",
        pubDate : "",
        title : ""
    }
    ]);
    
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
      {newsList.map((news) => (
        <div className="news">
            <img className = "news-image" src={news.thumbnail} style={{width:"20%", height:"20%"}}/>
            <div>
              <a className="news-title" href={news.link} target="_blank" rel="noopener noreferrer">
                {news.title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </a>
              <p className="news-desc">
                {news.description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </p>
            </div>
        </div>
      ))}
    </div>
  );
}