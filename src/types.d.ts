type Building = {
  name: string;
  sprite: React.JSX.Element;
}

type Terrain = {
  name: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

interface Buildable {buildable: true;}
interface Farmable {farmable: true;}


type TerrainSettings = {
  sprinkler?: boolean;
  junimo?: boolean;
  scarecrow?: boolean;
  beeHouse?: boolean;
}
type Tile = {
  building: Building | undefined;
  terrain: Terrain;
  settings: TerrainSettings;
}
