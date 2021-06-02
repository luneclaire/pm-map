import React, { useState } from 'react';
import axios from 'axios';
import NewsList from './components/NewsList.js'
import {NaverApi} from './NaverApi.js'

export function News(props){    
    return (
        <div>
            <NaverApi/>
        </div>
    );
};