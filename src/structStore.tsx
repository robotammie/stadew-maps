import create from 'zustand'

import { Building } from './types.d'

interface MapState {
  currentStruct: Building | undefined
  setCurrentStruct: (element: Building | undefined) => void
  scarecrows: Set<[number, number]>
  addScarecrow: (coordinates: [number, number]) => void
  removeScarecrow: (coordinates: [number, number]) => void
  sprinkler1s: Set<[number, number]>
  addSprinkler1: (coordinates: [number, number]) => void
  removeSprinkler1: (coordinates: [number, number]) => void
  sprinkler2s: Set<[number, number]>
  addSprinkler2: (coordinates: [number, number]) => void
  removeSprinkler2: (coordinates: [number, number]) => void
  sprinkler3s: Set<[number, number]>
  addSprinkler3: (coordinates: [number, number]) => void
  removeSprinkler3: (coordinates: [number, number]) => void
  sprinkler4s: Set<[number, number]>
  addSprinkler4: (coordinates: [number, number]) => void
  removeSprinkler4: (coordinates: [number, number]) => void
  junimoHuts: Set<[number, number]>
  addJunimoHut: (coordinates: [number, number]) => void
  removeJunimoHut: (coordinates: [number, number]) => void
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
  scarecrows: new Set(),
  addScarecrow: (coordinates) => set((state) => ({
    scarecrows: addToSet(state.scarecrows, coordinates)
  })),
  removeScarecrow: (coordinates) => set((state) => ({
    scarecrows: removeFromSet(state.scarecrows, coordinates)
  })),
  sprinkler1s: new Set(),
  addSprinkler1: (coordinates) => set((state) => ({
    sprinkler1s: addToSet(state.sprinkler1s, coordinates)
  })),
  removeSprinkler1: (coordinates) => set((state) => ({
    sprinkler1s: removeFromSet(state.sprinkler1s, coordinates)
  })),
  sprinkler2s: new Set(),
  addSprinkler2: (coordinates) => set((state) => ({
    sprinkler2s: addToSet(state.sprinkler2s, coordinates)
  })),
  removeSprinkler2: (coordinates) => set((state) => ({
    sprinkler2s: removeFromSet(state.sprinkler2s, coordinates)
  })),
  sprinkler3s: new Set(),
  addSprinkler3: (coordinates) => set((state) => ({
    sprinkler3s: addToSet(state.sprinkler3s, coordinates)
  })),
  removeSprinkler3: (coordinates) => set((state) => ({
    sprinkler3s: removeFromSet(state.sprinkler3s, coordinates)
  })),
  sprinkler4s: new Set(),
  addSprinkler4: (coordinates) => set((state) => ({
    sprinkler4s: addToSet(state.sprinkler4s, coordinates)
  })),
  removeSprinkler4: (coordinates) => set((state) => ({
    sprinkler4s: removeFromSet(state.sprinkler4s, coordinates)
  })),
  junimoHuts: new Set(),
  addJunimoHut: (coordinates) => set((state) => ({
    junimoHuts: addToSet(state.junimoHuts, coordinates)
  })),
  removeJunimoHut: (coordinates) => set((state) => ({
    junimoHuts: removeFromSet(state.junimoHuts, coordinates)
  })),
}))

export default useStore;
