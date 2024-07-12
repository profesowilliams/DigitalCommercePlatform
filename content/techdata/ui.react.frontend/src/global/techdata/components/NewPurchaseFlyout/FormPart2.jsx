import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { AutoCompleteSearchIcon } from '../../../../fluentIcons/FluentIcons';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete, Button, TextField } from '@mui/material';
import {
  checkQuoteExitsforReseller,
  copyQuote,
  resellerLookUp,
} from '../CopyFlyout/api';
import { QuoteDetails } from './QuoteDetails';

function FormPart2({
  copyFlyout,
  newPurchaseFlyout,
  newPurchaseFlyoutConfig,
  formPart1States,
}) {
  const {
    accountNumber,
    firstName,
    lastName,
    email,
    endUserCompanyName,
    endUserCompanyFirstName,
    endUserCompanyLastName,
    endUserEmail,
    endUserType,
    endUserAdress1,
    endUserAdress2,
    endUserCity,
    endUserAreaCode,
    endUserCountry,
  } = formPart1States;

  // Vendor state
  const [quotes, setQuotes] = useState([]);
  const [vendorNumber, setVendorNumber] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Date
  const startDate = '01/01/2024';
  const endDate = '01/01/2025';
  const duration = '365 days';
  const licensePriceLevel = '1 (Qty: 1-9)';

  // Search Vendor part No
  const handleResellerIdChange = async (event) => {
    setIsTyping(true);
    setErrorMessage('');
    const resellerId = event.target.value;
    setVendorNumber(resellerId);

    if (resellerId.length >= 3) {
      setIsAutocompleteOpen(true);
      const response = await resellerLookUp(
        encodeURIComponent(resellerId),
        copyFlyout?.accountLookUpEndpoint
      );
      if (response.isError) {
        setErrorMessage(copyFlyout?.unknownError);
        setQuotes([]);
      } else {
        setQuotes(response);
      }
    } else {
      setIsAutocompleteOpen(false);
      setQuotes([]);
    }
  };

  const checkQuoteInList = (quote) =>
    quotes.find((q) => q.accountNumber === quote.accountNumber);

  const findSelectedQuote = async (newInput) => {
    if (!newInput) {
      return;
    }

    if (!checkQuoteInList(newInput)) {
      setErrorMessage(
        getDictionaryValueOrKey(copyFlyout?.accountDoesntExistError)
      );
      return;
    }

    const quoteExists = await checkQuoteExitsforReseller(
      newInput.accountNumber ?? vendorNumber,
      newPurchaseFlyoutConfig?.data?.agreementNumber,
      copyFlyout?.checkQuoteExitsforResellerEndpoint
    );

    if (!selectedQuote) {
      setEnableCopy(!quoteExists);
    }

    if (quoteExists) {
      setIsTyping(false);
      setErrorMessage(copyFlyout?.quoteExistsError);
    } else {
      setVendorNumber('');
      setQuotes([]);
      setErrorMessage('');
      setSelectedQuote(newInput);
      setIsTyping(false);
    }
    setIsAutocompleteOpen(false);
  };

  const handleQuoteSelectedChange = (event, newInput) => {
    findSelectedQuote(newInput);
    const selectedQuote = findSelectedQuote(newInput);
    setSelectedQuote(selectedQuote);
    setErrorMessage('');
  };

  //TODO: Delete handle copy if not used after US 578976
  const handleCopy = async () => {
    if (!enableCopy) {
      return;
    }

    setIsLoading(true);

    const response = await copyQuote(
      newPurchaseFlyoutConfig?.data?.source?.id,
      selectedQuote.accountNumber,
      vendorNumber,
      copyFlyout?.copyQuoteEndpoint
    );
    setIsLoading(false);
    resetGrid();
    closeFlyout();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      selectQuoteForCopying();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const selectQuoteForCopying = () => {
    const newInput = quotes.find(
      (quote) => quote.accountNumber === vendorNumber
    );
    findSelectedQuote(newInput || vendorNumber);
  };

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.accountNumber} ${option.name}`,
  });

  return (
    <>
      <div className="cmp-flyout-newPurchase__form-details">
        <p className="cmp-flyout-newPurchase__form-details__title">
          {getDictionaryValueOrKey(newPurchaseFlyout.orderDetails)}
        </p>
        <div className="cmp-flyout-newPurchase__form-details__card">
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout.resellerDetails)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCompanyName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {accountNumber}
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
              {getDictionaryValueOrKey(newPurchaseFlyout.endUserDetails)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCompanyFirstName} {endUserCompanyLastName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserEmail}
            </p>
          </div>
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout.endUserAddress)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserAreaCode}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserAdress1}, {endUserAdress2}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {endUserCity}, {endUserCountry}
            </p>
          </div>
        </div>
        <div className="cmp-flyout-newPurchase__form-details__description">
          <p className="cmp-flyout-newPurchase__form-details__description-title">
            {getDictionaryValueOrKey(newPurchaseFlyout.addProducts)}
          </p>
          <p className="cmp-flyout-newPurchase__form-details__description-text">
            {getDictionaryValueOrKey(
              newPurchaseFlyout.searchForAdditionalSoftware
            )}
          </p>
        </div>
        <div className="cmp-flyout-newPurchase__form-search">
          <Autocomplete
            id="combo-box-demo"
            open={isAutocompleteOpen}
            freeSolo={true}
            options={quotes}
            filterOptions={filterOptions}
            getOptionLabel={(option) => option.accountNumber ?? vendorNumber}
            onChange={handleQuoteSelectedChange}
            value={selectedQuote}
            onKeyDown={handleKeyDown}
            renderOption={(props, option) => {
              return (
                <li {...props}>
                  <div>
                    <div className="cmp-flyout-autocomplete__option-name">
                      <QuoteDetails
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
                  onChange={handleResellerIdChange}
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
            <span className="cmp-flyout-newPurchase__form-date__text">
              {endDate}
            </span>
          </div>
          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.duration)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {duration}
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
      </div>
    </>
  );
}

export default FormPart2;
