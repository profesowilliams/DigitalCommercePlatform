import React, { useState } from 'react';
import Box from '@mui/material/Box';
import isEmail from 'validator/es/lib/isEmail';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { INVALID_EMAIL_TEXT, REQUIRED_FIELD, SIXTY, TWENTY } from './utils';

export default function EndUserEdit({ endUser, _endUserEdit }) {
  let contact = endUser.contact[0];
  let contactName = contact['name'];
  let address = endUser.address;
  let { line1, city, country, postalCode } = address;

  const [isEmailValid, setIsEmailValid] = useState(
    contact['email']['isValid'] || true
  );
  const [endUserEmail, setEndUserEmail] = useState(
    contact['email']['text'] || ''
  );

  const handleChange = (e) => {
    let email = e.target.value;
    setEndUserEmail(email);
    if (isEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const showErrorField = (obj) => {
    return { error: obj['isValid'] === false };
  };

  const showErrorMsg = (obj) => {
    if (obj && obj['text']?.length === 0 && obj['isMandatory'] === true) {
      return { helperText: REQUIRED_FIELD };
    }
  };

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  return (
    <Box component="form" sx={formBoxStyle} noValidate autoComplete="off">
      <CustomTextField
        required
        id="end-user-name"
        label="End user name"
        variant="standard"
        inputProps={{ maxlength: SIXTY }}
        defaultValue={endUser['name']['text'] || ''}
        {...showErrorField(endUser['name'])}
        {...showErrorMsg(endUser['name'])}
      />
      <CustomTextField
        required
        id="contact-name"
        label="Contact name"
        variant="standard"
        inputProps={{ maxlength: SIXTY }}
        defaultValue={contactName['text']}
        {...showErrorField(contactName)}
        {...showErrorMsg(contactName)}
      />
      <CustomTextField
        required
        id="address"
        label="Address 1"
        variant="standard"
        inputProps={{ maxlength: SIXTY }}
        defaultValue={line1['text']}
        {...showErrorField(line1)}
        {...showErrorMsg(line1)}
      />
      <CustomTextField
        required
        id="city"
        label="City"
        variant="standard"
        inputProps={{ maxlength: SIXTY }}
        defaultValue={city['text']}
        {...showErrorField(city)}
        {...showErrorMsg(city)}
      />
      <CustomTextField
        required
        id="country"
        label="Country"
        variant="standard"
        inputProps={{ maxlength: SIXTY }}
        defaultValue={country}
        {...showErrorMsg(country)}
      />
      <CustomTextField
        required
        id="area-code"
        label="Area Code"
        variant="standard"
        inputProps={{ maxlength: TWENTY }}
        defaultValue={postalCode['text']}
        {...showErrorField(postalCode)}
        {...showErrorMsg(postalCode)}
      />
      <CustomTextField
        required
        id="email"
        label="Contact email"
        variant="standard"
        value={endUserEmail}
        onChange={(e) => handleChange(e)}
        inputProps={{ maxlength: SIXTY }}
        error={!isEmailValid}
        helperText={!isEmailValid ? INVALID_EMAIL_TEXT : null}
      />
      <CustomTextField
        id="phone"
        label="Contact phone number"
        inputProps={{ maxlength: TWENTY }}
        variant="standard"
        defaultValue={contact['phone']['text']}
      />
    </Box>
  );
}
