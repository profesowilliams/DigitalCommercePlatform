import React, { useLayoutEffect, } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { resellerConstants } from './utils';
import { useRef } from 'react';
import { handleValidation } from '../Common/utils';

export default function ResellerEdit({
  resellerDetails,
  isEmailValid,
  handlers,
}) {

  const { INVALID_EMAIL_TEXT, REQUIRED_FIELD, SIXTY, TWENTY } =
    resellerConstants;

  const MAX_LENGTH_SIXTY = { maxLength: SIXTY };
  const MAX_LENGTH_TWENTY = { maxLength: TWENTY };

  const { contact } = resellerDetails;
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

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  const handleEmailHelperText = (text) => {
    if (!isEmailValid && text.length !== 0) {
      return INVALID_EMAIL_TEXT;
    }

    if (!isEmailValid && text.length === 0) {
      return REQUIRED_FIELD;
    }

    return null;
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
        helperText={handleEmailHelperText(contact[0]?.email?.text)}
      />
      <CustomTextField
        id="reseller-phone"
        label="Contact telephone number"
        inputProps={MAX_LENGTH_TWENTY}
        variant="standard"
        value={contact[0]['phone']['text'] || ''}
        disabled={contact[0]['phone']['canEdit'] === false}
        onChange={handlers["phone"]}
        error={true}
        {...handleValidation(contact[0]?.phone)}
      />
    </Box>
  );
}
