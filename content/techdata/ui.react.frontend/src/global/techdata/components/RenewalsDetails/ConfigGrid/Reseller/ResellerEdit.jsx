import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { handleValidation, populateFieldConfigsFromService, getFieldMessage, handleEmailHelperText } from '../Common/utils';
import { getDictionaryValue, getDictionaryValueOrKey } from '../../../../../../utils/utils';
import { mapAddressToShipTo } from "../../../RenewalsGrid/Orders/orderingRequests"
import { AddressDetails } from './AddressDetails';
import { get } from '../../../../../../utils/api' 
import { StyledDetailsAutocomplete } from '../../MuiStyledComponents/StyledDetailsAutocomplete';

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
  const [shipToCurrentValue, setShipToCurrentValue] = useState(defaultAddressName);
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
      setAddresses(result?.data?.content || []);
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
    setShipToCurrentValue(newInput?.name || null)
  };

  const handleShipToNameOnChange = async (event) => {
    setAccountName(event.target.value);
  };

  // const computeBrandColor = () => {
  //   return branding === 'cmp-grid-techdata' ? '#000C21' : '#005758';
  // }

  return (
    <Box
      className="cmp-renewals-qp__edit-panel"
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
      {//shipToDetails?.id?.canEdit &&
        <StyledDetailsAutocomplete
          id="combo-box-addresses"   
          //open={isAutocompleteOpen}   
          autoHighlight 
          disablePortal
          disableClearable 
          options={addresses}
          defaultValue={defaultAddressName}
          renderInput={(params) => (
            <CustomTextField
              id="ship-to"
              {...params}
              //value={shiptToCurrentValue}
              label={getDictionaryValueOrKey(resellerLabels.shipToEditLabel)}
              variant="standard"
              onChange={handleShipToNameOnChange}   
              helperText={getFieldMessage(shipToDetails?.id)}  
              InputLabelProps={{ className: shipToCurrentValue ? '' : "autocompleteErrorLabel"}}  
              {...handleValidation(shipToDetails?.id)}      
              //{...populateFieldConfigsFromService(shipToDetails?.id)} 
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