import React, {useEffect, useContext, memo, useRef/*, useCallback*/} from 'react';
import {load} from '@2gis/mapgl';
import {Clusterer} from '@2gis/mapgl-clusterer';
import MapGLTypes from '@2gis/mapgl/global'
import {Coords} from 'types';

import './Map.css';
import {MapContext} from './Map.context'

type MapWrapperProps = {
  mapInstance: MapGLTypes.Map | undefined;
}
const MapWrapper = memo<MapWrapperProps>(
  () => <div id="map-container" style={{width: '100%', height: '100%'}}/>,
  ({mapInstance: mapInstancePrev}, {mapInstance: mapInstanceNext}) => mapInstancePrev === mapInstanceNext,
);

// const isInRange = (min, max) => (value) => value >= min && value <= max;
// const getDistance = ({x1, x2, y1, y2}) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))

export const Map = ({markers}: { markers: Coords[] }) => {
  const {mapInstance, setMapInstance} = useContext(MapContext);
  // const markersRef = useRef<MapGLTypes.Marker[]>([]);
  const clusterer = useRef<Clusterer | null>(null);

  useEffect(() => {
    let map;
    (async () => {
      const mapgl = await load();
      map = new mapgl.Map('map-container', {
        center: [82.91131641699999, 55.04240351899995],
        zoom: 16,
        key: '6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb',
      });
      setMapInstance(map);
      clusterer.current = new Clusterer(map, {radius: 60});
    })()

    return () => map?.destroy();
    // eslint-disable-next-line
  }, []);

  // const checkDisplayMarkersByZoom = useCallback((marker: MapGLTypes.Marker) => {
  //   if (!mapInstance) return;
  //
  //   const zoom = mapInstance.getZoom();
  //
  //   const [x1, y1] = mapInstance.project(marker.getCoordinates());
  //
  //   for (let i = 0; i < markersRef.current.length; i++) {
  //     const markerNext = markersRef.current[i];
  //     if (markerNext === marker) return;
  //
  //     const [x2, y2] = mapInstance.project(markerNext.getCoordinates());
  //     const distance = getDistance({x1, x2, y1, y2});
  //     if (distance < 2 * zoom) {
  //       marker.hide()
  //       break;
  //     } else {
  //       marker.show()
  //     }
  //   }
  // }, [mapInstance]);
  //
  // const checkDisplayMarkers = useCallback(() => {
  //   if (!mapInstance) return;
  //   const {southWest: [lonStart, latStart], northEast: [lonEnd, latEnd]} = mapInstance.getBounds();
  //   markersRef.current.forEach((marker) => {
  //     const [lon, lat] = marker.getCoordinates()
  //     if (isInRange(lonStart, lonEnd)(lon) && isInRange(latStart, latEnd)(lat)) {
  //       checkDisplayMarkersByZoom(marker);
  //     } else {
  //       marker.hide()
  //     }
  //   })
  // }, [checkDisplayMarkersByZoom, mapInstance])

  // useEffect(() => {
  // if (!mapInstance) return;
  // mapInstance.on('moveend', checkDisplayMarkers);
  // mapInstance.on('zoomend', checkDisplayMarkers);
  // }, [checkDisplayMarkers, mapInstance])

  useEffect(() => {
    if (mapInstance) {
      // while (markersRef.current?.length > 0) {
      //   markersRef.current.shift()?.destroy();
      // }

      (async () => {
          // const mapgl = await load()
          // markersRef.current = markers
          //   .sort((a, b) => a.lon - b.lon || a.lat - b.lat)
          //   .map((marker) => new mapgl.Marker(mapInstance, {
          //     coordinates: [
          //       marker.lon,
          //       marker.lat,
          //     ],
          //   }))
          //
          // checkDisplayMarkers();
          clusterer.current?.load(markers.map(({lon, lat}) => ({coordinates: [lon, lat]})));
        }
      )()
    }
  }, [/*checkDisplayMarkers, */mapInstance, markers])

  return (
    <div className="map-wrapper">
      <MapWrapper mapInstance={mapInstance}/>
    </div>
  )
}
