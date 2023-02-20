import React, { useState, useEffect } from 'react';
import {
  DismissFilledIcon,
  LoaderIcon,
  SearchIcon,
  WarningIcon,
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { QuoteDetails } from './QuoteDetails';
import { checkQuoteExitsforReseller, copyQuote, resellerLookUp } from './api';

function CopyFlyout({ store, copyFlyout, subheaderReference, resetGrid }) {
  const copyFlyoutConfig = store((st) => st.copyFlyout);
  const effects = store((st) => st.effects);
  const [accountNumber, setAccountNumber] = useState('');
  const [autocompleteTitle, setAutocompleteTitle] = useState(
    getDictionaryValueOrKey(
      copyFlyout.searchPlaceholder
    )
  );
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    const resellerId = event.target.value;
    setAccountNumber(resellerId);

    if (resellerId.length >= 3) {
      const response = await resellerLookUp(
        resellerId,
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
  };

  const handleQuoteSelectedChange = async (event, newInput) => {
    const quoteExists = await checkQuoteExitsforReseller(
      newInput.accountNumber,
      copyFlyoutConfig?.data.agreementNumber,
      copyFlyout.checkQuoteExitsforResellerEndpoint
    );

    if(!selectedQuote) {
      setEnableCopy(!quoteExists);
    }

    if (quoteExists) {
      setErrorMessage(copyFlyout.quoteExistsError);
    }
    else {
      setQuotes([]);
      setErrorMessage('');
      setAccountNumber('');
      setSelectedQuote(newInput);
    }
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

    if (response.isError && response.code === 408) {
      setErrorMessage(getDictionaryValueOrKey(copyFlyout.timeoutError));
    }
    else if(response.isError) {
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
      getDictionaryValueOrKey(copyFlyout.searchLabel)
    );
  };

  const handleFocusOut = () => {
    if (accountNumber.length === 0) {
      setAutocompleteTitle(
        getDictionaryValueOrKey(
          copyFlyout.searchPlaceholder
        )
      );
    }
  };

  return (
    <BaseFlyout
      open={copyFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
    >
      <div className="cmp-renewals-copy-flyout">
        <section className="cmp-renewals-copy-flyout__header">
          <h4 className="cmp-renewals-copy-flyout__header-title">
            {getDictionaryValueOrKey(copyFlyout.title || 'Copy')}
          </h4>
          <div
            className="cmp-renewals-copy-flyout__header-icon"
            onClick={closeFlyout}
          >
            <DismissFilledIcon width="30" height="30" />
          </div>
        </section>
        <section className="cmp-renewals-copy-flyout__content">
          <div className="cmp-renewals-copy-flyout__content-description">
            {getDictionaryValueOrKey(copyFlyout.description)}
          </div>
          <div className="cmp-renewals-copy-flyout__content-search">
            <Autocomplete
              id="combo-box-demo"
              freeSolo={true}
              options={quotes}
              getOptionLabel={(option) => option.accountNumber ?? accountNumber}
              onChange={handleQuoteSelectedChange}
              value={selectedQuote}
              renderOption={(props, option) => {
                return (
                  <li {...props}>
                    <div>
                      <div className="cmp-renewals-copy-flyout-autocomplete__option-name">
                        <QuoteDetails
                          quote={option}
                          currentlyTypedWord={accountNumber}
                        />
                      </div>
                    </div>
                  </li>
                );
              }}
              renderInput={(params) => (
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
                    copyFlyout.searchPlaceholder
                  )}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <div className="cmp-autocomplete__button-section">
                        <Button
                          className="cmp-button__autocomplete-search"
                          variant="standard"
                        >
                          <SearchIcon />
                        </Button>
                      </div>
                    ),
                  }}
                />
              )}
            />
            {errorMessage && <div className="cmp-renewals-copy-flyout__content--error">
              {errorMessage}
            </div>}
            {selectedQuote && (
              <>
                <QuoteDetails quote={selectedQuote} labels={copyFlyout} />
              </>
            )}

          </div>
        </section>
        <section className="cmp-renewals-copy-flyout__footer">
          {selectedQuote && (
            <div className="cmp-renewals-copy-flyout__footer__warning__container">
              <WarningIcon />
              <div className="cmp-renewals-copy-flyout__footer__warning__content">
                {copyFlyout.permissionsWarning}
              </div>
            </div>
          )}
          <button
            className={`cmp-renewals-copy-flyout__footer-button ${enableCopy ? 'cmp-renewals-copy-flyout__footer-button--enabled' : ''}`}
            enabled={!enableCopy}
            onClick={handleCopy}
          >
            {!isLoading && getDictionaryValueOrKey(copyFlyout.button || 'Copy')} {isLoading && <LoaderIcon />}
          </button>
        </section>
      </div>
    </BaseFlyout>
  );
}

export default CopyFlyout;
