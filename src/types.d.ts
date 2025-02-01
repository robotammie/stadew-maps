export enum View {
  Standard = 0,
  Scarecrow,
  Sprinkler,
  Junimo, 
  BeeHouse,
}

export enum Struct {
  Scarecrow = 'Scarecrow',
  Sprinkler = 'Sprinkler',
  Sprinkler3x3 = 'Sprinkler 3x3',
  Sprinkler4x4 = 'Sprinkler x4',
  Sprinkler5x5 = 'Sprinkler 5x5',
  JunimoHut = 'Junimo Hut',
  BeeHouse = 'Bee House',
}

export type StructProps = {
  onMap: boolean,
  bgColor?: string,
}

export type Building = {
  name: string;
  sprite: React.FC<SructProps>;
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