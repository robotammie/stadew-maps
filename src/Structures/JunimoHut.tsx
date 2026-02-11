import React,  { FC }  from 'react';

import JunimoHutSvg from '../svgs/JunimoHut.svg';
import useStore from '../store';
import useStructStore from '../structStore';
import { Structs, StructProps, Views } from '../types.d'

import { styles } from './BaseStruct';

// check if given tile is within the aoE of a given junimo hut
export function AoEFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  return Math.abs(tile[0] - struct[0]) <= 8 && Math.abs(tile[1] - struct[1]) <= 8 && !FootprintFunction(struct, tile);
}

export function FootprintFunction(
  struct: [number, number],
  tile: [number, number]
): boolean {
  return Math.abs(tile[0] - struct[0]) <= 1 && tile[1] - struct[1] <= 0 && tile[1] - struct[1] >= -1;
}

const junimoHutSprite: React.JSX.Element =
  <img
    src={JunimoHutSvg}
    alt={Structs.JunimoHut}
    height="100%"
    draggable={false}
  />

const JunimoHut: FC<StructProps> = (props) => {
  const setView = useStore((state) => state.setView);
  const manualView = useStore((state) => state.manualView);
  const clearOriginTile = useStore((state) => state.clearOriginTile);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
  const addJunimoHut = useStructStore((state) => state.addJunimoHut);
  const removeJunimoHut = useStructStore((state) => state.removeJunimoHut);

  return (
    <div
      className={Structs.JunimoHut}
      style={styles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({
          name: Structs.JunimoHut,
          sprite: JunimoHut,
          build: addJunimoHut,
          raze: removeJunimoHut,
          aoeFunction: AoEFunction,
          footprintFunction: FootprintFunction,
        });
        if (!manualView) {
          setView(Views.Junimo);
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
      { junimoHutSprite }
    </div>
  );
};

export default JunimoHut;