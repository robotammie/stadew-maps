import React from 'react';
import { Structs, Views } from './types.d';
import ScarecrowSvg from './svgs/Scarecrow.svg';
import Sprinkler1Svg from './svgs/sprinkler1.svg';
import Sprinkler2Svg from './svgs/sprinkler2.svg';
import Sprinkler3Svg from './svgs/sprinkler3.svg';
import Sprinkler4Svg from './svgs/sprinkler4.svg';
import JunimoHutSvg from './svgs/JunimoHut.svg';
import Scarecrow from './Structures/Scarecrow';
import Sprinkler1 from './Structures/Sprinkler1';
import Sprinkler2 from './Structures/Sprinkler2';
import Sprinkler3 from './Structures/Sprinkler3';
import Sprinkler4 from './Structures/Sprinkler4';
import JunimoHut from './Structures/JunimoHut';
import { AoEFunction as ScarecrowAoEFunction } from './Structures/Scarecrow';
import { AoEFunction as Sprinkler1AoEFunction } from './Structures/Sprinkler1';
import { AoEFunction as Sprinkler2AoEFunction } from './Structures/Sprinkler2';
import { AoEFunction as Sprinkler3AoEFunction } from './Structures/Sprinkler3';
import { AoEFunction as Sprinkler4AoEFunction } from './Structures/Sprinkler4';
import { AoEFunction as JunimoHutAoEFunction, FootprintFunction as JunimoHutFootprintFunction } from './Structures/JunimoHut';
import { MapState } from './structStore';

export type StructConfig = {
  view: Views;
  getSet: (state: MapState) => Set<[number, number]>;
  component: React.FC<{ onMap: boolean; bgColor?: string }>;
  aoeFunction: (struct: [number, number], tile: [number, number]) => boolean;
  footprintFunction?: (struct: [number, number], tile: [number, number]) => boolean;
  /** Image URL for drawing on map (stretched to footprint) */
  imageSrc?: string;
};

// Registry mapping struct types to their configurations
export const structRegistry: Record<Structs, StructConfig> = {
  [Structs.Scarecrow]: {
    view: Views.Scarecrow,
    getSet: (state) => state.structs[Structs.Scarecrow],
    component: Scarecrow,
    aoeFunction: ScarecrowAoEFunction,
    imageSrc: ScarecrowSvg,
  },
  [Structs.Sprinkler1]: {
    view: Views.Sprinkler,
    getSet: (state) => state.structs[Structs.Sprinkler1],
    component: Sprinkler1,
    aoeFunction: Sprinkler1AoEFunction,
    imageSrc: Sprinkler1Svg,
  },
  [Structs.Sprinkler2]: {
    view: Views.Sprinkler,
    getSet: (state) => state.structs[Structs.Sprinkler2],
    component: Sprinkler2,
    aoeFunction: Sprinkler2AoEFunction,
    imageSrc: Sprinkler2Svg,
  },
  [Structs.Sprinkler3]: {
    view: Views.Sprinkler,
    getSet: (state) => state.structs[Structs.Sprinkler3],
    component: Sprinkler3,
    aoeFunction: Sprinkler3AoEFunction,
    imageSrc: Sprinkler3Svg,
  },
  [Structs.Sprinkler4]: {
    view: Views.Sprinkler,
    getSet: (state) => state.structs[Structs.Sprinkler4],
    component: Sprinkler4,
    aoeFunction: Sprinkler4AoEFunction,
    imageSrc: Sprinkler4Svg,
  },
  [Structs.JunimoHut]: {
    view: Views.Junimo,
    getSet: (state) => state.structs[Structs.JunimoHut],
    component: JunimoHut,
    aoeFunction: JunimoHutAoEFunction,
    footprintFunction: JunimoHutFootprintFunction,
    imageSrc: JunimoHutSvg,
  },
  [Structs.BeeHouse]: {
    view: Views.BeeHouse,
    getSet: (state) => new Set<[number, number]>(), // Placeholder - not implemented yet
    component: Scarecrow, // Placeholder
    aoeFunction: ScarecrowAoEFunction, // Placeholder
  },
};

// Get all struct types that contribute to a specific view
export function getStructsForView(view: Views): Structs[] {
  return Object.entries(structRegistry)
    .filter(([_, config]) => config.view === view)
    .map(([structType, _]) => structType as Structs);
}
