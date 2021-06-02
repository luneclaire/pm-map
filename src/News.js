import React, { useState } from 'react';
import {NaverApi} from './NaverApi.js'



export function News(props){    
    const NewsList = require('./components/NewsList.json')
    
    return (
        <div>
            <div>
                <a href={NewsList.items[0].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[0].title.replaceAll('<b>', '').replaceAll('</b>', '')}
                </a>
                <p>
                {NewsList.items[0].description.replaceAll('<b>', '').replaceAll('</b>', '')}
                </p>
            </div>
            <div>
                <a href={NewsList.items[1].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[1].title.replaceAll('<b>', '').replaceAll('</b>', '')}
                </a>
                <p>
                    {NewsList.items[1].description.replaceAll('<b>', '').replaceAll('</b>', '')}
                </p>
            </div>
            <div>
                <a href={NewsList.items[2].originallink} target="_blank" rel="noopener noreferrer">
                    {NewsList.items[2].title.replaceAll('<b>', '').replaceAll('</b>', '')}
                </a>
                <p>
                    {NewsList.items[2].description.replaceAll('<b>', '').replaceAll('</b>', '')}
                </p>
            </div>
        </div>
    );
};