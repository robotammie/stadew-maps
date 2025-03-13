import { Box } from "@mui/material";
import { Structs } from "./types.d";
import Scarecrow from "./Structures/Scarecrow";
import Sprinkler1 from "./Structures/Sprinkler1";

const spriteStyles = {
  margin: 0,
  padding: '5px 10px',
  width: 'full',
  display: 'flex',
};

const textStyles = {
  margin: '0px 10px',
  width: '120px',
  'text-align': 'left',
};

const StructureMenu = () => {
  return (
    <div>
      <Box sx={spriteStyles}>
        <Scarecrow onMap={false}/>
        <div style={textStyles}>
            Scarecrow
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <Sprinkler1 onMap={false}/>
        <div style={textStyles}>
            {Structs.Sprinkler1}
        </div>
      </Box>
    </div>
  );
}

export default StructureMenu;