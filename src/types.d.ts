export enum View {
  Standard = 0,
  Scarecrow,
  Sprinkler,
  Junimo, 
  BeeHouse,
}

export type Building = {
  name: string;
  sprite: React.JSX.Element;
}

export type Terrain = {
  name: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

export type TerrainSettings = {
  sprinkler?: boolean;
  junimo?: boolean;
  scarecrow?: boolean;
  beeHouse?: boolean;
}

export type Tile = {
  coordinates: [number, number];
  building: Building | undefined;
  terrain: Terrain;
  settings: TerrainSettings;
  aoEs: AoEs;
}

export type AoEs = {
  scarecrow : Set<string>;
}