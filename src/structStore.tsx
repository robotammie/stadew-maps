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
}))

export default useStore;
