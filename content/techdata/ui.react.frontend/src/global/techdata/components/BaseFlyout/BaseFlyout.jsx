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
  useEffect(() => {
    let timer;
    if(open) {
      timer = setTimeout(() => document.body.style.paddingRight = '0px', 333);
    } else {
      document.body.style.removeProperty('padding-right');
    };
    return () => {
      document.body.style.removeProperty('padding-right');
      clearTimeout(timer);
    }
  },[open])

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
