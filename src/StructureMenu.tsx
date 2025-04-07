import { Box } from "@mui/material";
import { Structs } from "./types.d";
import Scarecrow from "./Structures/Scarecrow";
import Sprinkler1 from "./Structures/Sprinkler1";
import Sprinkler2 from "./Structures/Sprinkler2";
import Sprinkler3 from "./Structures/Sprinkler3";
import Sprinkler4 from "./Structures/Sprinkler4";
import JunimoHut from "./Structures/JunimoHut";

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
        <Sprinkler1 onMap={false}/>
        <div style={textStyles}>
            {Structs.Sprinkler1}
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <Sprinkler2 onMap={false}/>
        <div style={textStyles}>
            {Structs.Sprinkler2}
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <Sprinkler3 onMap={false}/>
        <div style={textStyles}>
            {Structs.Sprinkler3}
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <Sprinkler4 onMap={false}/>
        <div style={textStyles}>
            {Structs.Sprinkler4}
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <Scarecrow onMap={false}/>
        <div style={textStyles}>
            Scarecrow
        </div>
      </Box>
      <Box sx={spriteStyles}>
        <JunimoHut onMap={false}/>
        <div style={textStyles}>
            Junimo Hut
        </div>
      </Box>
    </div>
  );
}

export default StructureMenu;