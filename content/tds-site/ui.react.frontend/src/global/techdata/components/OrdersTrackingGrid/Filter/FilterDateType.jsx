import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const FilterDateType = ({ onRadioChange, options, selectedValue }) => {
  const styleLabel = {
    marginLeft: '-9px',
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
  const [value, setValue] = useState(selectedValue || options[0].key);

  const handleChange = (e) => {
    console.log('FilterDateType::handleChange');
    setValue(e.target.value);
    onRadioChange(e.target.value);
  };

  return (
    <>
      <p>Date criteria</p>
      <FormControl>
        <RadioGroup
          aria-labelledby="controlled-radio-buttons-group"
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
    </>
  );
};

export default FilterDateType;