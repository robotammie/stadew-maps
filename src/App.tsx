import React from 'react';
import Box from '@mui/material/Box';
import './App.css';
import Map from './Map';
import StructureMenu from './StructureMenu';
import ViewSelector from './ViewSelector';

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

function App() {
  return (
    <div className="App">
        <div>
          <h1>Map</h1>
          <Box sx={styles}>
            <Map/>
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
