import React,  { useLayoutEffect, useCallback, useState, useMemo, useRef }  from 'react';
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
  backgroundColor: string,
): any {
  return{
    margin: 0,
    padding: 0,
    width:  '10px',
    height: '10px',
    border: '.5px solid black',
    backgroundColor,
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

  // Selective subscriptions to individual struct sets (avoids re-renders when unrelated sets change)
  const structCoordinates = useStructStore((state) => state.structs);

  // Ref to track previous destination tile to avoid unnecessary updates
  const prevDestinationTileRef = useRef<Tile | undefined>(undefined);
  const dragOverAnimationFrameRef = useRef<number | null>(null);

  // State to force re-render when AOE updates or building changes
  const [renderKey, setRenderKey] = useState(0);

  // Create a struct state object for use in callbacks - use the store's getState to get full state
  const getStructState = useCallback(() => {
    return useStructStore.getState();
  }, []);

  // Track building reference to detect changes
  const buildingRef = useRef(props.tileData.building);

  // Force re-render when building changes (even if tileData reference stays same)
  useLayoutEffect(() => {
    if (buildingRef.current !== props.tileData.building) {
      buildingRef.current = props.tileData.building;
      setRenderKey(prev => prev + 1);
    }
  }, [props.tileData.building]);

  // Helper function to update AOE for a tile and force re-render
  const updateTileAoe = useCallback((tile: Tile) => {
    // Group structs by view and calculate AOE for each view
    const viewResults = new Map<Views, boolean>();
    const structState = getStructState();

    // Iterate over all struct types in the registry
    for (const [structType, config] of Object.entries(structRegistry) as [Structs, typeof structRegistry[Structs]][]) {
      const structSet = config.getSet(structState);
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
    setRenderKey(prev => prev + 1);
  }, [getStructState]);

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
        ? allFootprints(structCoordinates[Structs.JunimoHut], props.tileData.coordinates, junimoConfig.footprintFunction)
        : false;

      if (props.tileData.terrain.buildable
        && !!currentStruct
        && !props.tileData.building
        && !hasFootprint
      ) {
          props.tileData.building = currentStruct;
          currentStruct.build(props.tileData.coordinates);
          // Force immediate re-render to show building sprite
          setRenderKey(prev => prev + 1);
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
    structCoordinates
  ]);

  // Update range data when Sets change - use useLayoutEffect for immediate update
  useLayoutEffect(() => {
    updateTileAoe(props.tileData);
  }, [
    structCoordinates,
    props.tileData,
    updateTileAoe
  ]);

  // Memoize pickColor result to avoid recalculating on every render
  // Include renderKey to ensure recalculation when AOE changes (renderKey increments when AOE updates)
  const tileColor = useMemo(() => {
    return pickColor(view, currentStruct, props.tileData, structCoordinates[Structs.JunimoHut], destinationTile?.coordinates);
    // renderKey is intentionally included to force recalculation when AOE changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentStruct, props.tileData, structCoordinates[Structs.JunimoHut], destinationTile?.coordinates, renderKey]);

  // Memoize footprint check for drag operations
  const junimoConfig = structRegistry[Structs.JunimoHut];
  const hasFootprint = useMemo(() => {
    return junimoConfig.footprintFunction
      ? allFootprints(structCoordinates[Structs.JunimoHut], props.tileData.coordinates, junimoConfig.footprintFunction)
      : false;
  }, [structCoordinates, props.tileData.coordinates, junimoConfig.footprintFunction]);

  // Optimized onDragOver handler with throttling and tile change check
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Only update destinationTile if it actually changed
    if (prevDestinationTileRef.current !== props.tileData) {
      // Cancel any pending animation frame
      if (dragOverAnimationFrameRef.current !== null) {
        cancelAnimationFrame(dragOverAnimationFrameRef.current);
      }

      // Throttle updates using requestAnimationFrame
      dragOverAnimationFrameRef.current = requestAnimationFrame(() => {
        setDestinationTile(props.tileData);
        prevDestinationTileRef.current = props.tileData;
        dragOverAnimationFrameRef.current = null;
      });
    }

    // Direct DOM manipulation for immediate visual feedback (outside React render cycle)
    const target = e.currentTarget;
    if (hasFootprint) {
      target.style.backgroundColor = '#de2c1f';
    } else if (props.tileData.terrain.buildable && !props.tileData.building) {
      target.style.backgroundColor = '#abfa7d';
    } else {
      target.style.backgroundColor = '#de2c1f';
    }
  }, [props.tileData, hasFootprint, setDestinationTile]);

  // Optimized onDragLeave handler
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = tileColor;
  }, [tileColor]);

  // Optimized onDrop handler
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;

    // Check if building can be built using the same validation logic as useLayoutEffect
    const canBuild = props.tileData.terrain.buildable
      && !!currentStruct
      && !props.tileData.building
      && !hasFootprint;

    // If building cannot be built, revert the tile color
    if (!canBuild) {
      target.style.backgroundColor = tileColor;
    }
  }, [props.tileData, currentStruct, hasFootprint, tileColor]);

  // Memoize struct component rendering - filter before mapping
  // Include renderKey to force update when building changes (renderKey increments when building is set)
  const structComponents = useMemo(() => {
    const components: React.ReactNode[] = [];
    const buildingName = props.tileData.building?.name;
    const currentStructName = currentStruct?.name;
    const isOriginTile = originTile === props.tileData;

    for (const [structType, config] of Object.entries(structRegistry) as [Structs, typeof structRegistry[Structs]][]) {
      const structName = structType as Structs;
      const shouldRender = buildingName === structName
        || (isOriginTile && currentStructName === structName);

      if (shouldRender) {
        const Component = config.component;
        const bgColor = pickColor(view, currentStruct, props.tileData, structCoordinates[Structs.JunimoHut]);
        components.push(
          <Component
            key={structName}
            onMap={true}
            bgColor={bgColor}
          />
        );
      }
    }
    return components;
    // renderKey is included to force recalculation when building changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tileData, originTile, currentStruct, view, structCoordinates, renderKey]);

  return (
    <Tooltip title={tooltipText(props.tileData)}>
      <div
        style={tileStyles(tileColor)}
        onMouseDown={(_) => {
          setOriginTile(props.tileData);
          setCurrentStruct(props.tileData.building);
          razeBuilding(props.tileData);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {structComponents}
      </div>
    </Tooltip>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if tileData changes or if store values that affect this tile change
const MemoizedTerrainTile = React.memo(TerrainTile, (prevProps, nextProps) => {
  // Check tileData reference and building reference
  // Building can be mutated without changing tileData reference
  const tileDataSame = prevProps.tileData === nextProps.tileData;
  const buildingSame = prevProps.tileData.building === nextProps.tileData.building;

  // Skip re-render only if both tileData and building are the same
  return tileDataSame && buildingSame;
});

export default MemoizedTerrainTile;
