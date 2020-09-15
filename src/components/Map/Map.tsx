import React, {useEffect, useContext, memo, useRef} from 'react';
import {load} from '@2gis/mapgl';
import MapGLTypes from '@2gis/mapgl/global'

import './Map.css';
import {MapContext} from './Map.context'
import {Coords} from 'types';

type MapWrapperProps = {
  mapInstance: MapGLTypes.Map | undefined;
}
const MapWrapper = memo<MapWrapperProps>(
  () => <div id="map-container" style={{width: '100%', height: '100%'}}/>,
  ({mapInstance: mapInstancePrev}, {mapInstance: mapInstanceNext}) => mapInstancePrev === mapInstanceNext,
);

const getAverageFromArray = (arr: number[]) => arr.reduce((acc, el) => acc + el, 0) / arr.length

export const Map = ({markers}: { markers: Coords[] }) => {
  const {mapInstance, setMapInstance} = useContext(MapContext);
  const markersRef = useRef<MapGLTypes.Marker[]>([]);

  useEffect(() => {
    let map;
    (async () => {
      const mapgl = await load()
      map = new mapgl.Map('map-container', {
        center: [54.98, 82.89],
        zoom: 13,
        key: '6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb',
      });
      setMapInstance(map);
    })()

    return () => map?.destroy();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (mapInstance) {
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.destroy());
      }
      (async () => {
          const mapgl = await load()
          const lons: number[] = [];
          const lats: number[] = [];
          markers.forEach(({lon, lat}: Coords) => {
              markersRef.current.push(new mapgl.Marker(mapInstance, {
                coordinates: [
                  lon,
                  lat,
                ]
              }));
              console.log({lon, lat})
              lons.push(lon);
              lats.push(lat);
            }
          )
          mapInstance.setCenter([
            getAverageFromArray(lons),
            getAverageFromArray(lats),
          ]);
        }
      )()
    }
  }, [mapInstance, markers])

  return (
    <div className="map-wrapper">
      <MapWrapper mapInstance={mapInstance}/>
    </div>
  )
}
