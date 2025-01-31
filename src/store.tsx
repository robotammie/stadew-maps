import create from 'zustand'

import { Building, Tile, View } from './types.d'

interface MapState {
  currentStruct: Building | undefined
  setCurrentStruct: (struct: Building | undefined) => void
  currentTile: Tile | undefined
  setCurrentTile: (tile: Tile | undefined) => void
  clearCurrentTile: () => void
  isBuilding: boolean
  setIsBuilding: (isBuilding: boolean) => void
  view: View
  setView: (view: View) => void
  scarecrows: Set<string>
  addScarecrow: (coordinates: [number, number]) => void
  removeScarecrow: (coordinates: [number, number]) => void
}

const addToSet = (set: Set<string>, coordinates: [number, number]) => {
  const newSet = new Set(set)
  newSet.add(`${coordinates[0]}, ${coordinates[1]}`)
  return newSet
}

const removeFromSet = (set: Set<string>, coordinates: [number, number]) => {
  const newSet = new Set(set)
  newSet.delete(`${coordinates[0]}, ${coordinates[1]}`)
  return newSet
}

const useStore = create<MapState>((set) => ({
  currentStruct: undefined,
  setCurrentStruct: (struct) => set({ currentStruct: struct }),
  currentTile: undefined,
  setCurrentTile: (tile) => set({ currentTile: tile }),
  clearCurrentTile: () => set({ currentTile: undefined }),
  isBuilding: false,
  setIsBuilding: (isBuilding) => set({ isBuilding: isBuilding }),
  view: View.Standard,
  setView: (view) => set({ view: view }),
  scarecrows: new Set(),
  addScarecrow: (coordinates) => set((state) => ({
    scarecrows: addToSet(state.scarecrows, coordinates)
  })),
  removeScarecrow: (coordinates) => set((state) => ({
    scarecrows: removeFromSet(state.scarecrows, coordinates)
  })),
}))

export default useStore;
