import React,  { useLayoutEffect, useCallback, useState }  from 'react';
import { Tooltip } from '@mui/material';
import { FieldColor, FieldColorHalo, DirtColorHalo, FootprintColor } from './constants';
import useStore from './store';
import useStructStore from './structStore';
import { Building, Structs, Tile, Views } from './types.d';
import { structRegistry } from './structRegistry';

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
  // Check footprints using the struct's footprintFunction if available
  const junimoConfig = structRegistry[Structs.JunimoHut];
  if (junimoConfig.footprintFunction && allFootprints(junimoHuts, tileData.coordinates, junimoConfig.footprintFunction)) {
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
  const structStoreState = useStructStore();

  // State to force re-render when AOE updates
  const [, forceUpdate] = useState(0);

  // Helper function to update AOE for a tile and force re-render
  const updateTileAoe = useCallback((tile: Tile) => {
    // Group structs by view and calculate AOE for each view
    const viewResults = new Map<Views, boolean>();
    
    // Iterate over all struct types in the registry
    for (const [structType, config] of Object.entries(structRegistry) as [Structs, typeof structRegistry[Structs]][]) {
      const structSet = config.getSet(structStoreState);
      const view = config.view;
      
      // For Sprinkler view, combine all sprinkler types with OR
      if (view === Views.Sprinkler) {
        const currentValue = viewResults.get(view) || false;
        viewResults.set(view, currentValue || allAoEs(structSet, tile.coordinates, config.aoeFunction));
      } else {
        // For other views, set directly (they only have one struct type)
        const result = allAoEs(structSet, tile.coordinates, config.aoeFunction);
        
        // Special handling for Junimo: also check footprints
        if (structType === Structs.JunimoHut && config.footprintFunction) {
          viewResults.set(view, result && !allFootprints(structSet, tile.coordinates, config.footprintFunction));
        } else {
          viewResults.set(view, result);
        }
      }
    }
    
    // Update tile AOE map
    for (const [view, result] of viewResults.entries()) {
      tile.aoes.set(view, result);
    }
    
    // Force re-render by updating state
    forceUpdate(prev => prev + 1);
  }, [structStoreState]);

  const razeBuilding = useCallback((tile: Tile) => {
    tile.building?.raze(tile.coordinates);
    tile.building = undefined;
    // Update AOE immediately after raze
    updateTileAoe(tile);
  }, [updateTileAoe]);

  // Build structure on change in isBuilding (DragEnd)
  useLayoutEffect(() => {
    if (isBuilding && props.tileData === destinationTile) {
      const junimoConfig = structRegistry[Structs.JunimoHut];
      const hasFootprint = junimoConfig.footprintFunction 
        ? allFootprints(structStoreState.junimoHuts, props.tileData.coordinates, junimoConfig.footprintFunction)
        : false;
      
      if (props.tileData.terrain.buildable
        && !!currentStruct
        && !props.tileData.building
        && !hasFootprint
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
    structStoreState
  ]);

  // Update range data when Sets change - use useLayoutEffect for immediate update
  useLayoutEffect(() => {
    updateTileAoe(props.tileData);
  }, [
    structStoreState.scarecrows,
    structStoreState.sprinkler1s,
    structStoreState.sprinkler2s,
    structStoreState.sprinkler3s,
    structStoreState.sprinkler4s,
    structStoreState.junimoHuts,
    props.tileData,
    updateTileAoe
  ]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(view, currentStruct, props.tileData, structStoreState.junimoHuts, destinationTile?.coordinates)}
        onMouseDown={(_) => {
          setOriginTile(props.tileData);
          setCurrentStruct(props.tileData.building);
          razeBuilding(props.tileData);
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDestinationTile(props.tileData);
          let target = e.target as HTMLElement;
          const junimoConfig = structRegistry[Structs.JunimoHut];
          const hasFootprint = junimoConfig.footprintFunction 
            ? allFootprints(structStoreState.junimoHuts, props.tileData.coordinates, junimoConfig.footprintFunction)
            : false;
          if (hasFootprint) {
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
          target.style.backgroundColor = pickColor(view, currentStruct, props.tileData, structStoreState.junimoHuts, destinationTile?.coordinates);
        }}
        onDrop={(e) => {
          e.preventDefault();
          let target = e.target as HTMLElement;
          const junimoConfig = structRegistry[Structs.JunimoHut];
          const hasFootprint = junimoConfig.footprintFunction 
            ? allFootprints(structStoreState.junimoHuts, props.tileData.coordinates, junimoConfig.footprintFunction)
            : false;
          // Check if building can be built using the same validation logic as useLayoutEffect
          const canBuild = props.tileData.terrain.buildable
            && !!currentStruct
            && !props.tileData.building
            && !hasFootprint;
          
          // If building cannot be built, revert the tile color
          if (!canBuild) {
            target.style.backgroundColor = pickColor(view, currentStruct, props.tileData, structStoreState.junimoHuts, destinationTile?.coordinates);
          }
        }}
      >
        {
          // Render struct components based on registry
          Object.entries(structRegistry).map(([structType, config]) => {
            const structName = structType as Structs;
            const shouldRender = props.tileData.building?.name === structName 
              || (originTile === props.tileData && currentStruct?.name === structName);
            
            if (shouldRender) {
              const Component = config.component;
              return (
                <Component 
                  key={structName}
                  onMap={true} 
                  bgColor={pickColor(view, currentStruct, props.tileData, structStoreState.junimoHuts)} 
                />
              );
            }
            return null;
          })
        }
      </div>
    </Tooltip>
  );
}

export default TerrainTile;