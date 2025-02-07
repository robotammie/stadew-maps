import {Dirt, Marsh, Grass, Brush, Water, Farmhouse} from './constants';
import TestMap from './maps/TestMap.txt';
import { Terrain, Tile, Views } from './types';

const buildTerrain = (cell: string) => {
  switch (cell) {
    case 'D':
      return Dirt;
    case 'M':
      return Marsh;
    case 'G':
      return Grass;
    case 'F':
      return Farmhouse;
    case 'W':
      return Water;
    default:
      return Brush;
  }
}

const buildMapObject = (fileName: string) => {
  const map = TestMap as string
  const rows = map.split('\n');
  const mapObject = rows.map((row, i) => {
    return row.split(' ').map((cell, j) => {
      const terrain = buildTerrain(cell);

      return {
        coordinates: [j, i],
        building: undefined,
        terrain: terrain as Terrain,
        aoes: new Map<Views, boolean>,
      } as Tile;
    });
  });

  return mapObject;
};

export default buildMapObject;