import React,  { FC }  from 'react';

import Sprinkler3Svg from '../svgs/sprinkler3.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d';

import { styles } from './BaseStruct';

// check if given tile is within the aoE of a given sprinkler
export function AoEFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  return Math.abs(tile[0] - struct[0]) <= 2 && Math.abs(tile[1] - struct[1]) <= 2;
}

const sprinkler3Sprite: React.JSX.Element =
  <img
    src={Sprinkler3Svg}
    alt={Structs.Sprinkler3}
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

const Sprinkler3: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addSprinkler3 = useStructStore((state) => state.addSprinkler3);
  const removeSprinkler3 = useStructStore((state) => state.removeSprinkler3);

  return (
    <div
      className={Structs.Sprinkler3}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler3,
          sprite: Sprinkler3,
          build: addSprinkler3,
          raze: removeSprinkler3,
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
      { sprinkler3Sprite }
    </div>
  );
};

export default Sprinkler3;