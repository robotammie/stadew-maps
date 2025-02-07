import create from 'zustand'

import { Building, Tile, Views } from './types.d'

interface MapState {
  currentStruct: Building | undefined
  setCurrentStruct: (element: Building | undefined) => void
  originTile: Tile | undefined
  setOriginTile: (tile: Tile | undefined) => void
  clearOriginTile: () => void
  destinationTile: Tile | undefined
  setDestinationTile: (tile: Tile | undefined) => void
  clearDestinationTile: () => void
  isBuilding: boolean
  setIsBuilding: (isBuilding: boolean) => void
  view: Views
  setView: (view: Views) => void
  scarecrows: Set<[number, number]>
  addScarecrow: (coordinates: [number, number]) => void
  removeScarecrow: (coordinates: [number, number]) => void
  // hoverStruct: Building | undefined
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
  originTile: undefined,
  setOriginTile: (tile) => set({ originTile: tile }),
  clearOriginTile: () => set({ originTile: undefined }),
  destinationTile: undefined,
  setDestinationTile: (tile) => set({ destinationTile: tile }),
  clearDestinationTile: () => set({ destinationTile: undefined }),
  isBuilding: false,
  setIsBuilding: (isBuilding) => set({ isBuilding: isBuilding }),
  view: Views.Standard,
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
