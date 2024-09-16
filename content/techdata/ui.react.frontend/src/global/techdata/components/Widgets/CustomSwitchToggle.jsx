import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const CustomSwitch = styled(Switch)(({ disabled }) => ({
  width: 32,
  height: 16,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      color: disabled ? '#888b8d' : '#005758',
      borderRadius: 20 / 2,
      transform: 'translateX(0px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: disabled ? '#888b8d' : '#005758',
        width: '31px',
        '&:before': {
          top: 0,
          left: '-0.5px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='16' viewBox='0 0 32 16' fill='none'%3E%3Cpath d='M24 0.999999C20.134 0.999999 17 4.13401 17 8C17 11.866 20.134 15 24 15C27.866 15 31 11.866 31 8C31 4.13401 27.866 1 24 0.999999Z' fill='white'/%3E%3Cpath d='M21.25 8L23.75 10.5L27.5 5' stroke='%23${
            disabled ? '888b8d' : '005758'
          }' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");`,
        },
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        borderRadius: 20 / 2,
        backgroundColor: disabled ? '#888b8d' : '#005758',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 30,
    height: 14,
    borderRadius: 20 / 2,
    boxShadow: 'none',
    backgroundColor: '#fff',
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: '0',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='33' height='15' viewBox='0 0 33 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 0.999999C3.68629 0.999998 1 3.68629 1 7C0.999999 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 0.999999 7 0.999999Z' fill='%23${
        disabled ? '888b8d' : '005758'
      }'/%3E%3Cpath d='M5 5L9 9M5 9L9 5' stroke='${'white'}' stroke-linecap='round'/%3E%3C/svg%3E%0A");`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: disabled ? '#888b8d' : '#fff',
    border: '1px solid',
    borderColor: disabled ? '#888b8d' : '#005758',
    borderRadius: 20 / 2,
  },
}));

function CustomSwitchToggle({ toggled = false, onToggleChanged, disabled }) {
  const [isToggled, setIsToggled] = useState(toggled);

const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (typeof onToggleChanged === 'function' && toggled !== isToggled) {
          onToggleChanged(isToggled);
            setIsToggled(toggled);
        }
    }, [isToggled, onToggleChanged, toggled]);

  const handleChange = () => {
    if (!disabled) {
      setIsToggled((prev) => !prev);
    }
  };

  return (
    <CustomSwitch
      checked={isToggled}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default CustomSwitchToggle;
