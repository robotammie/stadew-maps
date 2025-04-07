import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import useStore from './store';
import { Views } from './types.d';

const buttonStyles = {
  width: '50px',
  margin: '0px 0px 10px 20px',
  backgroundColor: '#ad723e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ab7f59'
  },
};

const ViewSelector: React.FC  = () => {
  const setView = useStore((state) => state.setView);

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" sx={buttonStyles} {...bindTrigger(popupState)}>
            View
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                setView(Views.Sprinkler);
                popupState.close();
              }}
            >
              Default
            </MenuItem>
            <MenuItem
              onClick={() => {
                setView(Views.Scarecrow);
                popupState.close();
              }}
            >
              Scarecrow
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

export default ViewSelector;