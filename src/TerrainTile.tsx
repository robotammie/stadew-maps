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
  const destinationTile = useStore((state) => state.destinationTile);
  const setDestinationTile = useStore((state) => state.setDestinationTile);
  const clearDestinationTile = useStore((state) => state.clearDestinationTile);
  const originTile = useStore((state) => state.originTile);
  const setOriginTile = useStore((state) => state.setOriginTile);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const isBuilding = useStore((state) => state.isBuilding);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const scarecrows = useStore((state) => state.scarecrows);
  const addScarecrow = useStore((state) => state.addScarecrow);
  const removeScarecrow = useStore((state) => state.removeScarecrow);

  const razeBuilding = (tile: Tile) => {
    switch (tile.building?.name) {
      case 'Scarecrow':
        removeScarecrow(tile.coordinates);
        break;
      default:
        break;
      }
    tile.building = undefined;
  };

  // Build structure on change in isBuilding (DragEnd)
  useEffect(() => {
    if (isBuilding && props.tileData === destinationTile) {
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
      if (originTile) {
        razeBuilding(originTile);
        clearOriginTile()
      }
      setIsBuilding(false);
      clearDestinationTile();
    }
  }, [isBuilding, props.tileData, currentStruct, setIsBuilding, addScarecrow, destinationTile]);

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
        onMouseDown={(e) => {
          setOriginTile(props.tileData);
          switch (e.button) {
            case 0:
              setOriginTile(props.tileData);
              break;
            case 2:
              razeBuilding(props.tileData);
            default:
              break;
          }
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
          setDestinationTile(props.tileData);
          target.style.backgroundColor = pickColor(view, props.tileData);
        }}
      >
        { props.tileData.building
          ? < props.tileData.building.sprite onMap={true} bgColor={pickColor(view, props.tileData)} />
          : null
        }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;