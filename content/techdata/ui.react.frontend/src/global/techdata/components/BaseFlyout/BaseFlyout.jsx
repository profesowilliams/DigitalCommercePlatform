import { Drawer } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

function BaseFlyout({
  children,
  open,
  onClose,
  width = '350px',
  anchor = 'right',
}) {
  const GAP = 7;
  const topReference = useRef();
  const [positioning, setPositioning] = useState({ top: '', height: '' });
  const [DOMLoaded, setDOMLoaded] = useState(false);
  const { top, height } = positioning;
  function calcPositionBelowSubheader() {
    const subHeaderElement = document.querySelector('.subheader > div > div');
    if (!subHeaderElement) return;
    const { top, height } = document
      .querySelector('.subheader > div > div')
      .getBoundingClientRect();
    if (top > 0) topReference.current = { top, height };  
    let topCalculation = top + GAP + height;
    document.body.style.overflow = 'hidden';
    setPositioning({
      top: `${topCalculation}px`,
      height: `calc(100vh - ${topCalculation}px)`,
    });
  }
  useEffect(() => {
    window.addEventListener('load', calcPositionBelowSubheader);
    return () => window.removeEventListener('load', calcPositionBelowSubheader);
  }, []);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          width,
          ...(top && height ? { top, height } : {}),
        },
      }}
    >
      {children}
    </Drawer>
  );
}

export default BaseFlyout;
