import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const NewItemForm = ({ labels }) => {
  const [values, setValues] = useState({
    manufacturersPartNumber: null,
    quantity: null,
  });

  const handleChange = (key, newValue) => {
    setValues({ ...values, [key]: newValue });
  };

  const isFormFilled = Object.values(values).every(
    (value) => value?.length > 0
  );
  console.log(values, isFormFilled);

  return (
    <div className="new-item-form">
      <TextField
        id="standard-basic"
        label="Manufacturer's part number"
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) =>
          handleChange('manufacturersPartNumber', event.target.value)
        }
      />
      <TextField
        id="standard-basic"
        label={getDictionaryValueOrKey(labels.quantity)}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => handleChange('quantity', event.target.value)}
      />
      <Button disabled={!isFormFilled} variant="outlined">
        {getDictionaryValueOrKey(labels.add)}
      </Button>
    </div>
  );
};

export default NewItemForm;
