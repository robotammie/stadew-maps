import React,  { FC }  from 'react';

import ScarecrowSvg from '../svgs/Scarecrow.svg';
import useStore from '../store';
import { View } from '../types.d'


let scarecrowStyles = {
  margin: '0px 10px',
  padding: 0,
  cursor: 'pointer',
  width: '20px',
  height: '20px',
  border: '1px solid black',
  backgroundColor: 'tan',
};

const scarecrowSprite: React.JSX.Element = <img src={ScarecrowSvg} alt="Scarecrow" height="100%" draggable={false}/>

const Scarecrow: FC = () => {
  const setCurrentStruct = useStore((state) => state.setCurrentStruct);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setView = useStore((state) => state.setView);

  return (
    <div
      className="Scarecrow"
      style={scarecrowStyles}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({name: 'Scarecrow', sprite: scarecrowSprite})
        setView(View.Scarecrow);
      }}
      onDragEnd={(_) => {
        setIsBuilding(true);
        setView(View.Standard);
      }}
    >
      { scarecrowSprite }
    </div>
  );
};

export default Scarecrow;