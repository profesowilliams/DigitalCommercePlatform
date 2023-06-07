import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const OrderFilterDateType = ({
  onChangeRadio,
  dateType,
  orderDate,
  shipDate,
  invoiceDate,
}) => {
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

  return (
    <div className="check-order-wrapper">
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={dateType}
          onChange={onChangeRadio}
        >
          <FormControlLabel
            sx={styleLabel}
            value={orderDate}
            control={<Radio sx={styleRadio} />}
            label={orderDate}
          />
          <FormControlLabel
            sx={styleLabel}
            value={shipDate}
            control={<Radio sx={styleRadio} />}
            label={shipDate}
          />
          <FormControlLabel
            sx={styleLabel}
            value={invoiceDate}
            control={<Radio sx={styleRadio} />}
            label={invoiceDate}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};
export default OrderFilterDateType;
