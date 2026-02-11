import React,  { useLayoutEffect, useCallback, useState }  from 'react';
import { Tooltip } from '@mui/material';
import { FieldColor, FieldColorHalo, DirtColorHalo, FootprintColor } from './constants';
import useStore from './store';
import useStructStore from './structStore';
import { Building, Structs, Tile, Views } from './types.d';
import Scarecrow, {AoEFunction as ScarecrowAoEFunction} from './Structures/Scarecrow';
import Sprinkler1, {AoEFunction as Sprinkler1AoEFunction} from './Structures/Sprinkler1';
import Sprinkler2, {AoEFunction as Sprinkler2AoEFunction} from './Structures/Sprinkler2';
import Sprinkler3, {AoEFunction as Sprinkler3AoEFunction} from './Structures/Sprinkler3';
import Sprinkler4, {AoEFunction as Sprinkler4AoEFunction} from './Structures/Sprinkler4';
import JunimoHut, {AoEFunction as JunimoHutAoEFunction, FootprintFunction as JunimoHutFootprintFunction} from './Structures/JunimoHut';

type TerrainTileProps = {
  tileData: Tile;
}

function isIrrigated(tileData: Tile): boolean {
  if (!tileData.terrain.farmable) {
    return false;
  } else if (tileData.aoes.get(Views.Sprinkler)) {
    return true;
  }
  return false;
}

function pickColor(
  view: Views,
  struct: Building | undefined,
  tileData: Tile,
  junimoHuts: Set<[number, number]>,
  destination?: [number, number],
): string {
  if (allFootprints(junimoHuts, tileData.coordinates, JunimoHutFootprintFunction)) {
    return FootprintColor;
  }
  if (!tileData.terrain.farmable) {
    return tileData.terrain.color;
  }

  let fillColor
  switch (view) {
    case Views.Sprinkler:
      if (isIrrigated(tileData)) {
        fillColor = FieldColor;
      } else if (destination && struct?.aoeFunction(destination, tileData.coordinates)) {
        fillColor = DirtColorHalo;
      } else {
        fillColor = tileData.terrain.color
      }
      break;
    case Views.Scarecrow:
      if (!tileData.terrain.farmable) {
        fillColor = tileData.terrain.color;
      } else if (tileData.aoes.get(Views.Scarecrow) || (destination && struct?.aoeFunction(destination, tileData.coordinates))) {
        if (isIrrigated(tileData)){
          fillColor = FieldColorHalo;
        }
        else {
          fillColor = DirtColorHalo;
        }
      } else {
        if (isIrrigated(tileData)){
          fillColor = FieldColor;
        }
        else {
          fillColor = tileData.terrain.color
        }
      }
      break;
    case Views.Junimo:
      if (!tileData.terrain.farmable) {
        fillColor = tileData.terrain.color;
      } else if (tileData.aoes.get(Views.Junimo) || (destination && struct?.aoeFunction(destination, tileData.coordinates))) {
        if (isIrrigated(tileData)){
          fillColor = FieldColorHalo;
        }
        else {
          fillColor = DirtColorHalo;
        }
      } else {
        if (isIrrigated(tileData)){
          fillColor = FieldColor;
        }
        else {
          fillColor = tileData.terrain.color
        }
      }
      break;
    default:
      if (isIrrigated(tileData)) {
        fillColor = FieldColor;
      } else {
        fillColor = tileData.terrain.color
      }
  }
  return fillColor;
}

