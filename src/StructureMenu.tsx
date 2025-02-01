import { Box } from "@mui/material";
import Scarecrow from "./Structures/Scarecrow";

const styles = {
  margin: 0,
  padding: '0px 10px',
  width: 'full',
  display: 'flex',
};

const StructureMenu = () => {
  return (
    <div>
      <Box sx={styles}>
        Scarecrow
        <Scarecrow onMap={false}/>
      </Box>
    </div>
  );
}

export default StructureMenu;