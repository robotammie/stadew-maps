import React from 'react';
import { Structs, Views } from './types.d';
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
};

// Registry mapping struct types to their configurations
export const structRegistry: Record<Structs, StructConfig> = {
  [Structs.Scarecrow]: {
    view: Views.Scarecrow,
    getSet: (state) => state.scarecrows,
    component: Scarecrow,
    aoeFunction: ScarecrowAoEFunction,
  },
  [Structs.Sprinkler1]: {
    view: Views.Sprinkler,
    getSet: (state) => state.sprinkler1s,
    component: Sprinkler1,
    aoeFunction: Sprinkler1AoEFunction,
  },
  [Structs.Sprinkler2]: {
    view: Views.Sprinkler,
    getSet: (state) => state.sprinkler2s,
    component: Sprinkler2,
    aoeFunction: Sprinkler2AoEFunction,
  },
  [Structs.Sprinkler3]: {
    view: Views.Sprinkler,
    getSet: (state) => state.sprinkler3s,
    component: Sprinkler3,
    aoeFunction: Sprinkler3AoEFunction,
  },
  [Structs.Sprinkler4]: {
    view: Views.Sprinkler,
    getSet: (state) => state.sprinkler4s,
    component: Sprinkler4,
    aoeFunction: Sprinkler4AoEFunction,
  },
  [Structs.JunimoHut]: {
    view: Views.Junimo,
    getSet: (state) => state.junimoHuts,
    component: JunimoHut,
    aoeFunction: JunimoHutAoEFunction,
    footprintFunction: JunimoHutFootprintFunction,
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
