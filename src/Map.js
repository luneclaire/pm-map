import React, { useState, useCallback } from 'react';
import ReactMapGL, { Layer, Source, LinearInterpolator, WebMercatorViewport } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import sidoGeoJson from './Sido';
import sigunguGeoJson from './Sigungu';
import { Button } from 'antd';
import { ZoomOutOutlined } from '@ant-design/icons';
import bbox from '@turf/bbox'

export function Map( {pmSwitch, changeAddr, SidoDB, SigunguDB} ) {
  const MAP_TOKEN = 'pk.eyJ1IjoibHVuZWNsYWlyZSIsImEiOiJja3A2dzRkYnAwMDJtMnBwYW1pbHV2aXN1In0.XDowr_anEYxEmHwwFqqVyA';

  const pmOrFpm = pmSwitch ? "pm" : "fpm"

  const gradient = {
    property: pmOrFpm,
    stops: [
      [0, '#565656'], //미세먼지 수치가 주어지지 않았을 때 회색
      [1, '#1C3FFD'], //파랑
      [2, '#0080c5'], //하늘
      [3, '#168039'], //초록
      [4, '#87ae22'], //연두
      [5, '#FFD10F'], //노랑
      [6, '#f48000'], //주황
      [7, '#D90000'], //빨강
    ]
}

  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedSido, setSelectedSido] = useState(null);

  //시도 geojson에 db에서 받아온 pm, fpm 수치 추가
  const SidoDBGeo = SidoDB != null ? {
    type: 'FeatureCollection',
    features: sidoGeoJson.features.map(geo => {
      const sidoDBdata = SidoDB.result.filter( sido => { return sido.sidonm === geo.properties.sidonm} )
      const properties = (typeof sidoDBdata[0] != "undefined" || sidoDBdata === [] ) ? {
        ...geo.properties,
        pm: (sidoDBdata[0].pm)*(7/160)+1,
        fpm: (sidoDBdata[0].fpm)*(7/100)+1
      } : { ...geo.properties, pm: -1, fpm: -1 }
      return {...geo, properties}
    })
  } : { sidoGeoJson }

  const SigunguDBGeo = SigunguDB != null ? {
    type: 'FeatureCollection',
    features: sigunguGeoJson.features.map(geo => {
      const sigunguDBdata = SigunguDB.result.filter( sigungu => {
        const sggSplit = geo.properties.sgg_nm.split(' ')
        return sigungu.sigungunm === sggSplit[1] && sigungu.sidonm === sggSplit[0]
      } )
      const properties = (typeof sigunguDBdata[0] != "undefined" || sigunguDBdata === [] ) ? {
        ...geo.properties,
        sidonm: (sigunguDBdata[0].sidonm),
        onlySGG: (sigunguDBdata[0].sigungunm),
        pm: (sigunguDBdata[0].pm)*(7/160)+1,
        fpm: (sigunguDBdata[0].fpm)*(7/100)+1
      } : {
        ...geo.properties,
        sidonm: geo.properties.sgg_nm.split(' ')[0],
        onlySGG: geo.properties.sgg_nm.split(' ')[1],
        pm: -1,
        fpm: -1 }
      return {...geo, properties}
    })
  } : { sigunguGeoJson }

  //초기 viewport setting
  const [ viewport, setViewport ] = useState({
    latitude: 35.905546,
    longitude: 127.935763,
    width: '500px',
    height: '600px',
    zoom: 5.9,
    });

  //지도에 클릭한 시도로 줌 인 (시도 크기에 맞게)
  const onClick = (event) => {
    console.log(event)
    const feature = event.features ? event.features[0] : null
    if (!selectedSido && feature) { //줌인된 상태에서는 주변 시도 골라도 이동되지 않게 함 (무조건 전체 줌 아웃 후 시도 클릭으로 줌 가능)
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      const vp = new WebMercatorViewport(viewport);
      const {longitude, latitude, zoom} = vp.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        { padding: 40 }
      );

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y]
        }),
        transitionDuration: 500
      })

      setIsZoomed(true)
      setSelectedSido(event.features[0].properties.sidonm)
      changeAddr(event.features[0].properties.sidonm)
    } else if (feature) { changeAddr(event.features[0].properties.sgg_nm)}
  }

  //초기 줌 수치로 돌아오기
  const zoomOut = () => {
    setViewport({
      ...viewport,
      latitude: 35.905546,
      longitude: 127.935763,
      zoom: 5.9,
    });
    setIsZoomed(false)
    setSelectedSido(null)
    changeAddr(null)
  }

  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature ? {
        features: hoveredFeature,
        x: offsetX,
        y: offsetY
      }
      : null
    )
  }, [])
  
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={MAP_TOKEN}
        onHover={onHover}
        onClick={onClick}
        onViewportChange={v => setViewport(v)}
      >
        {SidoDB && <Source type="geojson" data={selectedSido ? SigunguDBGeo : SidoDBGeo }>
          { !selectedSido ?
          <Layer
            id="data"
            type="fill"
            paint={
              {'fill-color': gradient, "fill-opacity": 0.4}}
          />
          :
          <Layer
            id="data"
            type="fill"
            paint={
              {'fill-color': gradient, "fill-opacity": 0.4}}
            filter={['==', 'sidonm', selectedSido]}
          />
          }
        </Source>}
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            {isZoomed ? hoverInfo.features.properties.onlySGG  : hoverInfo.features.properties.sidonm }
          </div>
        )}
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