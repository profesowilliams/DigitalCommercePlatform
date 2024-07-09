import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const OrderFilterDateType = ({ onChangeRadio, options, dateType }) => {
  const styleLabel = {
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
    },
    '& .MuiTypography-root': {
      fontSize: '14px',
    },
  };
  const styleRadio = {
    color: '#262626',
    '&.Mui-checked': {
      color: '#005758',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  };
  const [value, setValue] = useState(dateType || options[0].key);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChangeRadio(e.target.value);
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {options?.map((option) => (
          <FormControlLabel
            sx={styleLabel}
            key={option.key}
            value={option.key}
            control={<Radio sx={styleRadio} />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default OrderFilterDateType;