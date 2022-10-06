import React, { useLayoutEffect, } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { useRef } from 'react';
import { handleValidation, populateFieldConfigsFromService, getFieldMessage, handleEmailHelperText } from '../Common/utils';

export default function ResellerEdit({
  resellerDetails,
  isEmailValid,
  handlers,
}) {
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

  return (
    <Box className="cmp-renewals-qp__edit-planel" component="form" sx={formBoxStyle} noValidate autoComplete="off">
      <CustomTextField
        inputRef={contactNameRef}
        id="reseller-contact-name"
        label="Contact full name"
        variant="standard"
        onChange={handlers["contactName"]}
        helperText={getFieldMessage(contactName, true)}
        {...handleValidation(contactName, true)}
        {...populateFieldConfigsFromService(contactName)}
      />
      <CustomTextField
        id="reseller-email"
        label="Contact email"
        variant="standard"
        onChange={handlers["email"]}
        error={!isEmailValid}
        helperText={handleEmailHelperText(contact[0]?.email?.text, isEmailValid)}
        {...populateFieldConfigsFromService(contact[0]['email'])}
      />
      <CustomTextField
        id="reseller-phone"
        label="Contact telephone number"
        variant="standard"
        onChange={handlers["phone"]}
        helperText={getFieldMessage(contact[0]['phone'])}
        {...handleValidation(contact[0]['phone'])}
        {...populateFieldConfigsFromService(contact[0]['phone'])}
      />
    </Box>
  );
}
