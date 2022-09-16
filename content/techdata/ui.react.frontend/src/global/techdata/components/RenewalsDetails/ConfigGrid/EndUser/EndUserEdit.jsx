import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { endUserConstants } from './utils';
import { handleValidation } from '../Common/utils';

export default function EndUserEdit({
  endUser,
  endUserDetails,
  isEmailValid,
  ...props
}) {
  const {
    handleAddressChange,
    handleCityChange,
    handleContactNameChange,
    handleCountryChange,
    handleEmailChange,
    handleNameChange,
    handlePhoneChange,
    handlePostalCodeChange,
  } = props;

  const { INVALID_EMAIL_TEXT, SIXTY, TWENTY } =
    endUserConstants;
  const { contact, address } = endUserDetails;
  const contactName = contact[0]?.name;
  const { line1, city, country, postalCode } = address;

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  const MAX_LENGTH_SIXTY = { maxLength: SIXTY };
  const MAX_LENGTH_TWENTY = { maxLength: TWENTY };

  const validateNumber = (e, { maxLength }, handleInputFn) => {
    if (e.target.value?.length > maxLength){
      handleInputFn(e.target.value?.slice(0, maxLength));
    } else {
      handleInputFn(undefined, e);
    }
  }

  return (
    <Box component="form" sx={formBoxStyle} noValidate autoComplete="off">
      <CustomTextField
        disabled={endUserDetails?.name?.canEdit === false}
        required
        id="end-user-name"
        label="End user name"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={endUserDetails?.name?.text || ''}
        onChange={(e) => handleNameChange(e)}
        {...handleValidation(endUserDetails?.name)}
      />
      <CustomTextField
        disabled={contactName?.canEdit === false}
        required
        id="contact-name"
        label="Contact name"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={contactName?.text || ''}
        onChange={(e) => handleContactNameChange(e)}
        {...handleValidation(contactName)}
      />
      <CustomTextField
        disabled={line1?.canEdit === false}
        required
        id="address"
        label="Address 1"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={line1?.text || ''}
        onChange={(e) => handleAddressChange(e)}
        {...handleValidation(line1)}
      />
      <CustomTextField
        disabled={city?.canEdit === false}
        required
        id="city"
        label="City"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={city?.text || ''}
        onChange={(e) => handleCityChange(e)}
        {...handleValidation(city)}
      />
      <CustomTextField
        disabled={country?.canEdit === false}
        required
        id="country"
        label="Country"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={country?.text || ''}
        onChange={(e) => handleCountryChange(e)}
        {...handleValidation(country)}
      />
      <CustomTextField
        disabled={postalCode?.canEdit === false}
        required
        id="area-code"
        label="Area Code"
        variant="standard"
        type='number'
        onInput={(e) => validateNumber(e, MAX_LENGTH_TWENTY, handlePostalCodeChange)}
        value={postalCode?.text || ''}
        {...handleValidation(postalCode)}
      />
      <CustomTextField
        disabled={contact[0]?.email?.canEdit === false}
        required
        id="email"
        label="Contact email"
        variant="standard"
        value={contact[0]?.email?.text || ''}
        onChange={(e) => handleEmailChange(e)}
        inputProps={MAX_LENGTH_SIXTY}
        error={!isEmailValid}
        helperText={!isEmailValid ? INVALID_EMAIL_TEXT : null}
      />
      <CustomTextField
        disabled={contact[0]?.phone?.canEdit === false}
        id="phone"
        label="Contact phone number"
        variant="standard"
        value={contact[0]?.phone?.text || ''}
        type='number'
        onInput={(e) => validateNumber(e, MAX_LENGTH_TWENTY, handlePhoneChange)}
      />
    </Box>
  );
}
