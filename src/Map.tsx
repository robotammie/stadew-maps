import Box from '@mui/material/Box';
import { Tile } from './types.d';
import buildMapObject from './buildMapObject';
import TerrainTile from './TerrainTile';

const mapAddress = "./maps/TestMap.txt";

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
  const map = buildMapObject(mapAddress);
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