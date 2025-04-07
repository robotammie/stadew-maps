import create from 'zustand'

import { Tile, Views } from './types.d'

interface MapState {
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
}

const useStore = create<MapState>((set) => ({
  originTile: undefined,
  setOriginTile: (tile) => set({ originTile: tile }),
  clearOriginTile: () => set({ originTile: undefined }),
  destinationTile: undefined,
  setDestinationTile: (tile) => set({ destinationTile: tile }),
  clearDestinationTile: () => set({ destinationTile: undefined }),
  isBuilding: false,
  setIsBuilding: (isBuilding) => set({ isBuilding: isBuilding }),
  view: Views.Sprinkler,
  setView: (view) => set({ view: view }),
  scarecrows: new Set(),
}))

export default useStore;
