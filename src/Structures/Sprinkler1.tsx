import React,  { FC }  from 'react';

import Sprinkler1Svg from '../svgs/sprinkler1.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d';

import { styles } from './BaseStruct';

// check if given tile is within the aoE of a given sprinkler
export function AoEFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  if (struct[0] === tile[0]) {
    return Math.abs(struct[1] - tile[1]) <= 1;
  } else if (struct[1] === tile[1]) {
    return Math.abs(struct[0] - tile[0]) === 1;
  }
  return false;
}

const sprinkler1Sprite: React.JSX.Element =
  <img
    src={Sprinkler1Svg}
    alt={Structs.Sprinkler1}
    height="100%"
    draggable={false}
  />

const Sprinkler1: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addSprinkler1 = useStructStore((state) => state.addSprinkler1);
  const removeSprinkler1 = useStructStore((state) => state.removeSprinkler1);

  return (
    <div
      className={Structs.Sprinkler1}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler1,
          sprite: Sprinkler1,
          build: addSprinkler1,
          raze: removeSprinkler1,
          aoeFunction: AoEFunction,
        });
        if (!manualView) {
          setView(Views.Sprinkler);
        }
      }}
      onDragEnd={(e) => {
        setIsBuilding(true);
        if (!manualView) {
          setView(Views.Sprinkler);
        }
        clearOriginTile();
      }}
    >
      { sprinkler1Sprite }
    </div>
  );
};

export default Sprinkler1;