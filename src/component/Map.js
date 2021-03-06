import React, { useState, useCallback, useEffect } from 'react';
import ReactMapGL, { Layer, Source, LinearInterpolator, WebMercatorViewport, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import sidoGeoJson from '.././data/Sido';
import sigunguGeoJson from '.././data/Sigungu';
import sidoBbox from '.././data/sidoBbox';
import { Button } from 'antd';
import { ZoomOutOutlined } from '@ant-design/icons';
import { Icon } from '@ant-design/compatible';
import { ReactComponent as location} from '.././icon/location.svg' 
import { ReactComponent as pin} from '.././icon/pin.svg' 
import axios from 'axios';
import { ColorLegend } from './ColorLegend';
import { getSidoData, getSigunguData } from '../util'

export function Map( {isPm, isToday, changeAddr, addr, SidoDB, SigunguDB, forecastDB} ) {
  const MAP_TOKEN = 'pk.eyJ1IjoibHVuZWNsYWlyZSIsImEiOiJja3A2dzRkYnAwMDJtMnBwYW1pbHV2aXN1In0.XDowr_anEYxEmHwwFqqVyA';

  const pmOrFpm = isToday ? (isPm ? "pm" : "fpm") : (isPm ? "pmForecast" : "fpmForecast")

  const gradient = {
    property: pmOrFpm,
    stops: isToday ?
    [
      [0, '#565656'], //미세먼지 수치가 주어지지 않았을 때 회색
      [1, '#1C3FFD'], [2, '#1C3FFD'], [3, '#1C3FFD'], //파
      [4, '#87ae22'], [5, '#87ae22'], [6, '#87ae22'], [7, '#87ae22'], [8, '#87ae22'], //연두
      [9, '#FFD10F'], [10, '#FFD10F'], [11, '#FFD10F'], [12, '#FFD10F'], [13, '#FFD10F'], [14, '#FFD10F'], [15, '#FFD10F'], //노
      [16, '#D90000'] //빨
    ] :
    [
      [1, '#1C3FFD'], [2, '#87ae22'], [3, '#FFD10F'] // 내일 예보시 색상코드
    ]
  }

  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedSido, setSelectedSido] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  //시도 geojson에 db에서 받아온 pm, fpm 수치 추가
  const SidoDBGeo = SidoDB != null && forecastDB != null ? {
    type: 'FeatureCollection',
    features: sidoGeoJson.features.map(geo => {
      const sidoData = getSidoData(SidoDB.data, geo.properties.sidonm)
      const forecastData = getSidoData(forecastDB, geo.properties.sidonm)
      const properties = {
        ...geo.properties,
        pm: Math.ceil((sidoData[0])/10),
        fpm: Math.ceil((sidoData[1])/10),
        pmForecast: (forecastData[0]),
        fpmForecast: (forecastData[1])
      }
      return {...geo, properties}
    })
  } : { sidoGeoJson }

  const SigunguDBGeo = SigunguDB != null ? {
    type: 'FeatureCollection',
    features: sigunguGeoJson.features.map(geo => {
      const sggSplit = geo.properties.sgg_nm.split(' ')
      const sigunguData = getSigunguData(SigunguDB, sggSplit[0], sggSplit[1])
      const properties = {
        ...geo.properties,
        sidonm: sggSplit[0],
        onlySGG: sggSplit[1],
        pm: Math.ceil((sigunguData[0])/10),
        fpm: Math.ceil((sigunguData[1])/10)
      }
      return {...geo, properties}
    })
  } : { sigunguGeoJson }

  //초기 viewport setting
  const initalViewport = {
    latitude: 35.905546,
    longitude: 127.935763,
    width: '500px',
    height: '600px',
    zoom: 5.9,
  }
  const [ viewport, setViewport ] = useState(initalViewport);

  useEffect(() => {
    if (!isToday) { 
      zoomOut()
    }
    else if (addr?.length > 2 ) {
      const splitAddr = addr.split(' ')

      const findSidoBbox = sidoBbox.filter(sido => sido.name === splitAddr[0])

      const [minLng, minLat, maxLng, maxLat] = findSidoBbox[0].bbox
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
        transitionInterpolator: new LinearInterpolator(),
        transitionDuration: 500
      })

      setIsZoomed(true)
      setSelectedSido(splitAddr[0])

    }
  }, [addr, isToday])

  //지도에 클릭한 시도로 줌 인 (시도 크기에 맞게)
  const onClick = (event) => {
    if (isToday) {
      setCurrentLocation(null)
      const selectedSidoName = addr.split(' ')[0]
      if (addr === '') {
        changeAddr(event.features[0].properties.sidonm)
        setSelectedSido(event.features[0].properties.sidonm)
      } else if (selectedSidoName === event.features[0].properties.sidonm) {
        changeAddr(event.features[0].properties.sgg_nm)
      }
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
    setCurrentLocation(null)
    changeAddr('')
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
  
  // api호출로 좌표->행정구역정보 변환
  async function searchCoordinateToAddress(longitude, latitude) {
    const rest_api_key = 'bdf64f1d0092e3ba4ac8ca3a35e24e4d'
    const headers = {'Authorization': `KakaoAK ${rest_api_key}`}
    const url = 'https://dapi.kakao.com/v2/local/geo/coord2address.json'
    const params = {x: longitude, y: latitude}
    const response = await axios.get(url, {
      params: params,
      headers: headers
    })
    
    const sidoName = response.data.documents[0].address.region_1depth_name
    const sigunguName = response.data.documents[0].address.region_2depth_name

    return [sidoName, sigunguName]
  }

  // 시도명 매핑
  const sidoNameData = require("../data/sidoNameMapping.json")
  const nameMapping = async (sidoName) => {
    const result = sidoNameData.filter(({ name, abbrev }) => {
        return abbrev === sidoName
    })
    return result[0].name
  }

  // 현재 위치 가져오기
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position)=>{
      const currentLatitude = position.coords.latitude
      const currentLongitude = position.coords.longitude
      const address = await searchCoordinateToAddress(currentLongitude, currentLatitude)
      const sidoName = await nameMapping(address[0])
      const sigunguName = address[1]

      setCurrentLocation({
        longitude: currentLongitude,
        latitude: currentLatitude
      })

      changeAddr(sidoName+' '+sigunguName)
      return [sidoName, sigunguName]
    })
  }
  
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={MAP_TOKEN}
        onHover={onHover}
        onClick={onClick}
        onViewportChange={v => setViewport(v)}
        scrollZoom={false}
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
              {'fill-color': gradient, "fill-opacity": 0.4, 'fill-outline-color': '#424242'}}
            filter={['==', 'sidonm', selectedSido]}
          />
          }
        </Source>}
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            {isZoomed ? hoverInfo.features.properties.onlySGG  : hoverInfo.features.properties.sidonm }
          </div>
        )}
        {isZoomed && currentLocation && (
          <Marker {...currentLocation}>
            <div
              style={{ transform : "translate(-15px,-30px)"}}
            >
              <Icon component={pin} style={{fontSize:"2em"}} />
            </div>
          </Marker>
        )}
      </ReactMapGL>
      <div className="map-icons">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<ZoomOutOutlined/>}
          onClick={zoomOut}
        />
        <p style={{fontSize:"x-small"}}>zoom-out</p>
        <Button
          shape="circle"
          size="large"
          onClick={getLocation}
        >
          <Icon component={location} style={{fontSize:"1.5em"}} />
        </Button>
        <p style={{fontSize:"x-small"}}>현재 위치</p>
      </div>
      <ColorLegend/>
    </div>
  );
}