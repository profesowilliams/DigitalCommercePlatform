import React from "react";
import { teal } from "@mui/material/colors";

export const PlaceOrderMaterialUi = {
  orderButtonProps: {
    variant: "contained",    
  },
  circularProgress: { size: 20, sx: { color: "white", fontSize: "14px" } },
  textfieldsStyles: {   
    variant: "standard",
    label: "Purchase Order Number",
    sx: {
       width: "100%",
      "& label.Mui-focused": {
        color: "#a6aaab",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#a6aaab",
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
    },
  },
  checkbox: {
    color: teal[800],
    "&.Mui-checked": { color: teal[600] },
    paddingLeft: "0px",
  },
};
