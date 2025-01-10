import { Box } from "@mui/material";
import { FC } from "react";
import ScarecrowSvg from "./svgs/Scarecrow.svg";

const styles = {
  margin: 0,
  padding: '0px 10px',
  width: 'full',
  display: 'flex',
};

const scarecrowStyles = {
  margin: '0px 10px',
  padding: 0,
  width: '20px',
  height: '20px',
  border: '1px solid black',
  backgroundColor: 'tan',
};

const Scarecrow: FC = () => {
  return (
    <Box sx={styles}>
      Scarecrow
      <div style={scarecrowStyles}>
        <img src={ScarecrowSvg} alt="Scarecrow" height="100%" width="100%"/>
      </div>
    </Box>
  );
};

const StructureMenu = () => {
  return (
    <div>
      <Scarecrow />
    </div>
  );
}

export default StructureMenu;