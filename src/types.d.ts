type Terrain = {
  name: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

interface Buildable {buildable: true;}
interface Farmable {farmable: true;}

type Tile = {
  building: string | undefined;
  terrain: Terrain;
  settings: TerrainSettings;
}

type TerrainSettings = {
  sprinkler?: boolean;
  junimo?: boolean;
  scarecrow?: boolean;
  beeHouse?: boolean;
}
