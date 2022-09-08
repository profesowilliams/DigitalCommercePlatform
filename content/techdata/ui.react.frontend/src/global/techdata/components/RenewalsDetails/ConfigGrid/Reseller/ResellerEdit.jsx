import React, { useLayoutEffect, } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { resellerConstants } from './utils';
import { useRef } from 'react';

export default function ResellerEdit({
  resellerDetails,
  isEmailValid,
  handlers,
}) {

  const { INVALID_EMAIL_TEXT, REQUIRED_FIELD, SIXTY, TWENTY } =
    resellerConstants;

  const MAX_LENGTH_SIXTY = { maxLength: SIXTY };
  const MAX_LENGTH_TWENTY = { maxLength: TWENTY };

  const { contact, vendorAccountNumber } = resellerDetails;
  const contactName = contact[0].name;

  // Rendering happens everytime a value is changed on the details.
  // Make sure to focus name input only 1 time while the component is mounted.
  const isMountedRef = useRef(true);
  const contactNameRef = useRef();
  useLayoutEffect(() => {
    if (isMountedRef.current) {
      contactNameRef.current.focus();
      isMountedRef.current = false;
    }
  });

  const showErrorField = (obj) => {
    return { error: obj['isValid'] === false || obj['text'] === '' };
  };

  const showErrorMsg = (obj) => {
    if (obj['text']?.length === 0 && obj['isMandatory'] === true) {
      return { helperText: REQUIRED_FIELD };
    }
  };

  const handleValidation = (obj) => {
    if (!obj) return;

    return {
      ...showErrorField(obj),
      ...showErrorMsg(obj),
    };
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
        inputRef={contactNameRef}
        id="reseller-contact-name"
        label="Contact full name"
        variant="standard"
        inputProps={MAX_LENGTH_SIXTY}
        value={contactName['text'] || ''}
        onChange={handlers["contactName"]}
        {...handleValidation(contactName)}
      />
      <CustomTextField
        required
        id="reseller-email"
        label="Contact email"
        variant="standard"
        value={contact[0]['email']['text'] || ''}
        disabled={contact[0]['email']['canEdit'] === false}
        onChange={handlers["email"]}
        inputProps={MAX_LENGTH_SIXTY}
        error={!isEmailValid}
        helperText={!isEmailValid ? INVALID_EMAIL_TEXT : null}
      />
      <CustomTextField
        id="reseller-phone"
        label="Contact telephone number"
        inputProps={MAX_LENGTH_TWENTY}
        variant="standard"
        value={contact[0]['phone']['text'] || ''}
        disabled={contact[0]['phone']['canEdit'] === false}
        onChange={handlers["phone"]}
      />
      <CustomTextField
        id="reseller-vendor-account"
        label="Vendor account N°"
        inputProps={MAX_LENGTH_TWENTY}
        variant="standard"
        value={vendorAccountNumber['text'] || ''}
        disabled={vendorAccountNumber['canEdit'] === false}
        onChange={handlers["vendorAccountNumber"]}
      />
    </Box>
  );
}
