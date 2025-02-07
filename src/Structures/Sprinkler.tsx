import React,  { FC }  from 'react';

import SprinklerSvg from '../svgs/sprinkler1.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d'

// check if given tile is within the aoE of a given sprinkler
export function AoEFunction(
  sprinkler: [number, number],
  tile: [number, number]
): boolean {
  if (sprinkler[0] === tile[0]) {
    return Math.abs(sprinkler[1] - tile[1]) === 1;
  } else if (sprinkler[1] === tile[1]) {
    return Math.abs(sprinkler[0] - tile[0]) === 1;
  }
  return false;
}

const styles = (props: StructProps) => {
  return {
    margin: `0px ${props.onMap? 0 : 10}px`,
    padding: 0,
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    border: (props.onMap ? 'none' : '1px solid black'),
    backgroundColor: props.bgColor || 'tan',
  }
};

const sprinklerSprite: React.JSX.Element =
  <img
    src={SprinklerSvg}
    alt={Structs.Sprinkler}
    height="100%"
    draggable={false}
  />

const Sprinkler: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addSprinkler = useStructStore((state) => state.addSprinkler);
  const removeSprinkler = useStructStore((state) => state.removeSprinkler);

  return (
    <div
      className={Structs.Sprinkler}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.Sprinkler,
          sprite: Sprinkler,
          build: addSprinkler,
          raze: removeSprinkler,
        });
        setView(Views.Sprinkler);
      }}
      onDragEnd={(e) => {
        setIsBuilding(true);
        setView(Views.Standard);
        clearOriginTile();
      }}
    >
      { sprinklerSprite }
    </div>
  );
};

export default Sprinkler;