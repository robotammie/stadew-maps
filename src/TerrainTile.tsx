import React,  { useEffect, useLayoutEffect, useCallback }  from 'react';
import { Tooltip } from '@mui/material';
import { HaloColor, ScarecrowColor } from './constants';
import useStore from './store';
import { Tile, View } from './types.d';
import Scarecrow from './Structures/Scarecrow';

type TerrainTileProps = {
  tileData: Tile;
}

function pickColor(view: View, tileData: Tile, destination?: number[] ): string {
  let fillColor
  switch (view) {
    case View.Standard:
      fillColor = tileData.terrain.color;
      break;
    case View.Scarecrow:
      if (tileData.settings.scarecrow) {
        fillColor = ScarecrowColor;
      } else if (destination && tileData.aoEs.scarecrow.has(destination.toString())) {
        fillColor = HaloColor;
      } else {
        fillColor = tileData.terrain.color
      }
      break;
    default:
      fillColor = tileData.terrain.color;
  }
  return fillColor;
}

function tileStyles(view: View, tileData: Tile, destination?: number[]): any {
  return{
    margin: 0,
    padding: 0,
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: pickColor(view, tileData, destination),
  }
};

function tooltipText(tileData: Tile): string {
  return `${!!tileData.building ? tileData.building.name : tileData.terrain.name}`;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);
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

  const razeBuilding = useCallback((tile: Tile) => {
    tile.building?.raze(tile.coordinates);
    props.tileData.building = undefined;
  }, [props.tileData]);

  // Build structure on change in isBuilding (DragEnd)
  useLayoutEffect(() => {
    if (isBuilding && props.tileData === destinationTile) {
      if (props.tileData.terrain.buildable
        && !!currentStruct
        && !props.tileData.building
      ) {
          props.tileData.building = currentStruct;
          currentStruct.build(props.tileData.coordinates);
      }
      if (originTile && destinationTile !== originTile) {
        razeBuilding(originTile);
      }
      setIsBuilding(false);
      clearOriginTile()
      clearDestinationTile();
      setView(View.Standard);
    }
  }, [
    isBuilding,
    props.tileData,
    currentStruct,
    originTile,
    destinationTile,
    setIsBuilding,
    razeBuilding,
    clearDestinationTile,
    clearOriginTile,
    setView
  ]);

  // Update scarecrow range data after build
  useEffect(() => {
    props.tileData.settings.scarecrow = scarecrows.intersection(props.tileData.aoEs.scarecrow).size > 0;
  }, [
    scarecrows,
    props.tileData.aoEs.scarecrow,
    props.tileData.settings,
    props.tileData.coordinates
  ]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(view, props.tileData, destinationTile?.coordinates)}
        onMouseDown={(_) => {
          setOriginTile(props.tileData);
        }}
        onDoubleClick={(_) => {
          razeBuilding(props.tileData);
        }}
        onDragOver={(e) => {
          setDestinationTile(props.tileData);
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
          } else {
           target.style.backgroundColor = '#de2c1f';
          }
        }}
        onDragLeave={(e) => {
          let target = e.target as HTMLElement;
          target.style.backgroundColor = pickColor(view, props.tileData, destinationTile?.coordinates);
        }}
      >
        { scarecrows.has(props.tileData.coordinates.toString())  && < Scarecrow onMap={true} bgColor={pickColor(view, props.tileData)} />}
      </div>
    </Tooltip>
  );
}

export default TerrainTile;