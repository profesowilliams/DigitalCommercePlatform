import React from 'react';
import {
  BannerInfoIcon,
  AutoCompleteSearchIcon,
} from '../../../../fluentIcons/FluentIcons';
import { Autocomplete, Button, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { QuoteDetails } from './QuoteDetails';

import { createFilterOptions } from '@mui/material/Autocomplete';
import { checkQuoteExitsforReseller, resellerLookUp } from '../CopyFlyout/api';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function FormPart1({
  copyFlyout,
  newPurchaseFlyout,
  newPurchaseFlyoutConfig,
  formPart1States,
  internalUser,
}) {
  const {
    quotes,
    setQuotes,
    accountNumber,
    setAccountNumber,
    isAutocompleteOpen,
    setIsAutocompleteOpen,
    selectedQuote,
    setSelectedQuote,
    errorMessage,
    setErrorMessage,
    isTyping,
    setIsTyping,
    firstName,
    setFirstName,
    firstNameError,
    setFirstNameError,
    lastName,
    setLastName,
    lastNameError,
    setLastNameError,
    email,
    setEmail,
    emailError,
    setEmailError,
    endUserCompanyName,
    setEndUserCompanyName,
    endUserCompanyNameError,
    setEndUserCompanyNameError,
    endUserCompanyFirstName,
    setEndUserCompanyFirstName,
    endUserCompanyFirstNameError,
    setEndUserCompanyFirstNameError,
    endUserCompanyLastName,
    setEndUserCompanyLastName,
    endUserCompanyLastNameError,
    setEndUserCompanyLastNameError,
    endUserEmail,
    setEndUserEmail,
    endUserEmailError,
    setEndUserEmailError,
    endUserType,
    setEndUserType,
    endUserTypeError,
    setEndUserTypeError,
    endUserAddress1,
    setEndUserAddress1,
    endUserAddress1Error,
    setEndUserAddress1Error,
    endUserAddress2,
    setEndUserAddress2,
    endUserAddress2Error,
    setEndUserAddress2Error,
    endUserCity,
    setEndUserCity,
    endUserCityError,
    setEndUserCityError,
    endUserAreaCode,
    setEndUserAreaCode,
    endUserAreaCodeError,
    setEndUserAreaCodeError,
    endUserCountry,
    setEndUserCountry,
    endUserCountryError,
    setEndUserCountryError,
  } = formPart1States;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reseller change
  const handleResellerIdChange = async (event) => {
    setIsTyping(true);
    setErrorMessage('');
    const resellerId = event.target.value;
    setAccountNumber(resellerId);

    if (resellerId.length === 0 && internalUser) {
      setErrorMessage(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    }
    if (resellerId.length >= 3) {
      setIsAutocompleteOpen(true);
      const response = await resellerLookUp(
        encodeURIComponent(resellerId),
        copyFlyout?.accountLookUpEndpoint
      );
      if (response.isError) {
        setErrorMessage(newPurchaseFlyout?.unknownError);
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
        getDictionaryValueOrKey(newPurchaseFlyout?.accountDoesntExistError)
      );
      return;
    }

    const quoteExists = await checkQuoteExitsforReseller(
      newInput.accountNumber ?? accountNumber,
      newPurchaseFlyoutConfig?.data?.agreementNumber,
      copyFlyout?.checkQuoteExitsforResellerEndpoint
    );

    if (quoteExists) {
      setIsTyping(false);
      setErrorMessage(newPurchaseFlyout?.quoteExistsError);
    } else {
      setAccountNumber('');
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      selectQuoteForCopying();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const selectQuoteForCopying = () => {
    const newInput = quotes.find(
      (quote) => quote.accountNumber === accountNumber
    );
    findSelectedQuote(newInput || accountNumber);
  };

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.accountNumber} ${option.name}`,
  });

  // Contact First Name
  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
    if (value.length === 0) {
      setFirstNameError(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    } else if (value.length > 35) {
      setFirstNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds35CharacterLimit)
      );
    } else {
      setFirstNameError('');
    }
  };

  // Contact Last Name
  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
    if (value.length === 0) {
      setLastNameError(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    } else if (value.length > 35) {
      setLastNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds35CharacterLimit)
      );
    } else {
      setLastNameError('');
    }
  };

  // Contact Email
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    if (value.length === 0) {
      setEmailError(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    } else if (!emailPattern.test(value)) {
      setEmailError(getDictionaryValueOrKey(newPurchaseFlyout?.invalidEmail));
    } else {
      setEmailError('');
    }
  };

  // End user Name
  const handleCompanyNameChange = (event) => {
    const value = event.target.value;
    setEndUserCompanyName(value);
    if (value.length === 0) {
      setEndUserCompanyNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (value.length > 40) {
      setEndUserCompanyNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds40CharacterLimit)
      );
    } else {
      setEndUserCompanyNameError('');
    }
  };

  // End user First Name
  const handleCompanyFirstNameChange = (event) => {
    const value = event.target.value;
    setEndUserCompanyFirstName(value);
    if (value.length === 0) {
      setEndUserCompanyFirstNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (value.length > 35) {
      setEndUserCompanyFirstNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds35CharacterLimit)
      );
    } else {
      setEndUserCompanyFirstNameError('');
    }
  };

  // End user Last Name
  const handleCompanyLastNameChange = (event) => {
    const value = event.target.value;
    setEndUserCompanyLastName(value);
    if (value.length === 0) {
      setEndUserCompanyLastNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (value.length > 35) {
      setEndUserCompanyLastNameError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds35CharacterLimit)
      );
    } else {
      setEndUserCompanyLastNameError('');
    }
  };

  // End user Email
  const handleEndUserEmailChange = (event) => {
    const value = event.target.value;
    setEndUserEmail(value);
    if (value.length === 0) {
      setEndUserEmailError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (
      value.length > 0 &&
      value.length <= 240 &&
      emailPattern.test(value)
    ) {
      setEndUserEmailError('');
    } else if (!emailPattern.test(value) || value.length > 240) {
      setEndUserEmailError(
        getDictionaryValueOrKey(newPurchaseFlyout?.invalidEmail)
      );
    } else {
      setEmailError('');
    }
  };

  // End user Type
  const handleEndUserTypeChange = (event) => {
    const value = event.target.value;
    setEndUserType(value);
    if (value.length === 0) {
      setEndUserTypeError(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    } else {
      setEndUserTypeError('');
    }
  };

  // End user Address 1
  const handleEndUserAddress1Change = (event) => {
    const value = event.target.value;
    setEndUserAddress1(value);
    if (value.length === 0) {
      setEndUserAddress1Error(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (value.length > 40) {
      setEndUserAddress1Error(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds40CharacterLimit)
      );
    } else {
      setEndUserAddress1Error('');
    }
  };

  // End user Address 2
  const handleEndUserAddress2Change = (event) => {
    const value = event.target.value;
    setEndUserAddress2(value);
    if (value.length > 40) {
      setEndUserAddress2Error(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds40CharacterLimit)
      );
    } else {
      setEndUserAddress2Error('');
    }
  };

  // End user City
  const handleEndUserCityChange = (event) => {
    const value = event.target.value;
    setEndUserCity(value);
    if (value.length === 0) {
      setEndUserCityError(getDictionaryValueOrKey(newPurchaseFlyout?.required));
    } else if (value.length > 40) {
      setEndUserCityError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds40CharacterLimit)
      );
    } else {
      setEndUserCityError('');
    }
  };

  // End user Area Code
  const handleEndUserAreaCodeChange = (event) => {
    const value = event.target.value;
    setEndUserAreaCode(value);
    if (value.length === 0) {
      setEndUserAreaCodeError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (value.length > 10) {
      setEndUserAreaCodeError(
        getDictionaryValueOrKey(newPurchaseFlyout?.exceeds10CharacterLimit)
      );
    } else {
      setEndUserAreaCodeError('');
    }
  };

  // End user Country
  const handleEndUserCountryChange = (event) => {
    const value = event.target.value;
    setEndUserCountry(value);
    if (value.length === 0) {
      setEndUserCountryError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else {
      setEndUserCountryError('');
    }
  };

  return (
    <>
      <div className="cmp-flyout-newPurchase__banner">
        <span className="cmp-flyout-newPurchase__banner__icon">
          <BannerInfoIcon />
        </span>
        <p className="cmp-flyout-newPurchase__banner__text">
          {getDictionaryValueOrKey(newPurchaseFlyout?.newPurchaseBanner)}
        </p>
      </div>
      <div className="cmp-flyout-newPurchase__description">
        <p className="cmp-flyout-newPurchase__description__title">
          {getDictionaryValueOrKey(newPurchaseFlyout?.agreementDetails)}
        </p>
        <p>{getDictionaryValueOrKey(newPurchaseFlyout?.description)}</p>
        <p className="cmp-flyout-newPurchase__description__subtext">
          {getDictionaryValueOrKey(newPurchaseFlyout?.indicatedRequiredField)}
        </p>
      </div>
      <div className="cmp-flyout-newPurchase__form">
        <div className="cmp-flyout-newPurchase__form__container">
          <p>{getDictionaryValueOrKey(newPurchaseFlyout?.resellerContact)}</p>
          { internalUser ?
          (<div className="cmp-flyout-newPurchase__form__input-reseller-search">
            <Autocomplete
              id="combo-box-demo"
              open={isAutocompleteOpen}
              freeSolo={true}
              options={quotes}
              filterOptions={filterOptions}
              getOptionLabel={(option) => option.accountNumber ?? accountNumber}
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
                          currentlyTypedWord={accountNumber}
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
                      newPurchaseFlyout?.resellerAccountNumber
                    )}
                    value={accountNumber}
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
          </div>) : (
            <TextField
                className="cmp-flyout-newPurchase__form__input-container"
                id="account-number"
                label={getDictionaryValueOrKey(
                  newPurchaseFlyout?.resellerAccountNumber
                )}
                value={accountNumber}
                variant="standard"
                onChange={handleResellerIdChange}
                error={!!errorMessage}
                helperText={errorMessage}
                inputProps={{ maxLength: 35 }}
              />
          )}
          <TextField
            className="cmp-flyout-newPurchase__form__input-container"
            id="first-name"
            label={getDictionaryValueOrKey(newPurchaseFlyout?.contactFirstName)}
            variant="standard"
            value={firstName}
            onChange={handleFirstNameChange}
            error={!!firstNameError}
            helperText={firstNameError}
            inputProps={{ maxLength: 35 }}
          />
          <TextField
            className="cmp-flyout-newPurchase__form__input-container"
            id="last-name"
            label={getDictionaryValueOrKey(newPurchaseFlyout?.contactLastName)}
            variant="standard"
            value={lastName}
            onChange={handleLastNameChange}
            error={!!lastNameError}
            helperText={lastNameError}
            inputProps={{ maxLength: 35 }}
          />
          <TextField
            className="cmp-flyout-newPurchase__form__input-container"
            id="email"
            label={getDictionaryValueOrKey(newPurchaseFlyout?.contactEmail)}
            variant="standard"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
        </div>
      </div>
      <div className="cmp-flyout-newPurchase__form__container">
        <p>{getDictionaryValueOrKey(newPurchaseFlyout?.endUserContact)}</p>
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-name"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserCompanyName)}
          variant="standard"
          value={endUserCompanyName}
          onChange={handleCompanyNameChange}
          error={!!endUserCompanyNameError}
          helperText={endUserCompanyNameError}
          inputProps={{ maxLength: 40 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-first-name"
          label={getDictionaryValueOrKey(
            newPurchaseFlyout?.endUserContactFirstName
          )}
          variant="standard"
          value={endUserCompanyFirstName}
          onChange={handleCompanyFirstNameChange}
          error={!!endUserCompanyFirstNameError}
          helperText={endUserCompanyFirstNameError}
          inputProps={{ maxLength: 35 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-last-name"
          label={getDictionaryValueOrKey(
            newPurchaseFlyout?.endUserContactLastName
          )}
          variant="standard"
          value={endUserCompanyLastName}
          onChange={handleCompanyLastNameChange}
          error={!!endUserCompanyLastNameError}
          helperText={endUserCompanyLastNameError}
          inputProps={{ maxLength: 35 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-email"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserEmail)}
          variant="standard"
          value={endUserEmail}
          onChange={handleEndUserEmailChange}
          error={Boolean(endUserEmailError)}
          helperText={endUserEmailError}
          inputProps={{ maxLength: 240 }}
        />
        <FormControl
          className="cmp-flyout-newPurchase__form__input-container"
          variant="standard"
          fullWidth
        >
          <InputLabel id="end-user-type-label">
            {getDictionaryValueOrKey(newPurchaseFlyout?.endUserType)}
          </InputLabel>
          <Select
            labelId="end-user-type-label"
            id="end-user-type"
            value={endUserType}
            onChange={handleEndUserTypeChange}
            error={!!endUserTypeError}
          >
            <MenuItem value="Commercial">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserTypeComercial)}
            </MenuItem>
            <MenuItem value="Education">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserTypeEducation)}
            </MenuItem>
            <MenuItem value="Government">
              {getDictionaryValueOrKey(
                newPurchaseFlyout?.endUserTypeGovernment
              )}
            </MenuItem>
          </Select>
          {endUserTypeError && (
            <p style={{ color: 'red' }}>{endUserTypeError}</p>
          )}
        </FormControl>
      </div>
      <div className="cmp-flyout-newPurchase__form__container">
        <p>{getDictionaryValueOrKey(newPurchaseFlyout?.endUserAddress)}</p>
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-address-1"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserAdress1)}
          variant="standard"
          value={endUserAddress1}
          onChange={handleEndUserAddress1Change}
          error={!!endUserAddress1Error}
          helperText={endUserAddress1Error}
          inputProps={{ maxLength: 40 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-address-2"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserAdress2)}
          variant="standard"
          value={endUserAddress2}
          onChange={handleEndUserAddress2Change}
          error={!!endUserAddress2Error}
          helperText={endUserAddress2Error}
          inputProps={{ maxLength: 40 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-city"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserCity)}
          variant="standard"
          value={endUserCity}
          onChange={handleEndUserCityChange}
          error={!!endUserCityError}
          helperText={endUserCityError}
          inputProps={{ maxLength: 40 }}
        />
        <TextField
          className="cmp-flyout-newPurchase__form__input-container"
          id="end-user-area-code"
          label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserAreaCode)}
          variant="standard"
          value={endUserAreaCode}
          onChange={handleEndUserAreaCodeChange}
          error={!!endUserAreaCodeError}
          helperText={endUserAreaCodeError}
          inputProps={{ maxLength: 10 }}
        />
        <FormControl
          className="cmp-flyout-newPurchase__form__input-container"
          variant="standard"
          fullWidth
        >
          <InputLabel id="end-user-country-label">
            {getDictionaryValueOrKey(newPurchaseFlyout?.endUserCountry)}
          </InputLabel>
          <Select
            labelId="end-user-country-label"
            id="end-user-country"
            value={endUserCountry}
            onChange={handleEndUserCountryChange}
            error={!!endUserCountryError}
          >
            <MenuItem value="Commercial">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserVietnam)}
            </MenuItem>
            <MenuItem value="Education">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserCambodia)}
            </MenuItem>
            <MenuItem value="Government">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserLaos)}
            </MenuItem>
          </Select>
          {endUserCountryError && (
            <p style={{ color: 'red' }}>{endUserCountryError}</p>
          )}
        </FormControl>
      </div>
    </>
  );
}

export default FormPart1;