function tileStyles(
  view: Views,
  currentStruct:
  Building | undefined,
  tileData: Tile,
  junimoHuts: Set<[number, number]>,
  destination?: [number, number],
): any {
  return{
    margin: 0,
    padding: 0,
    width:  '10px',
    height: '10px',
    border: '.5px solid black',
    backgroundColor: pickColor(view, currentStruct, tileData, junimoHuts, destination),
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

function allFootprints(
  structs: Set<[number, number]>,
  tile: [number, number],
  FootprintFunction: (struct: [number, number], tile: [number, number]) => boolean
): boolean {
  for (const struct of structs) {
    if (FootprintFunction(struct, tile)) {
      return true;
    }
  };
  return false;
}

const TerrainTile: React.FC<TerrainTileProps>  = (props) => {
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
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
  const sprinkler1s = useStructStore((state) => state.sprinkler1s);
  const sprinkler2s = useStructStore((state) => state.sprinkler2s);
  const sprinkler3s = useStructStore((state) => state.sprinkler3s);
  const sprinkler4s = useStructStore((state) => state.sprinkler4s);
  const junimoHuts = useStructStore((state) => state.junimoHuts);

  // State to force re-render when AOE updates
  const [, forceUpdate] = useState(0);

  // Helper function to update AOE for a tile and force re-render
  const updateTileAoe = useCallback((tile: Tile) => {
    tile.aoes.set(
      Views.Scarecrow,
      allAoEs(scarecrows, tile.coordinates, ScarecrowAoEFunction)
    );
    tile.aoes.set(
      Views.Sprinkler,
      (allAoEs(sprinkler1s, tile.coordinates, Sprinkler1AoEFunction)
      || allAoEs(sprinkler2s, tile.coordinates, Sprinkler2AoEFunction)
      || allAoEs(sprinkler3s, tile.coordinates, Sprinkler3AoEFunction)
      || allAoEs(sprinkler4s, tile.coordinates, Sprinkler4AoEFunction))
    );
    tile.aoes.set(
      Views.Junimo,
      allAoEs(junimoHuts, tile.coordinates, JunimoHutAoEFunction)
      && !allFootprints(junimoHuts, tile.coordinates, JunimoHutFootprintFunction)
    );
    // Force re-render by updating state
    forceUpdate(prev => prev + 1);
  }, [scarecrows, sprinkler1s, sprinkler2s, sprinkler3s, sprinkler4s, junimoHuts]);

  const razeBuilding = useCallback((tile: Tile) => {
    tile.building?.raze(tile.coordinates);
    tile.building = undefined;
    // Update AOE immediately after raze
    updateTileAoe(tile);
  }, [updateTileAoe]);

  // Build structure on change in isBuilding (DragEnd)
  useLayoutEffect(() => {
    if (isBuilding && props.tileData === destinationTile) {
      if (props.tileData.terrain.buildable
        && !!currentStruct
        && !props.tileData.building
        && !allFootprints(junimoHuts, props.tileData.coordinates, JunimoHutFootprintFunction)
      ) {
          props.tileData.building = currentStruct;
          currentStruct.build(props.tileData.coordinates);
          // Update AOE immediately after build
          updateTileAoe(props.tileData);
      }
      if (originTile && destinationTile !== originTile) {
        razeBuilding(originTile);
      }
      setIsBuilding(false);
      clearOriginTile()
      clearDestinationTile();
      if (!manualView) {
        setView(Views.Sprinkler);
      }
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
    setView,
    updateTileAoe,
    manualView,
    junimoHuts
  ]);

  // Update range data when Sets change - use useLayoutEffect for immediate update
  useLayoutEffect(() => {
    updateTileAoe(props.tileData);
  }, [
    scarecrows,
    sprinkler1s,
    sprinkler2s,
    sprinkler3s,
    sprinkler4s,
    junimoHuts,
    props.tileData,
    updateTileAoe
  ]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(view, currentStruct, props.tileData, junimoHuts, destinationTile?.coordinates)}
        onMouseDown={(_) => {
          setOriginTile(props.tileData);
          setCurrentStruct(props.tileData.building);
          razeBuilding(props.tileData);
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDestinationTile(props.tileData);
          let target = e.target as HTMLElement;
          if (allFootprints(junimoHuts, props.tileData.coordinates, JunimoHutFootprintFunction)) {
            target.style.backgroundColor = '#de2c1f';
          } else if (props.tileData.terrain.buildable && !props.tileData.building) {
            target.style.backgroundColor = '#abfa7d';
          } else {
           target.style.backgroundColor = '#de2c1f';
          }
        }}
        onDragLeave={(e) => {
          // e.preventDefault()
          let target = e.target as HTMLElement;
          target.style.backgroundColor = pickColor(view, currentStruct, props.tileData, junimoHuts, destinationTile?.coordinates);
        }}
        onDrop={(e) => {
          e.preventDefault();
          let target = e.target as HTMLElement;
          // Check if building can be built using the same validation logic as useLayoutEffect
          const canBuild = props.tileData.terrain.buildable
            && !!currentStruct
            && !props.tileData.building
            && !allFootprints(junimoHuts, props.tileData.coordinates, JunimoHutFootprintFunction);
          
          // If building cannot be built, revert the tile color
          if (!canBuild) {
            target.style.backgroundColor = pickColor(view, currentStruct, props.tileData, junimoHuts, destinationTile?.coordinates);
          }
        }}
      >
        {
          (props.tileData.building?.name === Structs.Scarecrow || (originTile === props.tileData && currentStruct?.name === Structs.Scarecrow))
          && < Scarecrow onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
        {
          (props.tileData.building?.name === Structs.Sprinkler1 || (originTile === props.tileData && currentStruct?.name === Structs.Sprinkler1))
          && < Sprinkler1 onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
        {
          (props.tileData.building?.name === Structs.Sprinkler2 || (originTile === props.tileData && currentStruct?.name === Structs.Sprinkler2))
          && < Sprinkler2 onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
        {
          (props.tileData.building?.name === Structs.Sprinkler3 || (originTile === props.tileData && currentStruct?.name === Structs.Sprinkler3))
          && < Sprinkler3 onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
        {
          (props.tileData.building?.name === Structs.Sprinkler4 || (originTile === props.tileData && currentStruct?.name === Structs.Sprinkler4))
          && < Sprinkler4 onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
        {
          (props.tileData.building?.name === Structs.JunimoHut || (originTile === props.tileData && currentStruct?.name === Structs.JunimoHut))
          && < JunimoHut onMap={true} bgColor={pickColor(view, currentStruct, props.tileData, junimoHuts)} />
        }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;