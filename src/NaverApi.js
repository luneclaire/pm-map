import React, { useState, useEffect } from 'react';
import axios from 'axios';
const fs = require('fs');


export function NaverApi(){
  const [newsList, setNewsList] = useState(require('./NewsList.json'));


  const onClick = async () => {
    const response = await axios.get('./news');
    fs.writeFile("NewsList.json", JSON.stringify(response.data, null, 2), function(err){
      if(err){
        console.log(err);
      }
    })
    setNewsList(require('./components/NewsList.json'));
  };

  return(      
      <div>
        <div>
        <button onClick={onClick}>불러오기</button>
        </div>
          <div>
              <a className="newsarea" href={newsList.items[0].originallink} target="_blank" rel="noopener noreferrer">
                  {newsList.items[0].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </a>
              <p>
                  {newsList.items[0].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </p>
          </div>
          <div>
              <a className="newsarea" href={newsList.items[1].originallink} target="_blank" rel="noopener noreferrer">
                  {newsList.items[1].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </a>
              <p>
                  {newsList.items[1].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </p>
          </div>
          <div>
              <a className="newsarea" href={newsList.items[2].originallink} target="_blank" rel="noopener noreferrer">
                  {newsList.items[2].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </a>
              <p>
                  {newsList.items[2].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
              </p>
          </div>
      </div>
  );
}