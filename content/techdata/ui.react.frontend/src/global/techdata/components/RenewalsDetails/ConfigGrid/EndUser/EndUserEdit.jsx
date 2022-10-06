import React from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { endUserLables } from './utils';
import { handleValidation, populateFieldConfigsFromService, getFieldMessage, handleEmailHelperText } from '../Common/utils';

export default function EndUserEdit({
  endUserDetails,
  isEmailValid,
  ...props
}) {
  const {
    handleAddressChange,
    handleAddressTwoChange,
    handleCityChange,
    handleContactNameChange,
    handleCountryChange,
    handleEmailChange,
    handleNameChange,
    handlePhoneChange,
    handlePostalCodeChange,
    handleVendorAccChange,
  } = props;

  const {
    endUserName,
    endUserFullName,
    endUserEmail,
    endUserPhone,
    endUserAddress1,
    endUserAddress2,
    endUserCity,
    endUserCountry,
    endUserAreaCode,
    endUserVendorAccountNumber,
  } = endUserLables;
  const { contact, address, eaNumber } = endUserDetails;
  const contactName = contact[0]?.name;
  const { line1, line2, city, country, postalCode } = address;

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  return (
    <Box className="cmp-renewals-qp__edit-planel" component="form" sx={formBoxStyle} noValidate autoComplete="off">
      <CustomTextField
        autoFocus={true}
        id="end-user-name"
        label={endUserName}
        variant="standard"
        onChange={(e) => handleNameChange(e)}
        {...handleValidation(endUserDetails?.name, true)}
        helperText={getFieldMessage(endUserDetails?.name, true)}
        {...populateFieldConfigsFromService(endUserDetails?.name)}
      />
      <CustomTextField
        id="contact-name"
        label={endUserFullName}
        variant="standard"
        onChange={(e) => handleContactNameChange(e)}
        {...handleValidation(contactName, true)}
        helperText={getFieldMessage(contactName, true)}
        {...populateFieldConfigsFromService(contactName)}
      />
      <CustomTextField
        id="email"
        label={endUserEmail}
        variant="standard"
        onChange={(e) => handleEmailChange(e)}
        error={!isEmailValid}
        helperText={handleEmailHelperText(contact[0]?.email?.text, isEmailValid)}
        {...populateFieldConfigsFromService(contact[0]?.email)}
      />
      <CustomTextField
        id="phone"
        label={endUserPhone}
        variant="standard"
        onChange={(e) => handlePhoneChange(e)}
        helperText={getFieldMessage(contact[0]?.phone)}
        {...handleValidation(contact[0]?.phone)}
        {...populateFieldConfigsFromService(contact[0]?.phone)}
      />
      <CustomTextField
        id="address"
        label={endUserAddress1}
        variant="standard"
        onChange={(e) => handleAddressChange(e)}
        {...handleValidation(line1)}
        helperText={getFieldMessage(line1)}
        {...populateFieldConfigsFromService(line1)}
      />
      <CustomTextField
        id="addressTwo"
        label={endUserAddress2}
        variant="standard"
        onChange={(e) => handleAddressTwoChange(e)}
        helperText={getFieldMessage(line2)}
        {...populateFieldConfigsFromService(line2)}
      />
      <CustomTextField
        id="city"
        label={endUserCity}
        variant="standard"
        onChange={(e) => handleCityChange(e)}
        {...handleValidation(city)}
        helperText={getFieldMessage(city)}
        {...populateFieldConfigsFromService(city)}
      />
      <CustomTextField
        id="country"
        label={endUserCountry}
        variant="standard"
        onChange={(e) => handleCountryChange(e)}
        {...handleValidation(country)}
        helperText={getFieldMessage(country)}
        {...populateFieldConfigsFromService(country)}
      />
      <CustomTextField
        id="area-code"
        label={endUserAreaCode}
        variant="standard"
        onChange={(e) => handlePostalCodeChange(e)}
        {...handleValidation(postalCode)}
        helperText={getFieldMessage(postalCode)}
        {...populateFieldConfigsFromService(postalCode)}
      />
      <CustomTextField
        id="vendor-acc-no"
        label={endUserVendorAccountNumber}
        variant="standard"
        onChange={(e) => handleVendorAccChange(e)}
        {...handleValidation(eaNumber, true)}
        helperText={getFieldMessage(eaNumber, true)}
        {...populateFieldConfigsFromService(eaNumber)}
      />
    </Box>
  );
}
