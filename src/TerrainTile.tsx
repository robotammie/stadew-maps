import React,  { useEffect }  from 'react';
import { Tooltip } from '@mui/material';
import useStore from './store';

type TerrainTileProps = {
  tileData: Tile;
}

function tileStyles(tileData: Tile): any {
  return{
    margin: 0,
    padding: 0,
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: tileData.terrain.color,
  }
};

function tooltipText(tileData: Tile): string {
  return `${tileData.building ? tileData.building : tileData.terrain.name}`;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const currentStruct = useStore((state) => state.currentStruct);
  const currentTile = useStore((state) => state.currentTile);
  const setCurrentTile = useStore((state) => state.setCurrentTile);
  const clearCurrentTile = useStore((state) => state.clearCurrentTile);
  const isBuilding = useStore((state) => state.isBuilding);
  const setIsBuilding = useStore((state) => state.setIsBuilding);

  let children = null;
  useEffect(() => {
    if (isBuilding) {
      if (props.tileData.terrain.buildable && currentStruct) {
        props.tileData.building = currentStruct.className;
        children = currentStruct;
      }
      setIsBuilding(false);
    }
  }, [isBuilding]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(props.tileData)}
        onDragOver={(e) => {
          // console.log("onDragOver");
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
            setCurrentTile(target);
          } else {
           target.style.backgroundColor = '#de2c1f';
           clearCurrentTile();
          }
        }}
        onDragLeave={(e) => {
          // console.log("onDragLeave");
          let target = e.target as HTMLElement;
          target.style.backgroundColor = props.tileData.terrain.color;
          // debugger;
        }}
      >
        { children }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;