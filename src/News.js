import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function News(){
    const [newsList, setNewsList] = useState([{
        description: "",
        link: "",
        originallink: "",
        pubDate : "",
        title : ""
    },
    {
        description: "",
        link: "",
        originallink: "",
        pubDate : "",
        title : ""
    },
    {
        description: "",
        link: "",
        originallink: "",
        pubDate : "",
        title : ""
    }
    ]);
    
  useEffect(() => {
    const getNews = async () => {
        try{
            const response = await axios.get('./news')
            setNewsList(response.data.items)
        } catch (error){
            console.log(error)
        }
    }
    getNews()
  }, []);
  
  return(
    <div>
        <div>
            <a className="newsarea" href={newsList[0].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[0].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </a>
            <p>
               {newsList[0].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </p>
        </div>
        <div>
            <a className="newsarea" href={newsList[1].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[1].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </a>
            <p>
               {newsList[1].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </p>
        </div>
        <div>
            <a className="newsarea" href={newsList[2].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[2].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </a>
            <p>
               {newsList[2].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
            </p>
        </div>
    </div>
  );
}