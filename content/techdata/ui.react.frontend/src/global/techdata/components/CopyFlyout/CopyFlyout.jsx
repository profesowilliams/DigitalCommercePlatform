import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  WarningIcon,
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { Autocomplete, Button, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { QuoteDetails } from './QuoteDetails';
import { checkQuoteExitsforReseller, copyQuote, resellerLookUp } from './api';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';

export function CopyFlyout({ store, copyFlyout, subheaderReference, resetGrid }) {
  const copyFlyoutConfig = store((st) => st.copyFlyout);
  const effects = store((st) => st.effects);
  const [autocompleteTitle, setAutocompleteTitle] = useState(
    getDictionaryValueOrKey(
      copyFlyout.searchPlaceholder
    )
  );
  const analyticsCategory = store((st) => st.analyticsCategory);
  let { source, reseller, vendor } = copyFlyoutConfig ?
    copyFlyoutConfig?.data :
    { source: undefined, reseller: undefined, vendor: undefined };
  let analyticsData = { analyticsCategory, source, reseller, vendor };
  let analyticsAction = copyFlyoutConfig?.data?.analyticsAction;

  const [quotes, setQuotes] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const closeFlyout = () => effects.setCustomState({ key: 'copyFlyout', value: {show:false} });

  useEffect(() => {
    if (!copyFlyoutConfig?.show) {
      setSelectedQuote(null);
      setAccountNumber('');
      setQuotes([]);
      setEnableCopy(false);
      setErrorMessage('');
    }
  }, [copyFlyoutConfig?.show]);

  const handleResellerIdChange = async (event) => {
    setIsTyping(true);
    const resellerId = event.target.value;
    setAccountNumber(resellerId);

    if (resellerId.length >= 3) {
      setIsAutocompleteOpen(true);
      setAutocompleteTitle(
        getDictionaryValueOrKey(copyFlyout.searchLabel)
      );
      const response = await resellerLookUp(
        encodeURIComponent(resellerId),
        copyFlyout.accountLookUpEndpoint
      );
      if (response.isError) {
        setErrorMessage(copyFlyout.unknownError);
        setQuotes([]);
      }
      else {
        setQuotes(response);
      }
    }
    else {
      setIsAutocompleteOpen(false);
      setAutocompleteTitle(
            getDictionaryValueOrKey(copyFlyout.resellerAccountLabel)
          );
    }
  };

  const checkQuoteInList = (quote) =>
    quotes.find((q) => q.accountNumber === quote.accountNumber);

  const findSelectedQuote = async (newInput) => {
    if(!newInput) {
      return;
    }

    if(!checkQuoteInList(newInput)) {
      setErrorMessage(getDictionaryValueOrKey(copyFlyout.accountDoesntExistError));
      return;
    }

    const quoteExists = await checkQuoteExitsforReseller(
      newInput.accountNumber ?? accountNumber,
      copyFlyoutConfig?.data.agreementNumber,
      copyFlyout.checkQuoteExitsforResellerEndpoint
    );

    if (!selectedQuote) {
      setEnableCopy(!quoteExists);
    }

    if (quoteExists) {
      setIsTyping(false);
      setErrorMessage(copyFlyout.quoteExistsError);
    }
    else {
      setAccountNumber('');
      setQuotes([]);
      setErrorMessage('');
      setSelectedQuote(newInput);
      setIsTyping(false);
    }
    setIsAutocompleteOpen(false);
  }

  const handleQuoteSelectedChange = (event, newInput) => {
    findSelectedQuote(newInput);
    setAutocompleteTitle(
        getDictionaryValueOrKey(copyFlyout.resellerAccountLabel)
      );
  };

  const handleCopy = async () => {
    if (!enableCopy) {
      return;
    }

    setIsLoading(true);

    const response = await copyQuote(
      copyFlyoutConfig?.data.source.id,
      selectedQuote.accountNumber,
      copyFlyout.copyQuoteEndpoint
    );
    setIsLoading(false);

    let toaster = null;

    if(response.isError) {
      toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: getDictionaryValueOrKey(
          copyFlyout.copyFailureMessage
        ),
      };
    }
    else {
      toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: true,
        message: getDictionaryValueOrKey(
          copyFlyout.copySuccessMessage
        ),
      };

      resetGrid && resetGrid();
    }

    if (toaster) {
      closeFlyout();
      effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    }
  };

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const handleFocusIn = () => {
    setAutocompleteTitle(
      getDictionaryValueOrKey(copyFlyout.resellerAccountLabel)
    );
  };

  const handleFocusOut = (event) => {
    const resellerId = event.target.value;
    if (resellerId?.length === 0) {
      setAutocompleteTitle(
        getDictionaryValueOrKey(
          copyFlyout.searchPlaceholder
        )
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
    const newInput = quotes.find((quote) => quote.accountNumber === accountNumber);
    findSelectedQuote(newInput || accountNumber);    
  };

  const WarningMessage = ({ classNameSuffix }) => {
    if (selectedQuote) {
      return (
        <div
          className={`cmp-flyout__footer__warning__container cmp-flyout__footer__warning__container__section-${classNameSuffix}`}
        >
          <WarningIcon />
          <div className="cmp-flyout__footer__warning__content">
            <p>{copyFlyout.permissionsWarning}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.accountNumber} ${option.name}`
  });

  return (
    <BaseFlyout
      open={copyFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={copyFlyout.title || 'Copy'}
      buttonLabel={copyFlyout.button || 'Copy'}
      isLoading={isLoading}
      disabledButton={!enableCopy}
      onClickButton={handleCopy}
      analyticsData={analyticsData}
      bottomContent={(classNameSuffix) => WarningMessage({ classNameSuffix })}
      analyticsCallback={getRowAnalytics.bind(null,
        analyticsData.analyticsCategory,
        analyticsAction ? analyticsAction : ANALYTIC_CONSTANTS.Grid.RowActions.Copy,
        analyticsData)}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(copyFlyout.description)}
        </div>
        <div className="cmp-flyout__content-search">
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
            if((selectedQuote || setErrorMessage)&& !isTyping){
              params.inputProps.value = "";
              setIsTyping(false);
            }
              return( <TextField
                {...params}
                error={!!errorMessage}
                label={autocompleteTitle}
                value={accountNumber }
                variant="standard"
                onChange={handleResellerIdChange}
                onBlur={handleFocusOut}
                onFocus={handleFocusIn}
                placeholder={getDictionaryValueOrKey(
                  copyFlyout.searchPlaceholder
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
                        <SearchIcon />
                      </Button>
                    </div>
                  ),
                }}
              />)
            } 
             
            }
          />
          {errorMessage && (
            <div className="cmp-flyout__content--error">{errorMessage}</div>
          )}
          {selectedQuote && (
            <>
              <QuoteDetails quote={selectedQuote} labels={copyFlyout} />
            </>
          )}
          <WarningMessage classNameSuffix="content" />
        </div>
      </section>
    </BaseFlyout>
  );
}

export default CopyFlyout;
