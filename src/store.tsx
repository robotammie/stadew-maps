import create from 'zustand'

interface MapState {
  currentStruct: Building | undefined
  setCurrentStruct: (struct: Building | undefined) => void
  currentTile: Tile | undefined
  setCurrentTile: (tile: Tile | undefined) => void
  clearCurrentTile: () => void
  isBuilding: boolean
  setIsBuilding: (isBuilding: boolean) => void
}

const useStore = create<MapState>((set) => ({
  currentStruct: undefined,
  setCurrentStruct: (struct) => set({ currentStruct: struct }),
  currentTile: undefined,
  setCurrentTile: (tile) => set({ currentTile: tile }),
  clearCurrentTile: () => set({ currentTile: undefined }),
  isBuilding: false,
  setIsBuilding: (isBuilding) => set({ isBuilding: isBuilding }),
}))

export default useStore;
