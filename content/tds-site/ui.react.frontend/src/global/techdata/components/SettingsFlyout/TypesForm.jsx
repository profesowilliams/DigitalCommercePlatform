import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const styleCheckbox = {
  color: '#003031',
  '&.Mui-checked': {
    color: '#005758',
    accentColor: '#005758',
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const TypesForm = ({ options, value, onChange }) => {
  const [values, setValues] = useState(value);

  const handleChange = (newValue) => {
    if (values.includes(newValue)) {
      setValues(values.filter((value) => value !== newValue));
      onChange(values.filter((value) => value !== newValue));
    } else {
      setValues([...values, newValue]);
      onChange([...values, newValue]);
    }
  };

  return (
    <div className="types-form">
      <FormControl>
        {options &&
          options.map((option) => (
            <FormControlLabel
              key={option.key}
              control={
                <Checkbox
                  sx={styleCheckbox}
                  checked={values.includes(option.key)}
                />
              }
              label={option.label}
              onChange={() => handleChange(option.key)}
            />
          ))}
      </FormControl>
    </div>
  );
};

export default TypesForm;
