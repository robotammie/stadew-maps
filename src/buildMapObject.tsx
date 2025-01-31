import {Dirt, Marsh, Grass, Brush, Water, Farmhouse} from './constants';
import TestMap from './maps/TestMap.txt';
import { Terrain, Tile, AoEs } from './types';

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

const calculateAoEs = (terrain: Terrain, x: number, y: number) => {
  // AoE not applicable to non-farmable terrain
  if (!terrain.farmable) {
    return {scarecrow: new Set<[number, number]>()} ;
  }

  // Coordinate values stored as strings for Set comparison
  // [1, 2] !== [1, 2]
  // '1, 2' === '1, 2'
  const scarecrowAoE =new Set([
                                        `${x-3}, ${y-1}`, `${x-3}, ${y}`, `${x-3}, ${y+1}`,
                      `${x-2}, ${y-2}`, `${x-2}, ${y-1}`, `${x-2}, ${y}`, `${x-2}, ${y+1}`, `${x-2}, ${y+2}`,
    `${x-1}, ${y-3}`, `${x-1}, ${y-2}`, `${x-1}, ${y-1}`, `${x-1}, ${y}`, `${x-1}, ${y+1}`, `${x-1}, ${y+2}`, `${x-1}, ${y+3}`,
    `${x  }, ${y-3}`, `${x  }, ${y-2}`, `${x  }, ${y-1}`, `${x  }, ${y}`, `${x  }, ${y+1}`, `${x  }, ${y+2}`, `${x  }, ${y+3}`,
    `${x+1}, ${y-3}`, `${x+1}, ${y-2}`, `${x+1}, ${y-1}`, `${x+1}, ${y}`, `${x+1}, ${y+1}`, `${x+1}, ${y+2}`, `${x+1}, ${y+3}`,
                      `${x+2}, ${y-2}`, `${x+2}, ${y-1}`, `${x+2}, ${y}`, `${x+2}, ${y+1}`, `${x+2}, ${y+2}`,
                                        `${x+3}, ${y-1}`, `${x+3}, ${y}`, `${x+3}, ${y+1}`,
  ]);
  
  return {scarecrow: scarecrowAoE} as AoEs;
};

const buildMapObject = (fileName: string) => {
  const map = TestMap as string
  const rows = map.split('\n');
  const mapObject = rows.map((row, i) => {
    return row.split(' ').map((cell, j) => {
      const terrain = buildTerrain(cell);

      const aoEs = calculateAoEs(terrain, j, i);
      return {
        coordinates: [j, i],
        building: undefined,
        terrain: terrain as Terrain,
        settings: {},
        aoEs: aoEs,
      } as Tile;
    });
  });

  return mapObject;
};

export default buildMapObject;