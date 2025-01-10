type Terrain = {
  name?: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

interface Buildable {buildable: true;}
interface Farmable {farmable: true;}

type Tile = {
  building?: string;
  terrain: Terrain;
  settings: TerrainSettings;
}

type TerrainSettings = {
  building?: boolean;
  sprinkler?: boolean;
  junimoHut?: boolean;
  scarecrow?: boolean;
  beeHouse?: boolean;
}
