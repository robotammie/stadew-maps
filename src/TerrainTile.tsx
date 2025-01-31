import React,  { useEffect }  from 'react';
import { Tooltip } from '@mui/material';
import useStore from './store';
import { Tile, TerrainSettings, View } from './types.d';

type TerrainTileProps = {
  tileData: Tile;
}

function pickColor(view: View, tileData: Tile): string {
  let fillColor
  switch (view) {
    case View.Standard:
      fillColor = tileData.terrain.color;
      break;
    case View.Scarecrow:
      fillColor = tileData.settings.scarecrow ? 'purple' : tileData.terrain.color;
      break;
    default:
      fillColor = tileData.terrain.color;
  }
  return fillColor;
}

function tileStyles(view: View, tileData: Tile): any {
  return{
    margin: 0,
    padding: 0,
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: pickColor(view, tileData),
  }
};

function tooltipText(tileData: Tile): string {
  return `${!!tileData.building ? tileData.building.name : tileData.terrain.name}`;
}



const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const view = useStore((state) => state.view);
  const currentStruct = useStore((state) => state.currentStruct);
  const currentTile = useStore((state) => state.currentTile);
  const setCurrentTile = useStore((state) => state.setCurrentTile);
  const clearCurrentTile = useStore((state) => state.clearCurrentTile);
  const isBuilding = useStore((state) => state.isBuilding);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const scarecrows = useStore((state) => state.scarecrows);
  const addScarecrow = useStore((state) => state.addScarecrow);

  // Build structure on change in isBuilding (DragEnd)
  useEffect(() => {
    if (isBuilding && props.tileData === currentTile) {
      if (props.tileData.terrain.buildable && !props.tileData.building && !!currentStruct) {
        props.tileData.building = currentStruct;
        switch (currentStruct.name) {
          case 'Scarecrow':
            addScarecrow(props.tileData.coordinates);
            break;
          default:
            break;
        }
      }
      setIsBuilding(false);
    }
  }, [isBuilding, props.tileData, currentStruct, setIsBuilding, addScarecrow, currentTile]);

  useEffect(() => {
    const settings = {
      scarecrow: scarecrows.intersection(props.tileData.aoEs.scarecrow).size > 0,
    } as TerrainSettings;
    props.tileData.settings = settings;
  }, [scarecrows, props.tileData]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(view, props.tileData)}
        onClick={(e) => {
          console.log("onClick", props.tileData);
        }}
        onDragOver={(e) => {
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
          } else {
           target.style.backgroundColor = '#de2c1f';
          }
        }}
        onDragLeave={(e) => {
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            setCurrentTile(props.tileData);
          } else {
            clearCurrentTile();
          }
          target.style.backgroundColor = pickColor(view, props.tileData);
        }}
      >
        { props.tileData.building ? props.tileData.building.sprite : null }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;