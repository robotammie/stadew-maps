import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import useStore from './store';
import { Views } from './types.d';

const buttonStyles = {
  width: '125px',
  margin: '0px 0px 10px 20px',
  backgroundColor: '#ad723e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ab7f59'
  },
};

const ViewSelector: React.FC  = () => {
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);
  const setManualView = useStore((state) => state.setManualView);

  const getViewName = (view: Views): string => {
    switch (view) {
      case Views.Sprinkler:
        return 'View';
      case Views.Scarecrow:
        return 'Scarecrow';
      case Views.Junimo:
        return 'Junimo Hut';
      default:
        return 'View';
    }
  };

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" sx={buttonStyles} {...bindTrigger(popupState)}>
            {getViewName(view)}
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                setView(Views.Sprinkler);
                setManualView(true);
                popupState.close();
              }}
            >
              Default
            </MenuItem>
            <MenuItem
              onClick={() => {
                setView(Views.Scarecrow);
                setManualView(true);
                popupState.close();
              }}
            >
              Scarecrow
            </MenuItem>
            <MenuItem
              onClick={() => {
                setView(Views.Junimo);
                setManualView(true);
                popupState.close();
              }}
            >
              Junimo Hut
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

export default ViewSelector;