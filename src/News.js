import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

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
  //<b>는 검색어 query인 미세먼지에만 붙어있는데, 필요없어서 제거
  return(
    <div>
        <div>
            <a className="newsarea" href={newsList[0].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[0].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
            </a>
            <p className="descriptionarea">
              {newsList[0].description.slice(0,newsList[0].description.indexOf('[사진')).replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
              <br></br>
              <div className="pubdatearea">
                {newsList[0].pubDate.slice(0,16)}
              </div>
            </p>
        </div>
        <div>
            <a className="newsarea" href={newsList[1].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[1].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
            </a>
            <p className="descriptionarea">
              {newsList[1].description.slice(0,newsList[1].description.indexOf('[사진')).replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
              <br></br>
              <div className="pubdatearea">
                {newsList[1].pubDate.slice(0,16)}
              </div>
            </p>
        </div>
        <div>
            <a className="newsarea" href={newsList[2].originallink} target="_blank" rel="noopener noreferrer">
              {newsList[2].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
            </a>
            <p className="descriptionarea">
              {newsList[2].description.slice(0,newsList[2].description.indexOf('[사진')).replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '\"')}
              <br></br>
              <div className="pubdatearea">
                {newsList[2].pubDate.slice(0,16)}
              </div>
            </p>
        </div>
    </div>
  );
}