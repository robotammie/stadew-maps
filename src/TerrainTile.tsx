import React,  { useEffect, useLayoutEffect, useCallback }  from 'react';
import { Tooltip } from '@mui/material';
import { HaloColor, ScarecrowColor, SprinklerColor } from './constants';
import useStore from './store';
import useStructStore from './structStore';
import { Structs, Tile, Views } from './types.d';
import Scarecrow, {AoEFunction as ScarecrowAoEFunction} from './Structures/Scarecrow';
import Sprinkler, {AoEFunction as SprinklerAoEFunction} from './Structures/Sprinkler';

type TerrainTileProps = {
  tileData: Tile;
}

function pickColor(view: Views, tileData: Tile, destination?: [number, number] ): string {
  let fillColor
  switch (view) {
    case Views.Standard:
      fillColor = tileData.terrain.color;
      break;
    case Views.Scarecrow:
      if (!tileData.terrain.farmable) {
        fillColor = tileData.terrain.color;
      } else if (tileData.aoes.get(Views.Scarecrow)) {
        fillColor = ScarecrowColor;
      } else if (destination && ScarecrowAoEFunction(destination, tileData.coordinates)) {
        fillColor = HaloColor;
      } else {
        fillColor = tileData.terrain.color
      }
      break;
    case Views.Sprinkler:
      if (!tileData.terrain.farmable) {
        fillColor = tileData.terrain.color;
      } else if (tileData.aoes.get(Views.Sprinkler)) {
        fillColor = SprinklerColor;
      } else if (destination && SprinklerAoEFunction(destination, tileData.coordinates)) {
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

function tileStyles(view: Views, tileData: Tile, destination?: [number, number]): any {
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

function allAoEs(
  structs: Set<[number, number]>,
  tile: [number, number],
  AoEFunction: (struct: [number, number], tile: [number, number]) => boolean
): boolean {
  for (const struct of structs) {
    if (AoEFunction(struct, tile)) {
      return true;
    }
  };
  return false;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);
  const destinationTile = useStore((state) => state.destinationTile);
  const setDestinationTile = useStore((state) => state.setDestinationTile);
  const clearDestinationTile = useStore((state) => state.clearDestinationTile);
  const originTile = useStore((state) => state.originTile);
  const setOriginTile = useStore((state) => state.setOriginTile);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const isBuilding = useStore((state) => state.isBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const setIsBuilding = useStore((state) => state.setIsBuilding);

  const currentStruct = useStructStore((state) => state.currentStruct);
  const scarecrows = useStructStore((state) => state.scarecrows);
  const sprinklers = useStructStore((state) => state.sprinklers);

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
      setView(Views.Standard);
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

  // Update range data after build
  useEffect(() => {
    props.tileData.aoes.set(
      Views.Scarecrow,
      allAoEs(scarecrows, props.tileData.coordinates, ScarecrowAoEFunction)
    );
    props.tileData.aoes.set(
      Views.Sprinkler,
      allAoEs(sprinklers, props.tileData.coordinates, SprinklerAoEFunction)
    );
  }, [
    scarecrows,
    sprinklers,
    props.tileData.aoes,
    props.tileData.coordinates
  ]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(view, props.tileData, destinationTile?.coordinates)}
        onMouseDown={(_) => {
          setOriginTile(props.tileData);
          setCurrentStruct(props.tileData.building);
          razeBuilding(props.tileData);
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDestinationTile(props.tileData);
          let target = e.target as HTMLElement;
          if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
          } else {
           target.style.backgroundColor = '#de2c1f';
          }
        }}
        onDragLeave={(e) => {
          // e.preventDefault()
          let target = e.target as HTMLElement;
          target.style.backgroundColor = pickColor(view, props.tileData, destinationTile?.coordinates);
        }}
      >
        {
          (scarecrows.has(props.tileData.coordinates) || (originTile === props.tileData && currentStruct?.name === Structs.Scarecrow))
          && < Scarecrow onMap={true} bgColor={pickColor(view, props.tileData)} />
        }
        {
          (sprinklers.has(props.tileData.coordinates) || (originTile === props.tileData && currentStruct?.name === Structs.Sprinkler))
          && < Sprinkler onMap={true} bgColor={pickColor(view, props.tileData)} />
        }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;