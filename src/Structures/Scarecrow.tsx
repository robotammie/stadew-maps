import React,  { FC }  from 'react';

import ScarecrowSvg from "../svgs/Scarecrow.svg";



let scarecrowStyles = {
  margin: '0px 10px',
  padding: 0,
  cursor: 'pointer',
  width: '20px',
  height: '20px',
  border: '1px solid black',
  backgroundColor: 'tan',
};

const Scarecrow: FC = () => {
  return (
    <div
      className="scarecrow-icon"
      style={scarecrowStyles}
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragEnd={(e) => {}}
    >
      <img src={ScarecrowSvg} alt="Scarecrow" height="100%"/>
    </div>
  );
};

export default Scarecrow;