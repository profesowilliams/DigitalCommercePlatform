import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { CustomTextField } from '../../../Widgets/CustomTextField';
import { handleValidation, populateFieldConfigsFromService, getFieldMessage, handleEmailHelperText } from '../Common/utils';
import { getDictionaryValue, getDictionaryValueOrKey } from '../../../../../../utils/utils';
import { mapAddressToShipTo, mapShipToDetailsToAddress } from "../../../RenewalsGrid/Orders/orderingRequests"
import { AddressDetails } from './AddressDetails';
import { get } from '../../../../../../utils/api';
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
  const [shipToEditLabel] = useState(getDictionaryValueOrKey(resellerLabels.shipToEditLabel));
  const [addresses, setAddresses] = useState([]);
  const [shipTo, setShipTo] = useState(shipToDetails);
  const [currentAddress, setCurrentAddress] = useState(mapShipToDetailsToAddress(shipToDetails));
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
    const id = {...shipTo?.id, text: newInput?.id};
    const newShipTo = {...shipTo, ...mapAddressToShipTo({...newInput, id: id})};
    delete newShipTo.nameUpper;
    setShipTo(newShipTo);
    shipToOnChange(newShipTo);
    setCurrentAddress(mapShipToDetailsToAddress(newShipTo));
  };

  const isTdBranding = () => {
    return branding === 'cmp-grid-techdata';
  }

  const filterOptions = (options, params) => {
    const filtered = options.filter((option) => {
      const value = option.name + option.line1 + option.postalCode + option.city + option.stateName;
      return value.toUpperCase().indexOf(params.inputValue.toUpperCase()) !== -1;
    });
    return filtered;
  };

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
      {shipTo?.id?.canEdit &&
        <StyledDetailsAutocomplete
          id="combo-box-addresses"   
          autoHighlight 
          disablePortal
          disableClearable 
          filterOptions={filterOptions}
          isTdBrand={isTdBranding()}
          options={addresses}
          renderInput={(params) => (
            <CustomTextField
              id="ship-to"
              {...params}
              variant="standard"
              label={shipToEditLabel}
              required={shipTo?.id?.isMandatory} 
              helperText={getFieldMessage(shipTo?.id)}   
              {...handleValidation(shipTo?.id)}
            />
          )
          }
          getOptionLabel={(option) => option.name || ''}
          onChange={handleShipToOnChange}
          value={currentAddress}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option?.id}>
                <div>
                  <div>
                    <AddressDetails address={option} />
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