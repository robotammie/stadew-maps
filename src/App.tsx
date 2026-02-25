import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './App.css';
import Map from './Map';
import StructureMenu from './StructureMenu';
import ViewSelector from './ViewSelector';

export type MapKey = 'standard' | 'forest';

const styles = {
  padding: 10,
  width: 'full',
  height: '800px',
  display: 'flex',
  justifyContent: 'flex-start',
};

const legendStyles = {
  padding:  '0px 10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
};

const mapOptions: { value: MapKey; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'forest', label: 'Forest' },
];

function App() {
  const [mapKey, setMapKey] = useState<MapKey>('standard');

  return (
    <div className="App">
        <div>
          <h1>Map</h1>
          <FormControl sx={{ minWidth: 160, mb: 1 }} size="small">
            <InputLabel id="map-select-label">Map</InputLabel>
            <Select
              labelId="map-select-label"
              value={mapKey}
              label="Map"
              onChange={(e) => setMapKey(e.target.value as MapKey)}
            >
              {mapOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={styles}>
            <Map mapKey={mapKey}/>
            <Box sx={legendStyles}>
              <ViewSelector/>
              <StructureMenu/>
            </Box>
          </Box>
        </div>
    </div>
  );
}

export default App;
