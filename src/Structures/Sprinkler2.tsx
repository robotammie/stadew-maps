import React,  { FC }  from 'react';

import Sprinkler2Svg from '../svgs/sprinkler2.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d';

import { styles } from './BaseStruct';

// check if given tile is within the aoE of a given sprinkler
export function AoEFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  return Math.abs(tile[0] - struct[0]) <= 1 && Math.abs(tile[1] - struct[1]) <= 1;
}

const sprinkler2Sprite: React.JSX.Element =
  <img
    src={Sprinkler2Svg}
    alt={Structs.Sprinkler2}
    height="100%"
    draggable={false}
  />

const Sprinkler2: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addSprinkler2 = useStructStore((state) => state.addSprinkler2);
  const removeSprinkler2 = useStructStore((state) => state.removeSprinkler2);

  return (
    <div
      className={Structs.Sprinkler2}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler2,
          sprite: Sprinkler2,
          build: addSprinkler2,
          raze: removeSprinkler2,
          aoeFunction: AoEFunction,
        });
        setView(Views.Sprinkler);
      }}
      onDragEnd={(e) => {
        setIsBuilding(true);
        setView(Views.Standard);
        clearOriginTile();
      }}
    >
      { sprinkler2Sprite }
    </div>
  );
};

export default Sprinkler2;