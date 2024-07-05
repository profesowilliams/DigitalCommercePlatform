import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import {
  BannerInfoIcon,
  AutoCompleteSearchIcon,
} from '../../../../fluentIcons/FluentIcons';
import { Autocomplete, Button, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { QuoteDetails } from './QuoteDetails';
import {
  checkQuoteExitsforReseller,
  copyQuote,
  resellerLookUp,
} from '../CopyFlyout/api';

function NewPurchaseFlyout({
  store,
  copyFlyout,
  newPurchaseFlyout,
  subheaderReference,
  resetGrid,
  userData,
}) {
  const effects = store((state) => state.effects);
  const newPurchaseFlyoutConfig = store((state) => state.newPurchaseFlyout);
  const { pathname, search } = window.location;

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'newPurchaseFlyout',
      value: {
        show: false,
      },
    });
    window.history.replaceState(null, '', pathname + search);
  };
  const internalUser = userData?.isInternalUser;
  const externalUser = !internalUser;

  // Reseller state
  const [autocompleteTitle, setAutocompleteTitle] = useState(
    getDictionaryValueOrKey(newPurchaseFlyout?.resellerAccountNumber)
  );
  const [quotes, setQuotes] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Enable next button
  const [enableNext, setEnableNext] = useState(false);
  // Contact First Name state
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  // Contact Last Name state
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Contact Email state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // End user Name state
  const [endUserCompanyName, setEndUserCompanyName] = useState('');
  const [endUserCompanyNameError, setEndUserCompanyNameError] = useState('');

  // End user First Name state
  const [endUserCompanyFirstName, setEndUserCompanyFirstName] = useState('');
  const [endUserCompanyFirstNameError, setEndUserCompanyFirstNameError] =
    useState('');

  // End user First Name state
  const [endUserCompanyLastName, setEndUserCompanyLastName] = useState('');
  const [endUserCompanyLastNameError, setEndUserCompanyLastNameError] =
    useState('');

  // Contact Email state
  const [endUserEmail, setEndUserEmail] = useState('');
  const [endUserEmailError, setEndUserEmailError] = useState('');

  // End User Type state
  const [endUserType, setEndUserType] = useState('');
  const [endUserTypeError, setEndUserTypeError] = useState('');

  // End User Address 1 state
  const [endUserAdress1, setEndUserAddress1] = useState('');
  const [endUserAdress1Error, setEndUserAddress1Error] = useState('');

  // End User Address 2 state
  const [endUserAdress2, setEndUserAddress2] = useState('');
  const [endUserAdress2Error, setEndUserAddress2Error] = useState('');

  // End User City state
  const [endUserCity, setEndUserCity] = useState('');
  const [endUserCityError, setEndUserCityError] = useState('');

  // End User Area Code state
  const [endUserAreaCode, setEndUserAreaCode] = useState('');
  const [endUserAreaCodeError, setEndUserAreaCodeError] = useState('');

  // End User Country state
  const [endUserCountry, setEndUserCountry] = useState('');
  const [endUserCountryError, setEndUserCountryError] = useState('');

  useEffect(() => {
    if (!newPurchaseFlyoutConfig?.show) {
      setSelectedQuote(null);
      setAccountNumber('');
      setQuotes([]);
      setEnableCopy(false);
      setErrorMessage('');

      setFirstName('');
      setFirstNameError('');

      setLastName('');
      setLastNameError('');

      setEmail('');
      setEmailError('');

      // TODO: Populate those field with proper data by the end of US #578976
      if (externalUser) {
        setAccountNumber('');
        setFirstName('');
        setLastName('');
        setEmail('');
      }

      setEndUserCompanyName('');
      setEndUserCompanyNameError('');

      setEndUserCompanyFirstName('');
      setEndUserCompanyFirstNameError('');

      setEndUserCompanyLastName('');
      setEndUserCompanyLastNameError('');

      setEndUserEmail('');
      setEndUserEmailError('');

      setEndUserType('');
      setEndUserTypeError('');

      setEndUserAddress1('');
      setEndUserAddress1Error('');

      setEndUserCity('');
      setEndUserCityError('');

      setEndUserAreaCode('');
      setEndUserAreaCodeError('');

      setEndUserCountry('');
      setEndUserCountryError('');
    }
  }, [newPurchaseFlyoutConfig?.show]);

  // Reseller change
  const handleResellerIdChange = async (event) => {
    setIsTyping(true);
    setErrorMessage('');
    const resellerId = event.target.value;
    setAccountNumber(resellerId);

    if (resellerId.length >= 3) {
      setIsAutocompleteOpen(true);
      setAutocompleteTitle(getDictionaryValueOrKey(newPurchaseFlyout?.search));
      const response = await resellerLookUp(
        encodeURIComponent(resellerId),
        copyFlyout.accountLookUpEndpoint
      );
      if (response.isError) {
        setErrorMessage(copyFlyout.unknownError);
        setQuotes([]);
      } else {
        setQuotes(response);
      }
    } else {
      setIsAutocompleteOpen(false);
      setAutocompleteTitle(
        getDictionaryValueOrKey(newPurchaseFlyout?.resellerAccountNumber)
      );
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
        getDictionaryValueOrKey(copyFlyout.accountDoesntExistError)
      );
      return;
    }

    const quoteExists = await checkQuoteExitsforReseller(
      newInput.accountNumber ?? accountNumber,
      newPurchaseFlyoutConfig?.data?.agreementNumber,
      copyFlyout.checkQuoteExitsforResellerEndpoint
    );

    if (!selectedQuote) {
      setEnableCopy(!quoteExists);
    }

    if (quoteExists) {
      setIsTyping(false);
      setErrorMessage(copyFlyout.quoteExistsError);
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
    setAutocompleteTitle(
      getDictionaryValueOrKey(newPurchaseFlyout?.resellerAccountNumber)
    );
    setErrorMessage('');
  };
  const handleCopy = async () => {
    if (!enableCopy) {
      return;
    }

    setIsLoading(true);

    const response = await copyQuote(
      newPurchaseFlyoutConfig?.data?.source?.id,
      selectedQuote.accountNumber,
      accountNumber,
      copyFlyout.copyQuoteEndpoint
    );
    setIsLoading(false);
    resetGrid();
    closeFlyout();
  };

  const handleFocusIn = () => {
    setAutocompleteTitle(
      getDictionaryValueOrKey(newPurchaseFlyout?.resellerAccountNumber)
    );
  };

  const handleFocusOut = (event) => {
    const resellerId = event.target.value;
    if (resellerId?.length === 0) {
      setAutocompleteTitle(
        getDictionaryValueOrKey(newPurchaseFlyout?.resellerAccountNumber)
      );
    }
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length === 0) {
      setEndUserEmailError(
        getDictionaryValueOrKey(newPurchaseFlyout?.required)
      );
    } else if (!emailPattern.test(value) && value.length > 240) {
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
  const handleEndUserAdress1Change = (event) => {
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

  useEffect(() => {
    if (
      firstName?.length > 0 &&
      lastName?.length > 0 &&
      email?.length > 0 &&
      emailError?.length === 0 &&
      endUserCompanyName?.length > 0 &&
      endUserCompanyFirstName?.length > 0 &&
      endUserCompanyLastName?.length > 0 &&
      endUserEmail?.length > 0 &&
      endUserEmailError?.length === 0 &&
      endUserType?.length > 0 &&
      endUserAdress1?.length > 0 &&
      endUserCity?.length > 0 &&
      endUserAreaCode?.length > 0 &&
      endUserCountry?.length > 0
    ) {
      setEnableNext(true);
    } else {
      setEnableNext(false);
    }
  }, [
    firstName,
    lastName,
    email,
    emailError,
    endUserCompanyName,
    endUserCompanyFirstName,
    endUserCompanyLastName,
    endUserEmail,
    endUserEmailError,
    endUserType,
    endUserAdress1,
    endUserCity,
    endUserAreaCode,
    endUserCountry,
  ]);

  const handleNext = () => {};
  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={!enableNext} className="primary" onClick={handleNext}>
        {getDictionaryValueOrKey(newPurchaseFlyout?.next)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(newPurchaseFlyout?.cancel)}
      </button>
    </div>
  );
  return (
    <BaseFlyout
      open={newPurchaseFlyoutConfig?.show}
      onClose={closeFlyout}
      width="768px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(newPurchaseFlyout?.newPurchase)}
      secondaryButtonLabel={null}
      classText="share-flyout"
      isLoading={false}
      onClickButton={() => {}}
      buttonLabel={null}
      disabledButton={!enableNext}
      isShareFlyout={true}
      loadingButtonLabel={null}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content cmp-flyout-newPurchase">
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
            {internalUser && (
              <div>
                <Autocomplete
                  id="combo-box-demo"
                  open={isAutocompleteOpen}
                  freeSolo={true}
                  options={quotes}
                  filterOptions={filterOptions}
                  getOptionLabel={(option) =>
                    option.accountNumber ?? accountNumber
                  }
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
                        label={autocompleteTitle}
                        value={accountNumber}
                        variant="standard"
                        onChange={handleResellerIdChange}
                        onBlur={handleFocusOut}
                        onFocus={handleFocusIn}
                        placeholder={getDictionaryValueOrKey(
                          newPurchaseFlyout?.resellerAccountNumber
                        )}
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
                  <div className="cmp-flyout__content--error">
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
            <TextField
              className="cmp-flyout-newPurchase__form__input-container"
              id="first-name"
              label={getDictionaryValueOrKey(
                newPurchaseFlyout?.contactFirstName
              )}
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
              label={getDictionaryValueOrKey(
                newPurchaseFlyout?.contactLastName
              )}
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
            label={getDictionaryValueOrKey(
              newPurchaseFlyout?.endUserCompanyName
            )}
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
            error={!!endUserEmailError}
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
                {getDictionaryValueOrKey(
                  newPurchaseFlyout?.endUserTypeComercial
                )}
              </MenuItem>
              <MenuItem value="Education">
                {getDictionaryValueOrKey(
                  newPurchaseFlyout?.endUserTypeEducation
                )}
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
            value={endUserAdress1}
            onChange={handleEndUserAdress1Change}
            error={!!endUserAdress1Error}
            helperText={endUserAdress1Error}
            inputProps={{ maxLength: 40 }}
          />
          <TextField
            className="cmp-flyout-newPurchase__form__input-container"
            id="end-user-address-2"
            label={getDictionaryValueOrKey(newPurchaseFlyout?.endUserAdress2)}
            variant="standard"
            value={endUserAdress2}
            onChange={handleEndUserAddress2Change}
            error={!!endUserAdress2Error}
            helperText={endUserAdress2Error}
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
      </section>
    </BaseFlyout>
  );
}

export default NewPurchaseFlyout;
