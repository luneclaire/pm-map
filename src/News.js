import React, { useState } from 'react';
import {NaverApi} from './NaverApi.js'
import './App.css';



export function News({NewsList}){    
    //const NewsList = require('./components/NewsList.json')
    return (      
        <div>
            <div>
                <a className="newsarea" href={NewsList.items[0].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[0].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </a>
                <p>
                    {NewsList.items[0].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </p>
            </div>
            <div>
                <a className="newsarea" href={NewsList.items[1].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[1].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </a>
                <p>
                    {NewsList.items[1].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </p>
            </div>
            <div>
                <a className="newsarea" href={NewsList.items[2].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[2].title.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </a>
                <p>
                    {NewsList.items[2].description.replaceAll('<b>', '').replaceAll('</b>', '').replaceAll('&quot;', '')}
                </p>
            </div>
        </div>
    );
};