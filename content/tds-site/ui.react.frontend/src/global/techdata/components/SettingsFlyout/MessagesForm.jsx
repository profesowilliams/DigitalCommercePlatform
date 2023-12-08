import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

const styleLabel = {
  marginBottom: '20px',
  '&.MuiFormControlLabel-root': {
    alignItems: 'flex-start',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};
const styleRadio = {
  color: '#003031',
  '&.Mui-checked': {
    color: '#005758',
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const MessagesForm = ({ options }) => {
  const [value, setValue] = useState(options?.[0]?.key);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="messages-form">
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
    </div>
  );
};

export default MessagesForm;
