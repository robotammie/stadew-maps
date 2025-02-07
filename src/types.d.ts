export enum Views {
  Standard = 0,
  Scarecrow,
  Sprinkler,
  Junimo, 
  BeeHouse,
}

export enum Structs {
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
  name: Structs;
  sprite: React.FC<SructProps>;
  build: (coordinates: [number, number]) => void;
  raze: (coordinates: [number, number]) => void;
}

export type Terrain = {
  name: string;
  buildable: boolean;
  farmable: boolean;
  color: string;
}

export type Tile = {
  coordinates: [number, number];
  building: Building | undefined;
  terrain: Terrain;
  aoes: Map<Views, boolean>;
}
