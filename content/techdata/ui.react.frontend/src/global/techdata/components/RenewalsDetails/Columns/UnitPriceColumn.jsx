import { TextField } from "@mui/material";
import { teal } from "@mui/material/colors";
import React, { useState } from "react";

import { thousandSeparator } from "../../../helpers/formatting";

function UnitPriceColumn(props) {
  const { value, setValue, isEditing, rowIndex, data } = props;
  const [price, setPrice] = useState(value);

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
  const handleValueChange = (event) => {
    const value = event?.target?.value;
    setPrice(value);   
  };

  return !isEditing ? (
    <div className="price">{thousandSeparator(value)}</div>
  ) : (
    <div className="price-editted">
      <TextField
        error={false}
        label=""
        inputProps={{
          min: 0,
          style: {
            textAlign: "right",
            paddingRight: "0",
            paddingTop: "0",
            marginTop: "8px",
            fontSize: "12px",
          },
        }}
        sx={{ width: "6rem", ...textfieldsStyles }}
        // value={purchaseOrderNumber}
        variant="standard"
        value={price}
        onBlur={() => setValue(price)}
        onChange={handleValueChange}
      />
    </div>
  );
}

export default UnitPriceColumn;
