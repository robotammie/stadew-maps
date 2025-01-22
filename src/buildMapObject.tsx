import {Dirt, Marsh, Grass, Brush, Water, Farmhouse} from './constants';
import TestMap from './maps/TestMap.txt';

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
  const mapObject = rows.map((row) => {
    return row.split(' ').map((cell) => {
      return {
        building: undefined,
        terrain: buildTerrain(cell),
        settings: {},
      };
    });
  });

  return mapObject;
};

export default buildMapObject;