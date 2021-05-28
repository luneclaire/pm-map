import React, { useState, useEffect } from 'react';
import ReactMapGL, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from './HangJeongDong_ver20210401';

export function Map() {
  const MAP_TOKEN = 'pk.eyJ1IjoibHVuZWNsYWlyZSIsImEiOiJja3A2dzRkYnAwMDJtMnBwYW1pbHV2aXN1In0.XDowr_anEYxEmHwwFqqVyA';

  const [ viewport, setViewport ] = useState({
    latitude: 35.905546,
    longitude: 127.935763,
    width: '500px',
    height: '600px',
    zoom: 5.9
    });
  
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={MAP_TOKEN}
      >
        <Source
          id="korea"
          type="geojson"
          data={data}
        />
        <Layer
          id="aa"
          type="fill"
          source="korea"
          paint={{"fill-color": "#b83132", "fill-opacity": 0.4}}
        />
      </ReactMapGL>
    </div>
  );
}