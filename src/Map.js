import React, { useState, useCallback } from 'react';
import ReactMapGL, { Layer, Source, LinearInterpolator, WebMercatorViewport } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from './Sido';
import { Button } from 'antd';
import { ZoomOutOutlined } from '@ant-design/icons';
import bbox from '@turf/bbox'

export function Map(props) {
  const MAP_TOKEN = 'pk.eyJ1IjoibHVuZWNsYWlyZSIsImEiOiJja3A2dzRkYnAwMDJtMnBwYW1pbHV2aXN1In0.XDowr_anEYxEmHwwFqqVyA';

  const MOCK_DATA = [
    {sidonm: "서울특별시", pm: 40, fpm: 32},
    {sidonm: "부산광역시", pm: 3, fpm: 80},
    {sidonm: "대구광역시", pm: 11, fpm: 3},
    {sidonm: "인천광역시", pm: 20, fpm: 11},
    {sidonm: "광주광역시", pm: 50, fpm: 47},
    {sidonm: "대전광역시", pm: 90, fpm: 79},
    {sidonm: "울산광역시", pm: 150, fpm: 80},
    {sidonm: "세종특별자치시", pm: 60, fpm: 30},
    {sidonm: "경기도", pm: 40, fpm: 12},
    {sidonm: "강원도", pm: 35, fpm: 87},
    {sidonm: "충청북도", pm: 20, fpm: 99},
    {sidonm: "충청남도", pm: 110, fpm: 70},
    {sidonm: "전라북도", pm: 140, fpm: 20},
    {sidonm: "전라남도", pm: 90, fpm: 10},
    {sidonm: "경상북도", pm: 80, fpm: 30},
    {sidonm: "경상남도", pm: 70, fpm: 70},
    {sidonm: "제주특별자치도", pm: 50, fpm: 60}
  ]

  const pmOrFpm = props.pmSwitch ? "pm" : "fpm"

  const gradient = {
    property: pmOrFpm,
    stops: [
      [0, '#1C3FFD'], //파랑
      [1, '#0080c5'], //하늘
      [2, '#168039'], //초록
      [3, '#87ae22'], //연두
      [4, '#FFD10F'], //노랑
      [5, '#f48000'], //주황
      [6, '#D90000'], //빨강
    ]
}

  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedSido, setSelectedSido] = useState(null);

  //geojson에 미세먼지 수치 추가 (위 mock data 활용)
  const updatedData = {
    type: 'FeatureCollection',
    features: data.features.map(x => {
      const thisSido = MOCK_DATA.filter( md => { return md.sidonm === x.properties.sidonm} )
      const properties = {
        ...x.properties,
        pm: (thisSido[0].pm)*(7/160), //0-6 scale로 표현해야 하기 때문에 미세먼지 max수치를 약 160으로 잡고, 7 / 160을 곱해 계산
        fpm: (thisSido[0].fpm)*(7/100) //0-6 scale, 초미세먼지 max 수치는 100으로 잡고 7 / 100을 곱해 계산
      };
      return {...x, properties};
    }) 
  }

  //초기 viewport setting
  const [ viewport, setViewport ] = useState({
    latitude: 35.905546,
    longitude: 127.935763,
    width: '500px',
    height: '600px',
    zoom: 5.9,
    });

  //지도에 클릭한 좌표로 한 단계 줌 인 (고정 줌 수치)
  const zoomToClicked = (event) => {
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
      props.changeAddr(event.features[0].properties.sidonm)
    }
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
    props.changeAddr(null)
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
        onClick={zoomToClicked}
        onViewportChange={v => setViewport(v)}
      >
        <Source type="geojson" data={updatedData}>
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
        </Source>
        {hoverInfo && !isZoomed && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            {hoverInfo.features.properties.sidonm}
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