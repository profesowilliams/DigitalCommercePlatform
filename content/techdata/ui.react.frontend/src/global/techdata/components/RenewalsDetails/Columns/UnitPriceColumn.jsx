import { TextField } from '@mui/material';
import { teal } from '@mui/material/colors';
import React, { useState } from 'react';
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
    />
  );
});

function UnitPriceColumn(props) {
  const { value, setValue, isEditing, rowIndex, data } = props;
  const [price, setPrice] = useState(value);

  const handleChange = (event) => setPrice(event.target.value);

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

  const updateValue = (event) => {
    event.stopPropagation();
    if (isNaN(value)) return;
    if (value < 0) return;
    try {
      setValue(price);
    } catch (err) {
      console.log('🚀err >>', err);
    }
  };

  return !isEditing ? (
    <div className="cmp-unitprice">{thousandSeparator(value)}</div>
  ) : (
    <div className="cmp-unitprice-edit">
      <TextField
        label=""
        value={price}
        onChange={handleChange}
        name="numberformat"
        id="formatted-uniteprice-input"
        InputProps={{
          min: 0,
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
        onBlur={updateValue}
      />
    </div>
  );
}

export default UnitPriceColumn;
