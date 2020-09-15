import React, {useState} from 'react';
import {SearchPanel, Map} from './components'
import { Coords } from 'types';

import './App.css';

export const App = () => {
  const [markers, setMarkers] = useState<Coords[]>([]);

  return (
    <div id='App' style={{}}>
      <Map markers={markers}/>
      <SearchPanel onGetResult={setMarkers}/>
    </div>
  );
};
