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
    draggable={false}
    style={{
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block'
    }}
  />

const Sprinkler1: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addStruct = useStructStore((state) => state.addStruct);
  const removeStruct = useStructStore((state) => state.removeStruct);

  return (
    <div
      className={Structs.Sprinkler1}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler1,
          sprite: Sprinkler1,
          build: (coordinates: [number, number]) => addStruct(Structs.Sprinkler1, coordinates),
          raze: (coordinates: [number, number]) => removeStruct(Structs.Sprinkler1, coordinates),
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
