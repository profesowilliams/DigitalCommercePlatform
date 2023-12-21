import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Autocomplete from '@mui/material/Autocomplete';
import { usGet } from '../../../../../utils/api';

const NewItemForm = ({ labels, setNewItemFormVisible, domain }) => {
  const [values, setValues] = useState({
    manufacturersPartNumber: null,
    quantity: null,
  });
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const loading = open && suggestions.length === 0;

  const setNewSuggestions = (response) => {
    if (response) {
      setSuggestions(
        response.products.map((product) => product.manufacturerPartNumber)
      );
    }
  };

  const fetchSuggestions = async (newValue) => {
    try {
      const result = await usGet(
        `${domain}/v2/SearchProduct?SearchTerm=${newValue}`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAutocompleteChange = (key, newValue) => {
    fetchSuggestions(newValue).then((result) => {
      setNewSuggestions(result.data.content);
    });
  };

  const handleChange = (key, newValue) => {
    setValues({ ...values, [key]: newValue });
  };

  const isFormFilled = Object.values(values).every(
    (value) => value?.length > 0
  );

  useEffect(() => {
    if (!open) {
      setSuggestions([]);
    }
  }, [open]);

  return (
    <div className="new-item-form">
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={suggestions}
        loading={loading}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            id="standard-basic"
            label="Manufacturer's part number"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) =>
              handleAutocompleteChange(
                'manufacturersPartNumber',
                event.target.value
              )
            }
          />
        )}
      />
      <TextField
        id="standard-basic"
        label={getDictionaryValueOrKey(labels.quantity)}
        variant="standard"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => handleChange('quantity', event.target.value)}
      />
      <Button disabled={!isFormFilled} variant="outlined">
        {getDictionaryValueOrKey(labels.add)}
      </Button>
      <Button variant="outlined" onClick={() => setNewItemFormVisible(false)}>
        {getDictionaryValueOrKey(labels.cancelNewItem)}
      </Button>
    </div>
  );
};

export default NewItemForm;
