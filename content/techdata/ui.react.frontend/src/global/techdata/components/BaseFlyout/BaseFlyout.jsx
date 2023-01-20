import { Drawer, SwipeableDrawer } from '@mui/material';
import React from 'react';

function BaseFlyout({ children, open, onClose, width = '350px', anchor = "right" }) {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{'& .MuiPaper-root':{width}}}
    >
      {children}
    </Drawer>
  );
}

export default BaseFlyout;
