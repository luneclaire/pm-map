import React, { useState, useCallback } from 'react';
import ReactMapGL, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from './Sido';
import { Button } from 'antd';
import { ZoomOutOutlined } from '@ant-design/icons';

export function Map() {
  const MAP_TOKEN = 'pk.eyJ1IjoibHVuZWNsYWlyZSIsImEiOiJja3A2dzRkYnAwMDJtMnBwYW1pbHV2aXN1In0.XDowr_anEYxEmHwwFqqVyA';

  const [ viewport, setViewport ] = useState({
    latitude: 35.905546,
    longitude: 127.935763,
    width: '500px',
    height: '600px',
    zoom: 5.9
    });

  const zoomToClicked = useCallback(event => {
    setViewport({
      ...viewport,
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
      zoom: 7,
    });
  }, []);

  const zoomOut = () => {
    setViewport({
      ...viewport,
      latitude: 35.905546,
      longitude: 127.935763,
      zoom: 5.9,
    });
  }
  
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={MAP_TOKEN}
        onClick={zoomToClicked}
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
      <Button
        type="primary"
        shape="circle"
        icon={<ZoomOutOutlined/>}
        onClick={zoomOut}
      />
    </div>
  );
}