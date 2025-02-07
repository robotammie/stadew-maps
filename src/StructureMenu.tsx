import { Box } from "@mui/material";
import Scarecrow from "./Structures/Scarecrow";
import Sprinkler from "./Structures/Sprinkler";

const styles = {
  margin: 0,
  padding: '5px 10px',
  width: 'full',
  display: 'flex',
};

const StructureMenu = () => {
  return (
    <div>
      <Box sx={styles}>
        <div style={{margin: '0px 10px', width: '80px'}}>
            Scarecrow
        </div>
        <Scarecrow onMap={false}/>
      </Box>
      <Box sx={styles}>
        <div style={{margin: '0px 10px', width: '80px'}}>
            Sprinkler
        </div>
        <Sprinkler onMap={false}/>
      </Box>
    </div>
  );
}

export default StructureMenu;