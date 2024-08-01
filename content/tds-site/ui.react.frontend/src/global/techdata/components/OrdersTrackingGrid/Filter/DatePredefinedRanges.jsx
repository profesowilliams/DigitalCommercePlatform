import React, { useState, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';

const DatePredefinedRanges = ({ onChangeRadio, options, selectedValue }) => {
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

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

  const [value, setValue] = useState(selectedValue || options[options.length - 1].key);

  const handleChange = (e) => {
    console.log('DatePredefinedRanges::handleChange');
    setValue(e.target.value);
    onChangeRadio(e.target.value);
  };

  useEffect(() => {
    console.log('DatePredefinedRanges::useEffect');
    setValue(selectedValue);
  }, [selectedValue]);

  return (
    <>
      <p>Predefined ranges</p>
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
          <FormControlLabel
            sx={styleLabel}
            key="custom"
            value="custom"
            control={<Radio sx={styleRadio} />}
            label={translations?.PredefinedRanges_Custom || 'Custom'}
          />
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default DatePredefinedRanges;