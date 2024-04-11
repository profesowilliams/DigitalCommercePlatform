import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Autocomplete from '@mui/material/Autocomplete';
import { usGet } from '../../../../../utils/api';

const NewItemForm = ({
  labels = {},
  setNewItemFormVisible,
  domain,
  addNewItem,
}) => {
  const [values, setValues] = useState({
    manufacturersPartNumber: null,
    quantity: null,
    item: null,
  });
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const loading = open && suggestions.length === 0;
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

  const findMatchingLabel = (product) => {
    let matchingKey = 'manufacturerPartNumber';
    if (
      product.manufacturerPartNumber
        ?.toLowerCase()
        ?.includes(autocompleteInputValue.toLowerCase())
    ) {
      matchingKey = 'manufacturerPartNumber';
    } else if (
      product.id.toLowerCase()?.includes(autocompleteInputValue.toLowerCase())
    ) {
      matchingKey = 'id';
    }
    return product[matchingKey];
  };

  const setNewSuggestions = (response) => {
    if (response) {
      if (response.products.length === 0) {
        setIsError(true);
        setOpen(false);
      } else {
        setIsError(false);
      }
      setSuggestions(
        response.products.map((product) => {
          product.title =
            findMatchingLabel(product) +
            ' - ' +
            product.description.slice(0, 50) +
            '...';
          return product;
        })
      );
    }
  };

  const fetchSuggestions = async (newValue) => {
    try {
      const result = await usGet(
        `${domain}/v2/Product/Search?query=${newValue}`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAutocompleteInput = (newValue) => {
    setAutocompleteInputValue(newValue);
    newValue.length >= 3 &&
      fetchSuggestions(newValue).then((result) => {
        setNewSuggestions(result.data.content);
      });
  };

  const handleChange = (key, newValue) => {
    setValues((prevState) => ({ ...prevState, [key]: newValue }));
  };

  const handleAddNewItem = async () => {
    setNewItemFormVisible(false);
    addNewItem({ ...values.item }, values.quantity);
  };

  const isFormFilled = Object.values(values).every((value) => Boolean(value));

  useEffect(() => {
    if (!open) {
      setSuggestions([]);
    }
  }, [open]);

  useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }, [suggestions]);

  return (
    <div className="new-item-form">
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => option.title}
        loading={loading}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, value) => {
          handleChange('manufacturersPartNumber', event.target.textContent);
          handleChange('item', value);
        }}
        sx={{ width: 400, fontSize: 12 }}
        renderInput={(params) => (
          <TextField
            {...params}
            id="standard-basic"
            label={getDictionaryValueOrKey(labels.manufacturersPartNumber)}
            variant="standard"
            error={!focused && isError}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            helperText={
              isError
                ? getDictionaryValueOrKey(labels?.newItemErrorMessage)
                : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => handleAutocompleteInput(event.target.value)}
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
      <Button
        disabled={!isFormFilled}
        variant="outlined"
        onClick={handleAddNewItem}
      >
        {getDictionaryValueOrKey(labels.add)}
      </Button>
      <Button variant="outlined" onClick={() => setNewItemFormVisible(false)}>
        {getDictionaryValueOrKey(labels.cancelNewItem)}
      </Button>
    </div>
  );
};

export default NewItemForm;
