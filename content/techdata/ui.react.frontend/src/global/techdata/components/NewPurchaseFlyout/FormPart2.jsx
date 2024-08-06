import React, { useState, useEffect, useCallback } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import {
  AutoCompleteSearchIcon,
  WarningTriangleIcon,
  ProhibitedIcon,
  BannerInfoIcon,
  CloseXButtonIcon,
} from '../../../../fluentIcons/FluentIcons';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete, Button, TextField } from '@mui/material';
import { vendorPartNoLookUp, addProductToGrid } from './api';
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
  newPurchaseFlyout,
  formPart1States,
  pickedResellerQuote,
  internalUser,
  currency,
  defaultCurrency,
  setCurrency,
  subtotalValue,
  setSubtotalValue,
  validating,
  setValidating,
  setPlaceOrderActive,
  buttonClicked,
  setButtonClicked,
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

  // Banned state
  const [bannerOpen, setBannerOpen] = useState(true);
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
  const [dataTable, setDataTable] = useState([]);

  // Add Product to Grid
  const [items, setItems] = useState([]);

  const resellerId = pickedResellerQuote?.accountNumber;
  const handleAddProductToGrid = async () => {
    setErrorMessage('');
    setBannerOpen(false);

    const itemsChecked = items && Array.isArray(items) ? items : [];
    const itemsPayload = itemsChecked?.map((item) => item);
    const addProductPayload = {
      reseller: {
        id: resellerId || '',
      },
      endUser: {
        name: endUserCompanyName,
        contact: {
          name: `${endUserCompanyFirstName} ${endUserCompanyLastName}`,
          email: endUserEmail,
        },
        address: {
          line1: endUserAddress1,
          line2: endUserAddress2,
          city: endUserCity,
          postalCode: endUserAreaCode,
          country: endUserCountry,
        },
      },
      items: [
        ...itemsPayload,
        {
          id: '1',
          product: [
            {
              type: 'MANUFACTURER',
              id: manufacturerPartNumber,
            },
          ],
          quantity: '1',
          contract: {
            startDate: startDate,
            endDate: pickedEndDate,
          },
        },
      ],
    };

    try {
      const response = await addProductToGrid(
        newPurchaseFlyout?.addNewProductEndpoint,
        addProductPayload
      );
      if (response?.isError) {
        setErrorMessage(newPurchaseFlyout?.unknownError);
      } else {
        setDataTable(response);
      }
    } catch (error) {
      setErrorMessage(newPurchaseFlyout?.unknownError);
    } finally {
      setValidating(false);
      setButtonClicked(false);
    }
  };

  // Validation banner
  const hasFeedBackMessages = dataTable?.feedBackMessages?.length > 0;
  const errorCriticality = hasFeedBackMessages
    ? dataTable?.feedBackMessages[0]?.errorCriticality
    : 4;
  const bannerErrorMessage = hasFeedBackMessages
    ? dataTable?.feedBackMessages[0]?.message
    : '';
  const blueBanner = errorCriticality === 3;
  const orangeBanner = errorCriticality === 2;
  const redBanner = errorCriticality === 1;
  const noBanner = errorCriticality === 4 || bannerErrorMessage === null;

  const handleCloseBanner = () => {
    setBannerOpen(false);
  };

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
        setErrorMessage(newPurchaseFlyout?.unknownError);
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
        getDictionaryValueOrKey(newPurchaseFlyout?.accountDoesntExistError)
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
    handleAddProductToGrid();
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

  useEffect(() => {
    setItems(dataTable?.items);
  }, [dataTable]);

  // Calculate subtotal price
  const calculateSubtotal = useCallback(() => {
    const subtotal = items?.reduce((sum, item) => {
      return sum + parseFloat(item.totalPrice || '0');
    }, 0);
    setSubtotalValue(subtotal?.toFixed(2));
  }, [items, setSubtotalValue]);

  useEffect(() => {
    calculateSubtotal();
  }, [items, calculateSubtotal]);

  useEffect(() => {
    if (blueBanner) {
      setPlaceOrderActive(true);
    } else {
      setPlaceOrderActive(false);
    }
    if (validating) {
      setPlaceOrderActive(false);
    }
  }, [blueBanner, validating]);
  useEffect(() => {
    if (buttonClicked) {
      handleAddProductToGrid();
      setValidating(true);
      setBannerOpen(true);
    }
  }, [buttonClicked]);

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
        {bannerOpen &&
          dataTable?.feedBackMessages &&
          dataTable?.feedBackMessages.length > 0 &&
          errorCriticality &&
          !noBanner &&
          (redBanner || orangeBanner || blueBanner) &&
          bannerErrorMessage && (
            <div
              className={
                blueBanner
                  ? 'cmp-flyout-newPurchase__form-feedback-banner blue-banner'
                  : orangeBanner
                  ? 'cmp-flyout-newPurchase__form-feedback-banner orange-banner'
                  : redBanner
                  ? 'cmp-flyout-newPurchase__form-feedback-banner red-banner'
                  : 'cmp-flyout-newPurchase__form-feedback-banner'
              }
            >
              <p>
                {blueBanner ? (
                  <BannerInfoIcon />
                ) : orangeBanner ? (
                  <WarningTriangleIcon />
                ) : redBanner ? (
                  <ProhibitedIcon />
                ) : (
                  ''
                )}
                {bannerErrorMessage}
              </p>
              <div
                className={'banner-close-button'}
                onClick={handleCloseBanner}
              >
                <CloseXButtonIcon />
              </div>
            </div>
          )}
        <NewPurchaseTable
          data={dataTable}
          config={newPurchaseFlyout}
          currency={currency}
          setCurrency={setCurrency}
          defaultCurrency={defaultCurrency}
          subtotalValue={subtotalValue}
          setItems={setItems}
          handleAddProductToGrid={handleAddProductToGrid}
          setPlaceOrderActive={setPlaceOrderActive}
        />
      </div>
    </>
  );
}

export default FormPart2;
