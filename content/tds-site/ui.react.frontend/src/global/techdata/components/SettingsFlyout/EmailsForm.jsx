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
const EmailsForm = ({ options }) => {
  const [values, setValues] = useState([]);

  const handleChange = (newValue) => {
    if (values.includes(newValue)) {
      setValues(values.filter((value) => value !== newValue));
    } else {
      setValues([...values, newValue]);
    }
  };

  return (
    <div className="emails-form">
      <FormControl>
        {options && (
          <>
            <FormControlLabel
              key={options[0].key}
              control={
                <Checkbox
                  sx={styleCheckbox}
                  checked={values.includes(options[0].key)}
                />
              }
              label={options[0].label}
              onChange={() => handleChange(options[0].key)}
            />
            <p className="default-email">Default Email Address</p>
            <FormControlLabel
              key={options[1].key}
              control={
                <Checkbox
                  sx={styleCheckbox}
                  checked={values.includes(options[1].key)}
                />
              }
              label={options[1].label}
              onChange={() => handleChange(options[1].key)}
            />
          </>
        )}
      </FormControl>
    </div>
  );
};

export default EmailsForm;
