import React from 'react';
import Box from '@mui/material/Box';
import Map from './Map';
import './App.css';
import StructureMenu from './StructureMenu';

const styles = {
  padding: 10,
  width: 'full',
  height: '800px',
  display: 'flex',
  justifyContent: 'flex-start',
};

function App() {
  return (
    <div className="App">
        <div>
          <h1>Map</h1>
          <Box sx={styles}>
            <Map/>
            <StructureMenu/>
          </Box>
        </div>
    </div>
  );
}

export default App;
