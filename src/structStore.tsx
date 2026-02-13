import create from 'zustand'

import { Building, Structs } from './types.d'

export interface MapState {
  currentStruct: Building | undefined
  setCurrentStruct: (element: Building | undefined) => void
  structs: Record<Structs, Set<[number, number]>>
  addStruct: (struct: Structs, coordinates: [number, number]) => void
  removeStruct: (struct: Structs, coordinates: [number, number]) => void
}

const addToSet = (set: Set<[number, number]>, coordinates: [number, number]) => {
  const newSet = new Set(set)
  newSet.add(coordinates)
  return newSet
}

const removeFromSet = (set: Set<[number, number]>, coordinates: [number, number]) => {
  const newSet = new Set(set)
  newSet.delete(coordinates)
  return newSet
}

const useStore = create<MapState>((set) => ({
  currentStruct: undefined,
  setCurrentStruct: (struct) => set({ currentStruct: struct }),
  structs: {
    [Structs.Scarecrow]: new Set(),
    [Structs.Sprinkler1]: new Set(),
    [Structs.Sprinkler2]: new Set(),
    [Structs.Sprinkler3]: new Set(),
    [Structs.Sprinkler4]: new Set(),
    [Structs.JunimoHut]: new Set(),
    [Structs.BeeHouse]: new Set(),
  },
  addStruct: (struct: Structs, coordinates: [number, number]) => set((state) => ({
    structs: {
      ...state.structs,
      [struct]: addToSet(state.structs[struct], coordinates)
    }
  })),
  removeStruct: (struct: Structs, coordinates: [number, number]) => set((state) => ({
    structs: {
      ...state.structs,
      [struct]: removeFromSet(state.structs[struct], coordinates)
    }
  })),
}))

export default useStore;
