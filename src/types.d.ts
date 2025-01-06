type Terrain = {
  building?: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

type Dirt = {
  building?: string;
  buildable: true;
  farmable: true;
  color: '#ce7e00';
}

type Marsh = {
  building?: string;
  buildable: true;
  farmable: true;
  color: '#b47005';
}

type Grass = {
  building?: string;
  buildable: true;
  farmable: false;
  color: '#6aa84f';
}

type Bush = {
  buildable: false;
  farmable: false;
  color: '#228B22';
}

type Water = {
  buildable: false;
  farmable: false;
  marsh: false;
  color: '#1E90FF';
}

interface Buildable {buildable: true;}
interface Farmable {farmable: true;}

type Tile = {
  terrain: Terrain;
  x: number;
  y: number;
  settings: TerrainSettings;
}

type TerrainSettings = {
  sprinkler?: boolean;
  junimoHut?: boolean;
  scarecrow?: boolean;
  beeHouse?: boolean;
}
