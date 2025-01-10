import Box from '@mui/material/Box';
import { StandardMap } from './maps/Standard';
import TerrainTile from './TerrainTile';

const mapStyles = {
  width: 'full',
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
    <Box sx={mapStyles}>
      {map.map((row: Tile[], i: number) => (
        <Box key={i} sx={rowStyles}>
          {row.map((tile, j) => (
            <TerrainTile key={j} tileData={tile} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default Map;