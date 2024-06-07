import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextField, Button } from '@mui/material';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import { usPost } from '../../../../../utils/api';
import { debounce } from '../../OrdersTrackingGrid/utils/utils';

function CustomPaper({ children }) {
  return (
    <Paper
      sx={{
        width: '520px',
        '& .MuiAutocomplete-listbox': {
          bgcolor: '#fff',
          '& .MuiAutocomplete-option': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'block',
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            bgcolor: '#fff',
            '&.Mui-focused': {
              bgcolor: '#fff',
            },
          },
        },
        '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
          bgcolor: '#F8F8F8',
        },
      }}
    >
      {children}
    </Paper>
  );
}

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
  const [value, setValue] = useState('');
  const minimalQueryLength = 3;

  const loading =
    open && value.length >= minimalQueryLength && suggestions.length === 0;

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
          product.title = product.displayValue.slice(0, 70);
          return product;
        })
      );
    }
  };

  const fetchSuggestions = useCallback(async (newValue) => {
    try {
      const result = await usPost(`${domain}/v2/Product/Search`, {
        query: newValue,
      });
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const handleAutocompleteInput = useCallback(
    (newValue) => {
      newValue.length >= minimalQueryLength
        ? fetchSuggestions(newValue).then((result) => {
            setNewSuggestions(result?.data?.content || []);
          })
        : setSuggestions([]);
    },
    [fetchSuggestions]
  );

  const debouncedAutocomplete = useMemo(() => {
    return debounce(handleAutocompleteInput);
  }, []);

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
        PaperComponent={CustomPaper}
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => option.title || ''}
        filterOptions={(x) => x}
        loading={loading}
        loadingText={`${getDictionaryValueOrKey('Loading')}...`} //TODO: temporary, fix later with one translation approach or the other
        open={open}
        autoSelect={false}
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
        sx={{
          width: 400,
          '& .MuiAutocomplete-input': {
            textOverflow: 'clip',
          },
        }}
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
            onKeyPress={(e) => {
              if (e.key === '*' || e.key === '^') e.preventDefault();
            }}
            onChange={(event) => {
              const newValue = event.target.value.replace('*', '').trim();
              debouncedAutocomplete(event.target.value.replace(/[*^]/g, ''));
              setValue(newValue);
            }}
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
