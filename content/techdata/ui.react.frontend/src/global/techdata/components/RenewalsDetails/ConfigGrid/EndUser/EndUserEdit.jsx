import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { _alpha, styled } from '@mui/material/styles';

export default function EndUserEdit({ endUser, _endUserEdit }) {
  const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#727679',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#005758',
    },
  });

  const showErrorField = (obj) => {
    if (obj && obj['isValid'] === false) {
      return { "error": true };
    }
  };

  const REQUIRED_FIELD = "This is a required field.";
  const showErrorMsg = (obj) => {
    if (obj && obj['isValid'] === false && obj['text'].length === 0 && obj['isMandatory'] === true) {
      return { "helperText": REQUIRED_FIELD };
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { width: "100%" },
        "& > div": { marginBottom: "16px" },
        "&.MuiBox-root": { marginTop: "20px" },
      }}
      noValidate
      autoComplete="off"
    >
      <CustomTextField
        required
        id="end-user-name"
        label="End user name"
        variant="standard"
        defaultValue={endUser["name"]["text"] || ""}
        {...showErrorField(endUser["name"])}
        {...showErrorMsg(endUser["name"])}
      />
      <CustomTextField
        required
        id="contact-name"
        label="Contact name"
        variant="standard"
        defaultValue={endUser.contact[0]["name"]["text"]}
        {...showErrorField(endUser.contact[0]["name"])}
        {...showErrorMsg(endUser.contact[0]["name"])}
      />
      <CustomTextField
        required
        id="address"
        label="Address 1"
        variant="standard"
        defaultValue={endUser["address"]["line1"]["text"]}
        {...showErrorField(endUser["address"]["line1"])}
        {...showErrorMsg(endUser["address"]["line1"])}
      />
      <CustomTextField
        required
        id="city"
        label="City"
        variant="standard"
        defaultValue={endUser["address"]["city"]["text"]}
        {...showErrorField(endUser["address"]["city"])}
        {...showErrorMsg(endUser["address"]["city"])}
      />
      <CustomTextField
        required
        id="country"
        label="Country"
        variant="standard"
        defaultValue={endUser["address"]["country"]}
        {...showErrorMsg(endUser["address"]["country"])}
      />
      <CustomTextField
        required
        id="area-code"
        label="Area Code"
        variant="standard"
        defaultValue={endUser["address"]["postalCode"]["text"]}
        {...showErrorField(endUser["address"]["postalCode"])}
        {...showErrorMsg(endUser["address"]["postalCode"])}
      />
      <CustomTextField
        required
        id="email"
        label="Contact email"
        variant="standard"
        defaultValue={endUser.contact[0]["email"]["text"]}
        {...showErrorField(endUser.contact[0]["email"])}
        {...showErrorMsg(endUser.contact[0]["email"])}
      />
      <CustomTextField
        id="phone"
        label="Contact phone number"
        variant="standard"
        defaultValue={endUser.contact[0]["phone"]["text"]}
      />
    </Box>
  );
};
