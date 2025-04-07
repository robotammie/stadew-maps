export enum Views {
  Sprinkler = 0,
  Scarecrow,
  Junimo, 
  BeeHouse,
}

export enum Structs {
  Scarecrow = 'Scarecrow',
  Sprinkler1 = 'Base Sprinkler',
  Sprinkler2 = 'Sprinkler 3x3',
  Sprinkler3 = 'Sprinkler 4x4',
  Sprinkler4 = 'Sprinkler 5x5',
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
  aoeFunction: (struct: [number, number], tile: [number, number]) => boolean;
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
