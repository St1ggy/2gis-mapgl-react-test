import React, {createContext, useState} from 'react';
import MapGLTypes from '@2gis/mapgl/global'
import {} from '@2gis/mapgl'

type IMapContext = {
  mapInstance: MapGLTypes.Map | undefined,
  setMapInstance: Function,
}
export const MapContext = createContext<IMapContext>({
  mapInstance: undefined,
  setMapInstance: (_) => {},
});
export const MapProvider = ({children}) => {
  const [mapInstance, setMapInstance] = useState<MapGLTypes.Map>();

  return (
    <MapContext.Provider value={{mapInstance, setMapInstance}}>
      {children}
    </MapContext.Provider>
  );
};
