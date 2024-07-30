import { TextField } from '@mui/material';
import { teal } from '@mui/material/colors';
import React, { useState, useRef } from 'react';
import NumberFormat from 'react-number-format';

import { thousandSeparator } from '../../../helpers/formatting';

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={({ value }) => {
        onChange({
          target: {
            name: props.name,
            value,
          },
        });
      }}
      thousandSeparator
      decimalScale={2}
    />
  );
});

function UnitPriceColumn(props) {
  const { value, setValue, isEditing, rowIndex, data } = props;
  const [price, setPrice] = useState(value);
  const searchInput = useRef(null);
  const MAX_PRICE_VALUE = 999999999; 
  const ENTER_KEY = 13;
  const handleChange = (event) => {
    const value = event.target.value;   
    if (value <=0 && value) return setPrice(1);
    if (value > MAX_PRICE_VALUE) return setPrice(MAX_PRICE_VALUE);     
    setPrice(value);
  };

  const textfieldsStyles = {
    textAlign: "right",
    "& label.Mui-focused": {
      color: teal[800],
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: teal[800],
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a6aaab",
      },
      "&:hover fieldset": {
        borderColor: "#a6aaab",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#a6aaab",
      },
    },
  };

  const updateValue = () => { 
    if (isNaN(price)) return;
    if (price < 1) return setPrice(1); setValue(1);
    try {
      setValue(price);
    } catch (err) {
      console.log('🚀err >>', err);
    }
  };

  const onBlurField = event => {
    event.stopPropagation();
    updateValue();
  }

  const onEnterSaveValue = (event) => {
    if (event?.charCode === ENTER_KEY){
      updateValue(); 
      searchInput.current.blur();
    }
  }
  


  return !isEditing ? (
    <div className="cmp-unitprice">{thousandSeparator(value)}</div>
  ) : (
    <div className="cmp-unitprice-edit">
      <TextField
        label=""
        value={price}
        inputRef={searchInput} 
        onChange={handleChange}
        name="numberformat"
        id="formatted-uniteprice-input"
        InputProps={{
          min: 1,
          style: {
            textAlign: 'right',
            paddingRight: '0',
            paddingTop: '0',
            marginTop: '8px',
            fontSize: '12px',
          },
          inputComponent: NumberFormatCustom,
        }}
        sx={{ width: '6rem', ...textfieldsStyles }}
        variant="standard"
        onBlur={onBlurField}
        onKeyPress={onEnterSaveValue}
      />
    </div>
  );
}

export default UnitPriceColumn;
