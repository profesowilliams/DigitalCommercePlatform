import React, { useState, useRef, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { AutoCompleteSearchIcon } from '../../../../fluentIcons/FluentIcons';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete, Button, TextField } from '@mui/material';
import { vendorPartNoLookUp } from './api';
import { VendorPartNoDetails } from './VendorPartNoDetails';
import NewPurchaseTable from './NewPurchaseTable';
import DatePicker from './Datepicker';

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

function FormPart2({
  copyFlyout,
  newPurchaseFlyout,
  newPurchaseFlyoutConfig,
  formPart1States,
  componentProp,
  pickedResellerQuote,
  internalUser,
  currency,
  subtotalValue,
  setSubtotalValue,
}) {
  const {
    firstName,
    lastName,
    email,
    endUserCompanyName,
    endUserCompanyFirstName,
    endUserCompanyLastName,
    endUserEmail,
    endUserType,
    endUserAddress1,
    endUserAddress2,
    endUserCity,
    endUserAreaCode,
    endUserCountry,
  } = formPart1States;

  // Vendor state
  const [vendorPartNumbers, setVendorPartNumbers] = useState([]);
  const [vendorNumber, setVendorNumber] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedVendorPartNo, setSelectedVendorPartNo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Date
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 365);
  const formattedEndDate = formatDate(futureDate);
  const startDate = formatDate(today);
  const [pickedEndDate, setPickedEndDate] = useState(formattedEndDate);
  const [duration, setDuration] = useState('365');
  const licensePriceLevel = '1 (Qty: 1-9)';

  // Grid
  const { productId, manufacturerPartNumber, globalManufacturer } =
    selectedVendorPartNo || {};
  const data = [
    {
      productDetails: 'details text',
      productFamily: 'Family',
      productDescription: 'Description....',
      vendorPartNo: productId || 'vendor number',
      listPrice: 'list price',
      unitPrice: '25',
      qty: '1',
    },
  ];
  // Search Vendor part No
  const handleVendorPartNoChange = async (event) => {
    setIsTyping(true);
    setErrorMessage('');
    const resellerId = event.target.value;
    setVendorNumber(resellerId);

    if (resellerId.length >= 3) {
      setIsAutocompleteOpen(true);

      const payload = {
        MaxParts: 10,
        PartialManufacturerPartNumber: resellerId,
        Properties: [
          {
            Id: 'EndUserType',
            Value: endUserType,
          },
          {
            Id: 'Vendor',
            Value: 'ADOBE',
          },
        ],
      };
      const response = await vendorPartNoLookUp(
        newPurchaseFlyout?.vendorPartNoLookUpEndpoint,
        payload
      );
      if (response.isError) {
        setErrorMessage(copyFlyout?.unknownError);
        setVendorPartNumbers([]);
      } else {
        setVendorPartNumbers(response);
      }
    } else {
      setIsAutocompleteOpen(false);
      setVendorPartNumbers([]);
    }
  };

  const checkVendorPartNoInList = (quote) => {
    return vendorPartNumbers.find((q) => q.productId === quote.productId);
  };

  const findSelectedVendorPartNo = async (newInput) => {
    if (!newInput) {
      return;
    }

    if (!checkVendorPartNoInList(newInput)) {
      setErrorMessage(
        getDictionaryValueOrKey(copyFlyout?.accountDoesntExistError)
      );
      return;
    }

    const vendorPartNoExists = vendorPartNumbers.length > 0;

    if (vendorPartNoExists) {
      setIsTyping(false);
    } else {
      setVendorNumber('');
      setVendorPartNumbers([]);
      setErrorMessage('');
      setSelectedVendorPartNo(newInput);
      setIsTyping(false);
    }
    setIsAutocompleteOpen(false);
  };

  const handleQuoteSelectedChange = (event, newInput) => {
    findSelectedVendorPartNo(newInput);
    setSelectedVendorPartNo(newInput);
    setErrorMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      selectQuoteForCopying();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const selectQuoteForCopying = () => {
    const newInput = vendorPartNumbers.find(
      (vendorPart) => vendorPart.productId === vendorNumber
    );
    findSelectedVendorPartNo(newInput || vendorNumber);
  };

  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.productId} ${option.manufacturerPartNumber}`,
  });

  return (
    <>
      <div className="cmp-flyout-newPurchase__form-details">
        <p className="cmp-flyout-newPurchase__form-details__title">
          {getDictionaryValueOrKey(newPurchaseFlyout?.orderDetails)}
        </p>
        <div className="cmp-flyout-newPurchase__form-details__card">
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.resellerDetails)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {pickedResellerQuote?.name}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {pickedResellerQuote?.accountNumber}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {firstName} {lastName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {email}
            </p>
          </div>
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserDetails)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCompanyName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCompanyFirstName} {endUserCompanyLastName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserEmail}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserType}
            </p>
          </div>
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserAddress)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserAddress1}
              {endUserAddress2 && `, ${endUserAddress2}`}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCity}, {endUserCountry}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserAreaCode}
            </p>
          </div>
        </div>
        <div className="cmp-flyout-newPurchase__form-details__description">
          <p className="cmp-flyout-newPurchase__form-details__description-title">
            {getDictionaryValueOrKey(newPurchaseFlyout?.addProducts)}
          </p>
          <p className="cmp-flyout-newPurchase__form-details__description-text">
            {getDictionaryValueOrKey(
              newPurchaseFlyout?.searchForAdditionalSoftware
            )}
          </p>
        </div>
        <div className="cmp-flyout-newPurchase__form-search">
          <Autocomplete
            id="combo-box-demo"
            open={isAutocompleteOpen}
            freeSolo={true}
            options={vendorPartNumbers}
            filterOptions={filterOptions}
            getOptionLabel={(option) => {
              return option.productId ?? vendorNumber;
            }}
            onChange={handleQuoteSelectedChange}
            value={selectedVendorPartNo}
            onKeyDown={handleKeyDown}
            renderOption={(props, option) => {
              return (
                <li {...props}>
                  <div>
                    <div className="cmp-flyout-autocomplete__option-name">
                      <VendorPartNoDetails
                        quote={option}
                        currentlyTypedWord={vendorNumber}
                      />
                    </div>
                  </div>
                </li>
              );
            }}
            renderInput={(params) => {
              if (errorMessage && !isTyping) {
                params.inputProps.value = '';
              }
              return (
                <TextField
                  {...params}
                  error={!!errorMessage}
                  label={getDictionaryValueOrKey(
                    newPurchaseFlyout?.searchVendorPartNo
                  )}
                  value={vendorNumber}
                  variant="standard"
                  onChange={handleVendorPartNoChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <div className="cmp-autocomplete__button-section">
                        <Button
                          className="cmp-button__autocomplete-search"
                          variant="standard"
                          onClick={selectQuoteForCopying}
                        >
                          <AutoCompleteSearchIcon />
                        </Button>
                      </div>
                    ),
                  }}
                />
              );
            }}
          />
          {errorMessage && (
            <div className="cmp-flyout__content--error">{errorMessage}</div>
          )}
        </div>
        <div className="cmp-flyout-newPurchase__form-date">
          <div className="cmp-flyout-newPurchase__form-date__display-column">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.startDate)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {startDate}
            </span>
          </div>
          <div className="cmp-flyout-newPurchase__form-date__hyphen"></div>
          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endDate)}
            </span>
            <div
              onClick={() => setDatePickerOpen((prevState) => !prevState)}
              className="cmp-flyout-newPurchase__form-date__input"
            >
              {pickedEndDate ? pickedEndDate : formattedEndDate}
            </div>
          </div>
          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.duration)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {duration} {getDictionaryValueOrKey(newPurchaseFlyout?.days)}
            </span>
          </div>
          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.licensePriceLevel)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {licensePriceLevel}
            </span>
          </div>
        </div>
        {datePickerOpen && (
          <DatePicker
            isOpen={datePickerOpen}
            startDate={startDate}
            endDate={formattedEndDate}
            setPickedEndDate={setPickedEndDate}
            setDuration={setDuration}
          />
        )}
        <NewPurchaseTable
          data={data}
          config={newPurchaseFlyout}
          currency={currency}
          subtotalValue={subtotalValue}
          setSubtotalValue={setSubtotalValue}
          internalUser={internalUser}
        />
      </div>
    </>
  );
}

export default FormPart2;
