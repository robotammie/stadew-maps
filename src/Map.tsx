import Box from '@mui/material/Box';
import { StandardMap } from './maps/Standard';
import TerrainTile from './TerrainTile';

const mapStyles = {
  margin: 10,
  padding: 10,
  width: 'full',
  height: '800px',
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
};
const rowStyles = {
  margin: 0,
  padding: 0,
  display: 'flex',
  justifyContent: 'left',
};

const Map = () => {
  const map = StandardMap
  return (
    <div>
      <h1>Map</h1>
      <Box sx={mapStyles}>
      {map.map((row: Tile[], i: number) => (
        <Box key={i} sx={rowStyles}>
          {row.map((tile, j) => (
            <TerrainTile key={j} tileData={tile} />
          ))}
        </Box>
      ))}
      </Box>
      {/* <Box sx={mapStyles}>
        <TerrainTile tileData={x} />
      </Box> */}
    </div>
  );
}

export default Map;