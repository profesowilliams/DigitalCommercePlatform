import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    gap: '8px',
    width: '183px',
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.25))',
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#FFFFFF',
    width: '14px',
    height: '7px',
    transform: 'rotate(180deg)',
    overflow: 'inherit',
  },
}));

export default CustomTooltip;
