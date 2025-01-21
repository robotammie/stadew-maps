import React,  { FC, ReactNode }  from 'react';

import ScarecrowSvg from "../svgs/Scarecrow.svg";

import useStore from '../store';


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
  return (
    <div
      className="scarecrow"
      style={scarecrowStyles}
      draggable={true}
      onDragStart={(e) => {
        console.log("onDragStart");
        setCurrentStruct(e.target as HTMLElement);
      }}
      onDragEnd={(_) => {
        console.log("onDragEnd");
        setIsBuilding(true);
      }}
    >
      { scarecrowSprite }
    </div>
  );
};

export default Scarecrow;