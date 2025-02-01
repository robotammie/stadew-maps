import React,  { FC }  from 'react';

import ScarecrowSvg from '../svgs/Scarecrow.svg';
import useStore from '../store';
import { StructProps, View } from '../types.d'

const scarecrowStyles = (props: StructProps) => {
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

const scarecrowSprite: React.JSX.Element = <img src={ScarecrowSvg} alt="Scarecrow" height="100%" draggable={false}/>

const Scarecrow: FC<StructProps> = (props) => {
  const setCurrentStruct = useStore((state) => state.setCurrentStruct);
  const setIsBuilding = useStore((state) => state.setIsBuilding);
  const setView = useStore((state) => state.setView);

  return (
    <div
      className="Scarecrow"
      style={scarecrowStyles(props)}
      draggable={true}
      onDragStart={(e) => {
        setCurrentStruct({name: 'Scarecrow', sprite: Scarecrow});
        setView(View.Scarecrow);
      }}
      onDragEnd={(e) => {
        setIsBuilding(true);
        setView(View.Standard);
      }}
    >
      { scarecrowSprite }
    </div>
  );
};

export default Scarecrow;