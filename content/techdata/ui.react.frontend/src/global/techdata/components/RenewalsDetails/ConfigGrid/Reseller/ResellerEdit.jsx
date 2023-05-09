import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from '@mui/material';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { handleValidation, populateFieldConfigsFromService, getFieldMessage, handleEmailHelperText } from '../Common/utils';
import { getDictionaryValue } from '../../../../../../utils/utils';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import { AddressDetails } from './AddressDetails';
import { get } from '../../../../../../utils/api' 
import { mapAddressToShipTo } from "../../../RenewalsGrid/Orders/orderingRequests"

const StyledAutocomplete = styled(Autocomplete)({
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']": {
      color: '#FFFFFF',
      backgroundColor: '#000C21',//computeBrandColor
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'].Mui-focused": {
      color: '#FFFFFF',
      backgroundColor: '#000C21',
    },
    "& + .MuiAutocomplete-root .MuiInput-root .MuiInput-input": {
      color: '#E02020',
    },

  
    // "&.Mui-focused .MuiInputLabel-outlined": {
    //   color: "purple"
    // },
    "& .MuiAutocomplete-inputRoot": {
      color: "purple",
      // // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
      // '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
      //   // Default left padding is 6px
      //   paddingLeft: 26
      // },
      // "& .MuiOutlinedInput-notchedOutline": {
      //   borderColor: "green"
      // },
      // "&:hover .MuiOutlinedInput-notchedOutline": {
      //   borderColor: "red"
      // },
      // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      //   borderColor: "purple"
      // }
    }

  // "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
  //   // Default transform is "translate(14px, 20px) scale(1)""
  //   // This lines up the label with the initial cursor position in the input
  //   // after changing its padding-left.
  //   transform: "translate(34px, 20px) scale(1);"
  // },
  // "&.Mui-focused .MuiInputLabel-outlined": {
  //   color: "purple"
  // },
  // "& .MuiAutocomplete-inputRoot": {
  //   color: "purple",
  //   // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
  //   '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
  //     // Default left padding is 6px
  //     paddingLeft: 26
  //   },
  //   "& .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "green"
  //   },
  //   "&:hover .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "red"
  //   },
  //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple"
  //   }
  // }
});


export default function ResellerEdit({
  resellerDetails,
  isEmailValid,
  handlers,
  shipToDetails,
  addressesEndpoint,
  resellerLabels,
  updateDetails,
  shipToOnChange,
  branding,
}) {
  const { contact } = resellerDetails;
  const contactName = contact[0].name;
  const [accountName, setAccountName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressName] = useState(shipToDetails?.name ? JSON.parse(JSON.stringify({name: shipToDetails?.name})) : undefined);
  const [resetValue, setResetValue] = useState(defaultAddressName);
  
  const isMountedRef = useRef(true);
  const contactNameRef = useRef();

  useLayoutEffect(() => {
    if (isMountedRef.current) {
      contactNameRef.current?.focus();
      isMountedRef.current = false;
    }
  });

  useEffect(() => {
    getAddresses().then((result) => {
      setAddresses(result?.data?.content);
    })
  }, []);

  const getAddresses = async () => {
    const response = await get(
      `${addressesEndpoint}?customerNumber=${resellerDetails?.id}`
    );
    return response;
  };

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  const handleShipToOnChange = (event, newInput) => {
    shipToOnChange(mapAddressToShipTo(newInput));
  };

  const handleShipToNameOnChange = async (event) => {
    setAccountName(event.target.value);
  };

  const computeBrandColor = () => {
    return branding === 'cmp-grid-techdata' ? '#000C21' : '#005758';
  }

  return (
    <Box
      className="cmp-renewals-qp__edit-planel"
      component="form"
      sx={formBoxStyle}
      noValidate
      autoComplete="off"
    >
      {contactName.canEdit && (
        <CustomTextField
          inputRef={contactNameRef}
          id="reseller-contact-name"
          label={getDictionaryValue(
            'techdata.renewals.label.contactName',
            'Contact full name'
          )}
          variant="standard"
          onChange={handlers['contactName']}
          helperText={getFieldMessage(contactName, true)}
          {...handleValidation(contactName, true)}
          {...populateFieldConfigsFromService(contactName)}
        />
      )}
      {contact[0]['email'].canEdit && (
        <CustomTextField
          id="reseller-email"
          label={getDictionaryValue(
            'techdata.renewals.label.email',
            'Contact email'
          )}
          variant="standard"
          onChange={handlers['email']}
          error={!isEmailValid}
          helperText={handleEmailHelperText(
            contact[0]?.email?.text,
            isEmailValid
          )}
          {...populateFieldConfigsFromService(contact[0]['email'])}
        />
      )}
      {contact[0]['phone'].canEdit && (
        <CustomTextField
          id="reseller-phone"
          label={getDictionaryValue(
            'techdata.renewals.label.telephoneNumber',
            'Contact telephone number'
          )}
          variant="standard"
          onChange={handlers['phone']}
          helperText={getFieldMessage(contact[0]['phone'])}
          {...handleValidation(contact[0]['phone'])}
          {...populateFieldConfigsFromService(contact[0]['phone'])}
        />
      )}
      {
        <StyledAutocomplete
          id="combo-box-addresses"       
          disablePortal
          options={addresses}
          defaultValue={defaultAddressName}
          renderInput={(params) => (
            <CustomTextField
              id="ship-to"
              {...params}
              value={undefined}
              label={getDictionaryValueOrKey(resellerLabels.shipToEditLabel)}
              variant="standard"
              onChange={handleShipToNameOnChange}   
              helperText={getFieldMessage(shipToDetails?.id)}  
              InputLabelProps={{ className: "autocompleteErrorLabel" }}  
              {...handleValidation(shipToDetails?.id)}      
              //{...populateFieldConfigsFromService(shipToDetails?.name)} 
            />
          )
          }
          getOptionLabel={(option) => option.name}
          onChange={handleShipToOnChange}
          //value={resetValue}
          renderOption={(props, option) => {
            return (
              <li {...props} key={Math.floor(1000 * Math.random()).toString()}>
                <div>
                  <div>
                    <AddressDetails
                      address={option}
                      currentlyTypedWord={accountName}
                    />
                  </div>
                </div>
              </li>
            );
          }}
        />
      }
    </Box>
  );
}