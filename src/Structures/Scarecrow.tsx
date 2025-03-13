import React,  { FC }  from 'react';

import ScarecrowSvg from '../svgs/Scarecrow.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d'

import { styles } from './BaseStruct';

// const SCARECROW_RADIUS = 9;
const SCARECROW_RADIUS = 3;

// check if given tile is within the aoE of a given scarecrow
export function AoEFunction(
  scarecrow: [number, number],
  tile: [number, number]
): boolean {
  return (tile[0] - scarecrow[0]) ** 2 + (tile[1] - scarecrow[1]) ** 2 <= SCARECROW_RADIUS ** 2;
}

const scarecrowSprite: React.JSX.Element =
  <img
    src={ScarecrowSvg}
    alt={Structs.Scarecrow}
    height="100%"
    draggable={false}
  />

const Scarecrow: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addScarecrow = useStructStore((state) => state.addScarecrow);
  const removeScarecrow = useStructStore((state) => state.removeScarecrow);

  return (
    <div
      className={Structs.Scarecrow}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Scarecrow,
          sprite: Scarecrow,
          build: addScarecrow,
          raze: removeScarecrow,
        });
        setView(Views.Scarecrow);
      }}
      onDragEnd={(e) => {
        setIsBuilding(true);
        setView(Views.Standard);
        clearOriginTile();
      }}
    >
      { scarecrowSprite }
    </div>
  );
};

export default Scarecrow;