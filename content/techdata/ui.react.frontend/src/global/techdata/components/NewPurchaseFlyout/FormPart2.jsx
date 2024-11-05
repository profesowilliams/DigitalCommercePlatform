import React, { useState, useEffect, useCallback } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getModifiedResellerData, getModifiedEndUserData } from './utils';
import { callServiceWrapper } from '../../../../utils/api';

import {
  AutoCompleteSearchIcon,
  WarningTriangleIcon,
  ProhibitedIcon,
  BannerInfoIcon,
  CloseXButtonIcon,
  LoaderIcon,
} from '../../../../fluentIcons/FluentIcons';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete, Button, TextField } from '@mui/material';
import { vendorPartNoLookUp, addProductToGrid } from './api';
import { VendorPartNoDetails } from './VendorPartNoDetails';
import NewPurchaseTable from './NewPurchaseTable';
import DatePicker from './Datepicker';
import moment from 'moment';
import PlaceOrderDialog from './PlaceOrderDialog';

function FormPart2({
  userData,
  externalUser,
  newPurchaseFlyout,
  getStatusEndpoint,
  formPart1States,
  pickedResellerQuote,
  currency,
  defaultCurrency,
  setCurrency,
  subtotalValue,
  setSubtotalValue,
  setPlaceOrderDisable,
  validating,
  setValidating,
  setPlaceOrderActive,
  payloadWithoutNewItem,
  setPayloadWithoutNewItem,
  bannerOpen,
  setBannerOpen,
  isAddMore = false,
  data,
  onClose,
  open,
  bottomContent,
  store,
  closeFlyout,
  onQueryChanged,
  detailsEndUserType,
  buttonSection,
  setEnablePlaceOrder,
  getDetailsAPI,
}) {
  const {
    firstName,
    accountNumber,
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
  const [isLoading, setIsLoading] = useState(false);

  // Date
  const [datePickerOpen, setDatePickerOpen] = useState(true);
  const today = moment();
  const futureDate = moment(today).add(364, 'days');
  let defaultEndDate = futureDate.format('MM/DD/YYYY');

  if (isAddMore && data?.formattedExpiry) {
    const [day, month, year] = data?.formattedExpiry?.split('/');
    defaultEndDate = `${month}/${day}/${year}`;
  }
  const startDate = today.format('MM/DD/YYYY');
  const [pickedEndDate, setPickedEndDate] = useState(defaultEndDate);

  let durationDiff = '365';

  if (isAddMore) {
    const date1 = new Date(startDate);
    const date2 = new Date(defaultEndDate);

    const timeDiff = date2 - date1;

    durationDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }
  const [duration, setDuration] = useState(durationDiff);
  const durationDisplay = duration + 1;

  // Grid
  const { productId, manufacturerPartNumber, globalManufacturer } =
    selectedVendorPartNo || {};
  const [dataTable, setDataTable] = useState([]);
  const [vendorPartNo, setVendorPartNo] = useState(manufacturerPartNumber);
  const [vendorProductId, setVendorProductId] = useState(productId);
  // Add Product to Grid
  const [items, setItems] = useState([]);
  const [isFocusAutocompleteInput, setIsFocusAutocompleteInput] =
    useState(false);
  const resellerResponseAsObj =
    typeof data?.reseller?.vendorAccountNumber === 'object';
  const resellerData = resellerResponseAsObj
    ? getModifiedResellerData(resellerResponseAsObj, data?.reseller)
    : null;
  const endUserResponseAsObj =
    typeof data?.reseller?.vendorAccountNumber === 'object';
  const endUserData = endUserResponseAsObj
    ? getModifiedEndUserData(endUserResponseAsObj, data?.endUser)
    : null;

  const pickedEndDateFormatted = moment(pickedEndDate, 'MM/DD/YYYY').format(
    'YYYY-MM-DD[T]HH:mm:ss[Z]'
  );
  const pickedStartDateFormatted = moment(startDate, 'MM/DD/YYYY').format(
    'YYYY-MM-DD[T]HH:mm:ss[Z]'
  );

  const resellerId = externalUser
    ? accountNumber
    : pickedResellerQuote?.accountNumber;
  const resellerName = pickedResellerQuote?.name;

  const itemsChecked = items && Array.isArray(items) ? items : [];
  const itemsPayload = itemsChecked?.map((item) => {
    const originalDateFormatted = moment(
      dataTable?.items[0]?.contract?.endDate,
      'M/D/YYYY HH:mm:ss'
    ).format('YYYY-MM-DDTHH:mm:ss[Z]');

    return {
      ...item,
      contract: {
        ...item.contract,
        startDate: pickedStartDateFormatted,
        endDate: pickedEndDateFormatted,
        isContractDatesOverride:
          pickedEndDateFormatted !== originalDateFormatted,
      },
    };
  });

  const newItem = !payloadWithoutNewItem
    ? {
        id: '',
        product: [
          {
            type: 'TECHDATA',
            id: vendorProductId,
          },
          {
            type: 'MANUFACTURER',
            id: vendorPartNo,
          },
        ],
        quantity: '1',
        contract: {
          startDate: pickedStartDateFormatted,
          endDate: pickedEndDateFormatted,
        },
      }
    : null;

  // Assuming itemsPayload is an array where you are adding newItem
  const existingItems = [...itemsPayload, newItem];

  // Filter out null values from the array
  const filteredItemsPayload = existingItems.filter((item) => item !== null);

  const addProductPayload = isAddMore
    ? {
        reseller: {
          id: data?.reseller?.id || '',
        },
        ActiveLevel: data?.renewalLevelActive || '',
        endUser: {
          name: endUserData.nameUpper,
          contact: {
            name: `${endUserData?.contact?.name}`,
            email: endUserData?.contact?.email,
          },
          address: {
            line1: endUserData?.address?.line1,
            line2: endUserData?.address?.line2,
            city: endUserData?.address?.city,
            postalCode: endUserData?.address?.postalCode,
            country: endUserData?.address?.countryCode,
          },
        },

        items: filteredItemsPayload,
      }
    : {
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

        items: filteredItemsPayload,
      };

  const handleAddProductToGrid = async () => {
    setErrorMessage('');
    setBannerOpen(false);
    setPlaceOrderActive(false);

    const response = await callServiceWrapper(
      addProductToGrid,
      newPurchaseFlyout?.addNewProductEndpoint,
      addProductPayload,
    );

    processResponseAddProductToGrid(response);

    setValidating(false);
    setPayloadWithoutNewItem(false);
    setIsLoading(false);
  };


  const processResponseAddProductToGrid = (response) => {
      if (response.errors.length > 0) {
        setErrorMessage(response.errors[0].message);
        setPlaceOrderActive(false);
      } else {
        setDataTable(response.data);
      }
  };

  // Validation banner
  const hasFeedBackMessages = dataTable?.feedBackMessages?.length > 0;
  const emptyFeedBackMessages = dataTable?.feedBackMessages?.length === 0;
  const errorCriticality = hasFeedBackMessages
    ? dataTable?.feedBackMessages[0]?.errorCriticality
    : 4;
  const bannerErrorMessage = hasFeedBackMessages
    ? dataTable?.feedBackMessages[0]?.message
    : '';
  const errorCriticalityZero = errorCriticality === 0;
  const blueBanner = errorCriticality === 3;
  const orangeBanner = errorCriticality === 2;
  const redBanner = errorCriticality === 1;
  const noBanner = errorCriticality === 4 || bannerErrorMessage === null;

  const handleCloseBanner = () => {
    setBannerOpen(false);
  };

  // Search Vendor part No
  const checkIfResellerIdExist = (responseData, resellerId) => {
    const resellerIdStr = String(resellerId);

    return (
      responseData.length >= 3 &&
      responseData.find(({ manufacturerPartNumber }) =>
        manufacturerPartNumber.includes(resellerIdStr)
      ) !== undefined
    );
  };

  const checkVendorPartNoInList = (quote) => {
    return vendorPartNumbers.find((q) => q.productId === quote.productId);
  };

  const handleVendorPartNoChange = async (event) => {
    setIsTyping(true);
    setErrorMessage('');
    const resellerId = event.target.value;
    setVendorNumber(resellerId);

    if (resellerId?.length >= 3) {
      setIsAutocompleteOpen(true);
      setIsLoading(true);

      const payload = {
        MaxParts: 25,
        GetDetails: 'true',
        PartialManufacturerPartNumber: resellerId,
        Properties: [
          {
            Id: 'EndUserType',
            Value: endUserType || detailsEndUserType,
          },
          {
            Id: 'Vendor',
            Value: 'ADOBE',
          },
        ],
      };

      const response = await callServiceWrapper(
        vendorPartNoLookUp,
        newPurchaseFlyout?.vendorPartNoLookUpEndpoint,
        payload
      );

      processResponseVendorPartNoLookUp(response, resellerId);

    } else {
      setIsAutocompleteOpen(false);
      setVendorPartNumbers([]);
    }
    setIsLoading(false);
  };

  const processResponseVendorPartNoLookUp = (response, resellerId) => {
    if (response.errors.length > 0) {
      setErrorMessage(getDictionaryValueOrKey(newPurchaseFlyout?.unknownErrorNewPurchase));
      setVendorPartNumbers([]);
    } else {
      setVendorPartNumbers(response.data);

      const resellerIdExist =
        checkIfResellerIdExist(response.data, resellerId) === true;

      if (!resellerIdExist) {
        setErrorMessage(getDictionaryValueOrKey(newPurchaseFlyout?.productNotFound));
      }
    }
  };

  const findSelectedVendorPartNo = async (newInput) => {
    if (!newInput) {
      return;
    }

    if (!checkVendorPartNoInList(newInput)) {
      setErrorMessage(
        getDictionaryValueOrKey(newPurchaseFlyout?.productNotFound)
      );
      return;
    }

    if(selectedVendorPartNo && selectedVendorPartNo.productId === newInput.productId) {
        setIsLoading(false);
    }

    const vendorPartNoExists = vendorPartNumbers?.length > 0;

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

  const handleVendorSelectedChange = (event, newInput) => {
    setIsLoading(true);
    findSelectedVendorPartNo(newInput);
    setSelectedVendorPartNo(newInput);
    setErrorMessage('');
    setDatePickerOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      selectVendor();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleOnFocus = () => {
    setIsFocusAutocompleteInput(true);
  };

  const handleOnBlur = () => {
    setIsFocusAutocompleteInput(false);
  };

  const selectVendor = () => {
    const newInput = vendorPartNumbers.find(
      (vendorPart) => vendorPart.productId === vendorNumber
    );
    findSelectedVendorPartNo(newInput || vendorNumber);
  };

  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.productId} ${option.manufacturerPartNumber}`,
  });

  // Calculate subtotal price
  const calculateSubtotal = useCallback(() => {
    const subtotal = items?.reduce((sum, item) => {
      return sum + parseFloat(item.totalPrice || '0');
    }, 0);
    setSubtotalValue(subtotal?.toFixed(2));
    if (parseInt(subtotal) === 0) {
        setPlaceOrderDisable(true);
    } else {
        setPlaceOrderDisable(false);
    }
  }, [items, setSubtotalValue]);

  // Handl date picker open and close
  const handleDatePickerOpen = () => {
    setDatePickerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setItems(dataTable?.items);
  }, [dataTable]);

  useEffect(() => {
    calculateSubtotal();
  }, [items, calculateSubtotal]);

  useEffect(() => {
    if (
      payloadWithoutNewItem &&
      (blueBanner ||
        orangeBanner ||
        errorCriticalityZero ||
        emptyFeedBackMessages)
    ) {
      setPlaceOrderActive(true);
      setBannerOpen(true);
    } else {
      setPlaceOrderActive(false);
    }
    if (validating) {
      setPlaceOrderActive(false);
    }
  }, [blueBanner, validating]);

  useEffect(() => {
    if (parseInt(subtotalValue) === 0) {
        setPlaceOrderDisable(true);
    } else {
        setPlaceOrderDisable(false);
    }
  }, [subtotalValue]);

  // Trigger Validate request from useEffect
  useEffect(() => {
    if (manufacturerPartNumber) {
      setVendorPartNo(manufacturerPartNumber);
    }
    if (productId) {
      setVendorProductId(productId);
    }
  }, [manufacturerPartNumber, productId]);

  useEffect(() => {
    if (vendorPartNo?.length > 0 && pickedEndDate) {
      handleAddProductToGrid();
      setVendorPartNo('');
    }
  }, [vendorPartNo, pickedEndDate]);

  useEffect(() => {
    if (payloadWithoutNewItem) {
      handleAddProductToGrid();
    }
  }, [payloadWithoutNewItem]);

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
              {isAddMore ? resellerData?.name : pickedResellerQuote?.name}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore ? resellerData?.id : resellerId}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? resellerData?.contact?.nameIsDisplay
                  ? resellerData?.contact?.name
                  : ''
                : firstName}{' '}
              {isAddMore ? '' : lastName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? resellerData?.contact?.emailIsDisplay
                  ? resellerData?.contact?.email
                  : ''
                : email}
            </p>
          </div>
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserDetails)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore ? endUserData.nameUpper : endUserCompanyName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.contact?.nameIsDisplay
                  ? endUserData?.contact?.name
                  : ''
                : endUserCompanyFirstName}{' '}
              {isAddMore ? '' : endUserCompanyLastName}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.contact?.emailIsDisplay
                  ? endUserData?.contact?.email
                  : ''
                : endUserEmail}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.contact?.phoneIsDisplay
                  ? endUserData?.contact?.phone
                  : ''
                : ''}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore ? '' : endUserType}
            </p>
          </div>
          <div className="cmp-flyout-newPurchase__form-details__card-section">
            <p className="cmp-flyout-newPurchase__form-details__card-title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.endUserAddress)}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.address?.line1IsDisplay
                  ? endUserData?.address?.line1
                  : ''
                : endUserAddress1}
              {isAddMore && endUserData?.address?.line2
                ? endUserData?.address?.line2IsDisplay
                  ? `, ${endUserData?.address?.line2}`
                  : ''
                : `, ${endUserAddress2}`}
              {isAddMore && endUserData?.address?.line3
                ? endUserData?.address?.line3IsDisplay
                  ? `, ${endUserData?.address?.line3}`
                  : ''
                : ''}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.address?.cityIsDisplay
                  ? endUserData?.address?.city
                  : ''
                : endUserCity}
              ,{' '}
              {isAddMore
                ? endUserData?.address?.countryIsDisplay
                  ? endUserData?.address?.country
                  : ''
                : endUserCountry}
            </p>
            <p className="cmp-flyout-newPurchase__form-details__card-text">
              {isAddMore
                ? endUserData?.address?.postalCodeIsDisplay
                  ? endUserData?.address?.postalCode
                  : ''
                : endUserAreaCode}
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
            options={vendorPartNumbers || []}
            filterOptions={filterOptions}
            getOptionLabel={(option) => {
              return option?.manufacturerPartNumber ?? vendorNumber;
            }}
            onChange={handleVendorSelectedChange}
            value={selectedVendorPartNo}
            onKeyDown={handleKeyDown}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option?.productId}>
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
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <div className="cmp-autocomplete__button-section">
                        <Button
                          className="cmp-button__autocomplete-search"
                          variant="standard"
                          onClick={selectVendor}
                        >
                        {!isLoading ? (
                              isFocusAutocompleteInput ? (
                                <AutoCompleteSearchIcon className="autocomplete-search-icon-brandgreen" />
                              ) : (
                                <AutoCompleteSearchIcon />
                              )
                            ) : (
                              <LoaderIcon className="loadingIcon-search-rotate" />
                            )
                        }
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
          {datePickerOpen && (
            <div>
              <span className="cmp-flyout-newPurchase__form-date__title cmp-flyout-newPurchase__form-date__title-start_date">
                Start date
              </span>
              <span className="cmp-flyout-newPurchase__form-date__title cmp-flyout-newPurchase__form-date__title-end_date">
                End date
              </span>
              <DatePicker
                store={store}
                isOpen={datePickerOpen}
                startDate={startDate}
                endDate={defaultEndDate}
                setPickedEndDate={setPickedEndDate}
                setDuration={setDuration}
                setBannerOpen={setBannerOpen}
                setPlaceOrderActive={setPlaceOrderActive}
                readOnly={isAddMore}
              />
            </div>
          )}

          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.duration)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {durationDisplay}{' '}
              {getDictionaryValueOrKey(newPurchaseFlyout?.days)}
            </span>
          </div>
          <div className="cmp-flyout-newPurchase__form-date__display-column--wide">
            <span className="cmp-flyout-newPurchase__form-date__title">
              {getDictionaryValueOrKey(newPurchaseFlyout?.licensePriceLevel)}
            </span>
            <span className="cmp-flyout-newPurchase__form-date__text">
              {dataTable?.renewalLevel || '-'}
            </span>
          </div>
        </div>
        {bannerOpen &&
          dataTable?.feedBackMessages &&
          dataTable?.feedBackMessages?.length > 0 &&
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
          setPlaceOrderActive={setPlaceOrderActive}
          setPayloadWithoutNewItem={setPayloadWithoutNewItem}
          setBannerOpen={setBannerOpen}
        />
        <PlaceOrderDialog
          userData={userData}
          externalUser={externalUser}
          detailsData={data}
          data={dataTable}
          addProductPayload={addProductPayload}
          itemsPayload={itemsPayload}
          config={newPurchaseFlyout}
          getStatusEndpoint={getStatusEndpoint}
          getDetailsAPI={getDetailsAPI}
          onClose={onClose}
          open={open}
          bottomContent={bottomContent}
          buttonSection={buttonSection}
          setEnablePlaceOrder={setEnablePlaceOrder}
          subtotalValue={subtotalValue}
          store={store}
          resellerId={resellerId}
          resellerName={resellerName}
          formPart1States={formPart1States}
          closeFlyout={closeFlyout}
          onQueryChanged={onQueryChanged}
          isAddMore={isAddMore}
          detailsEndUserType={detailsEndUserType}
        />
      </div>
    </>
  );
}

export default FormPart2;
