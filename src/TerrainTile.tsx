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
  return `${!!tileData.building ? tileData.building.name : tileData.terrain.name}`;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const currentStruct = useStore((state) => state.currentStruct);
  const currentTile = useStore((state) => state.currentTile);
  const setCurrentTile = useStore((state) => state.setCurrentTile);
  const clearCurrentTile = useStore((state) => state.clearCurrentTile);
  const isBuilding = useStore((state) => state.isBuilding);
  const setIsBuilding = useStore((state) => state.setIsBuilding);

  useEffect(() => {
    if (isBuilding && props.tileData === currentTile) {
      if (props.tileData.terrain.buildable && !props.tileData.building && !!currentStruct) {
        props.tileData.building = currentStruct;
      }
      setIsBuilding(false);
    }
  }, [isBuilding, props.tileData, currentStruct, setIsBuilding]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(props.tileData)}
        onClick={(e) => {
          console.log("onClick", props.tileData);
          console.log(e.target);
        }}
        onDragOver={(e) => {
          // console.log("onDragOver");
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
          } else {
           target.style.backgroundColor = '#de2c1f';
          }
          // console.log(currentTile);
        }}
        onDragLeave={(e) => {
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            setCurrentTile(props.tileData);
          } else {
            clearCurrentTile();
          }
          target.style.backgroundColor = props.tileData.terrain.color;
          // console.log("onDragLeave");
          // debugger;
        }}
      >
        { props.tileData.building ? props.tileData.building.sprite : null }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;