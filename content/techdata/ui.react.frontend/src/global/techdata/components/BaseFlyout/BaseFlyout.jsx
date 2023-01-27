import { Drawer } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import usePositionBelowSubheader from '../../hooks/usePositionBelowSubheader';

function BaseFlyout({
  children,
  open,
  onClose,
  width = '350px',
  anchor = 'right',
}) {

  const { positioning, calculatePosition } = usePositionBelowSubheader({unmountedFn:false});
  const { top, height } = positioning;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          width,
          ...(top && height ? { top, height } : {}),
          '@media (max-width: 600px)': {
            width: '100%',
          }
        },
      }}
    >
      {children}
    </Drawer>
  );
}

export default BaseFlyout;
