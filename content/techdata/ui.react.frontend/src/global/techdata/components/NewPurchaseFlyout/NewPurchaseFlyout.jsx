import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { ArrowBackIcon } from '../../../../fluentIcons/FluentIcons';
import FormPart1 from './FormPart1';
import FormPart2 from './FormPart2';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';

function NewPurchaseFlyout({
  store,
  copyFlyout,
  newPurchaseFlyout,
  subheaderReference,
  userData,
  componentProp,
  activeStep = 1,
  isAddMore = false,
  data,
  onQueryChanged,
  detailsEndUserType,
}) {
  const effects = store((state) => state.effects);
  const { pathname, search } = window.location;
  const internalUser = userData?.isHouseAccount;
  const defaultCurrency = userData?.activeCustomer?.defaultCurrency;
  const externalUser = !internalUser;

  const newPurchaseFlyoutConfig = store((state) => state.newPurchaseFlyout);
  const closeFlyout = () => {
    effects.setCustomState({
      key: 'newPurchaseFlyout',
      value: {
        show: false,
      },
    });
    window.history.replaceState(null, '', pathname + search);
  };
  const [placeOrderFlyoutOpen, setPlaceOrderFlyoutOpen] = useState(false);
  const closePlaceOrderFlyout = () => {
    setPlaceOrderFlyoutOpen(false);
  };

  // View flyout content step

  const [step, setStep] = useState(activeStep); // Track the current view (1 or 2)

  // Enable next button
  const [enableNext, setEnableNext] = useState(false);

  // Reseller state
  const [quotes, setQuotes] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
  const [endUserAddress1, setEndUserAddress1] = useState('');
  const [endUserAddress1Error, setEndUserAddress1Error] = useState('');

  // End User Address 2 state
  const [endUserAddress2, setEndUserAddress2] = useState('');
  const [endUserAddress2Error, setEndUserAddress2Error] = useState('');

  // End User City state
  const [endUserCity, setEndUserCity] = useState('');
  const [endUserCityError, setEndUserCityError] = useState('');

  // End User Area Code state
  const [endUserAreaCode, setEndUserAreaCode] = useState('');
  const [endUserAreaCodeError, setEndUserAreaCodeError] = useState('');

  // End User Country state
  const [endUserCountry, setEndUserCountry] = useState('');
  const [endUserCountryError, setEndUserCountryError] = useState('');

  // Currency and total price state
  const [subtotalValue, setSubtotalValue] = useState('111');
  const [currency, setCurrency] = useState('');

  // Buttons state
  const [validating, setValidating] = useState(false);
  const [placeOrderActive, setPlaceOrderActive] = useState(false);
  const [payloadWithoutNewItem, setPayloadWithoutNewItem] = useState(false);

  // Banned state
  const [bannerOpen, setBannerOpen] = useState(true);

  const formPart1States = {
    enableNext,
    setEnableNext,
    quotes,
    setQuotes,
    accountNumber,
    setAccountNumber,
    isAutocompleteOpen,
    setIsAutocompleteOpen,
    selectedQuote,
    setSelectedQuote,
    enableCopy,
    setEnableCopy,
    errorMessage,
    setErrorMessage,
    isLoading,
    setIsLoading,
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
  };
  const handleValidate = () => {
    setBannerOpen(false);
    setPayloadWithoutNewItem((prevState) => !prevState);
    setValidating(true);
  };

  const handlePlaceOrder = () => {
    setPlaceOrderFlyoutOpen(true);
  };
  const handleNext = () => {
    setStep(2);
  };
  const handleBack = () => {
    setStep(1);
  };
  const buttonsSectionStep1 = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={!enableNext} className="primary" onClick={handleNext}>
        {getDictionaryValueOrKey(newPurchaseFlyout?.next)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(newPurchaseFlyout?.cancel)}
      </button>
    </div>
  );

  const buttonsSectionStep2 = (
    <div className="cmp-flyout__footer-buttons order-modification">
      {!placeOrderActive ? (
        validating ? (
          <Button
            startIcon={
              <CircularProgress
                size={20}
                sx={{ color: '#888B8D', fontSize: '16px' }}
              />
            }
            sx={{
              textTransform: 'none',
            }}
            disabled={true}
            className="primary"
            onClick={handleValidate}
          >
            {getDictionaryValueOrKey(newPurchaseFlyout?.validating)}
          </Button>
        ) : (
          <button className="primary" onClick={handleValidate}>
            {getDictionaryValueOrKey(newPurchaseFlyout?.validateOrder)}
          </button>
        )
      ) : (
        <button className="primary" onClick={handlePlaceOrder}>
          {getDictionaryValueOrKey(newPurchaseFlyout?.placeOrder)}
        </button>
      )}

      {isAddMore ? (
        <button className="secondary" onClick={closeFlyout}>
          {getDictionaryValueOrKey(newPurchaseFlyout?.cancel)}
        </button>
      ) : (
        <button className="secondary" onClick={handleBack}>
          <ArrowBackIcon />
          {getDictionaryValueOrKey(newPurchaseFlyout?.back)}
        </button>
      )}
    </div>
  );

  const buttonSection = () => {
    if (step === 1) {
      return buttonsSectionStep1;
    } else if (step === 2) {
      return buttonsSectionStep2;
    }
  };

  const ResellerSubtotal = (classNameSuffix) => {
    return (
      <div className="new-purchase-footer-info">
        <span className="new-purchase-footer-info__title">
          {getDictionaryValueOrKey(
            newPurchaseFlyout?.resellerSubtotal
          )?.replace(
            '{currency-code}',
            currency ? currency : defaultCurrency || ''
          )}{' '}
          {subtotalValue}
        </span>
        <span>
          {getDictionaryValueOrKey(newPurchaseFlyout?.taxesNotIncluded)}
        </span>
      </div>
    );
  };

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

      setEndUserAddress2('');
      setEndUserAddress2Error('');

      setEndUserCity('');
      setEndUserCityError('');

      setEndUserAreaCode('');
      setEndUserAreaCodeError('');

      setEndUserCountry('');
      setEndUserCountryError('');
    } else {
      if (externalUser && !isAddMore) {
        setAccountNumber(userData?.activeCustomer?.customerNumber || '');
        setFirstName(userData?.firstName || '');
        setLastName(userData?.lastName || '');
        setEmail(userData?.email || '');
      }
    }
  }, [newPurchaseFlyoutConfig?.show]);

  useEffect(() => {
    const isCommonFieldsValid =
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
      endUserAddress1?.length > 0 &&
      endUserCity?.length > 0 &&
      endUserAreaCode?.length > 0 &&
      endUserCountry?.length > 0;

    const isInternalUserValid = internalUser
      ? selectedQuote?.accountNumber?.length > 0 &&
        !isAutocompleteOpen &&
        errorMessage?.length === 0
      : true;

    if (isCommonFieldsValid && isInternalUserValid) {
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
    endUserAddress1,
    endUserCity,
    endUserAreaCode,
    endUserCountry,
    errorMessage,
    isAutocompleteOpen,
    selectedQuote,
    internalUser,
  ]);

  return (
    <BaseFlyout
      open={newPurchaseFlyoutConfig?.show}
      onClose={closeFlyout}
      width="948px"
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
      buttonsSection={buttonSection()}
      bottomContent={
        step === 2
          ? (classNameSuffix) => ResellerSubtotal({ classNameSuffix })
          : null
      }
    >
      <section className="cmp-flyout__content cmp-flyout-newPurchase">
        {step === 1 && (
          <FormPart1
            copyFlyout={copyFlyout}
            newPurchaseFlyout={newPurchaseFlyout}
            newPurchaseFlyoutConfig={newPurchaseFlyoutConfig}
            formPart1States={formPart1States}
            internalUser={internalUser}
          />
        )}{' '}
        {step === 2 && (
          <div>
            <FormPart2
              userData={userData}
              externalUser={externalUser}
              newPurchaseFlyout={newPurchaseFlyout}
              formPart1States={formPart1States}
              pickedResellerQuote={selectedQuote}
              currency={currency}
              defaultCurrency={defaultCurrency}
              setCurrency={setCurrency}
              subtotalValue={subtotalValue}
              setSubtotalValue={setSubtotalValue}
              validating={validating}
              setValidating={setValidating}
              setPlaceOrderActive={setPlaceOrderActive}
              payloadWithoutNewItem={payloadWithoutNewItem}
              setPayloadWithoutNewItem={setPayloadWithoutNewItem}
              bannerOpen={bannerOpen}
              setBannerOpen={setBannerOpen}
              onClose={closePlaceOrderFlyout}
              open={placeOrderFlyoutOpen}
              bottomContent={
                step === 2
                  ? (classNameSuffix) => ResellerSubtotal({ classNameSuffix })
                  : null
              }
              isAddMore={isAddMore}
              data={data}
              store={store}
              closeFlyout={closeFlyout}
              onQueryChanged={onQueryChanged}
              detailsEndUserType={detailsEndUserType}
            />
          </div>
        )}
      </section>
    </BaseFlyout>
  );
}

export default NewPurchaseFlyout;
