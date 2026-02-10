import React,  { FC }  from 'react';

import Sprinkler4Svg from '../svgs/sprinkler4.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d';

import { styles } from './BaseStruct';

// check if given tile is within the aoE of a given sprinkler
export function AoEFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  return Math.abs(tile[0] - struct[0]) <= 3 && Math.abs(tile[1] - struct[1]) <= 3;
}

const sprinkler4Sprite: React.JSX.Element =
  <img
    src={Sprinkler4Svg}
    alt={Structs.Sprinkler4}
    height="100%"
    draggable={false}
  />

const Sprinkler4: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addSprinkler4 = useStructStore((state) => state.addSprinkler4);
  const removeSprinkler4 = useStructStore((state) => state.removeSprinkler4);

  return (
    <div
      className={Structs.Sprinkler4}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler4,
          sprite: Sprinkler4,
          build: addSprinkler4,
          raze: removeSprinkler4,
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
      { sprinkler4Sprite }
    </div>
  );
};

export default Sprinkler4;