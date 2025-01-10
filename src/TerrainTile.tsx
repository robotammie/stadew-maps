import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';

type TerrainTileProps = {
  tileData: Tile;
}

function tileStyles(terrain: Terrain): any {
  return{
    margin: 0,
    padding: 0,
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: terrain.color,
  }
};

function tooltipText(tileData: Tile): string {
  return `${tileData.building ? tileData.building : tileData.terrain.name}`;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <Box sx={tileStyles(props.tileData.terrain)}/>
    </Tooltip>
  );
}

export default TerrainTile;