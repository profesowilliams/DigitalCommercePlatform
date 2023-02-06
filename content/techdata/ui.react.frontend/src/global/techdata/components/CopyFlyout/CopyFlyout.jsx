import React, { useState } from 'react';
import {
  DismissFilledIcon,
  SearchIcon,
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { get, post } from '../../../../utils/api';
import { Autocomplete, Button, TextField } from '@mui/material';
import Toaster from '../Widgets/Toaster';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValue } from '../../../../utils/utils';

const resellerLookUp = async (resellerId, endpoint) => {
  const response = await get(
    endpoint.replace('{reseller-id}', resellerId)
  );
  return response.data.content;
};

const checkQuoteExitsforReseller = async (
  resellerId,
  agreementNo,
  endpoint
) => {
  const response = await get(
    endpoint.replace('{reseller-id}', resellerId).replace('{agreement-number}', agreementNo)
  );
  return response.data.content;
};

const copyQuote = async (quoteId, resellerId, endpoint) => {
  const response = await post(
    endpoint.replace('{quote-id}', quoteId).replace('{reseller-id}', resellerId)
  );
  return response.data.content;
};

const QuoteDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { accountNumber, accountName, city } = quote;

  const AccountNumberWithHighlight = () => {
    const wordToHighlight = accountNumber.split(currentlyTypedWord);
    if (wordToHighlight.length === 1) {
      return <span>{accountNumber}</span>;
    }
    return (
      <>
        <span style={{ backgroundColor: 'yellow' }}>{currentlyTypedWord}</span>
        <span>{wordToHighlight[1]}</span>
      </>
    );
  };
  return (
    <div>
      <div>
        {/*Selected account */}
        {labels && (
          <span>
            {getDictionaryValue(
              labels.selectedAccountLabel,
              labels.selectedAccountLabel || 'Selected account'
            )}
          </span>
        )}
      </div>
      <div>
        {labels && (
          <span>
            {getDictionaryValue(
              labels.accountNumberLabel,
              labels.accountNumberLabel || 'Account number:'
            )}
          </span>
        )}
        <AccountNumberWithHighlight />
      </div>
      <div>
        {labels && (
          <span>
            {getDictionaryValue(
              labels.accountNameLabel,
              labels.accountNameLabel || 'Account name:'
            )}
          </span>
        )}
        {accountName}
      </div>
      <div>
        {labels && (
          <span>
            {getDictionaryValue(labels.cityLabel, labels.cityLabel || 'City:')}
          </span>
        )}
        {city}
      </div>
    </div>
  );
};

function CopyFlyout({ store, copyFlyout, subheaderReference }) {
  const showCopyFlyout = store((st) => st.showCopyFlyout);
  const effects = store((st) => st.effects);
  const [accountNumber, setAccountNumber] = useState('');
  const [autocompleteTitle, setAutocompleteTitle] = useState(
    getDictionaryValue(
      copyFlyout.searchPlaceholder,
      copyFlyout.searchPlaceholder
    )
  );
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [enableCopy, setEnableCopy] = useState(false);
  const closeFlyout = () => effects.setCustomState({ key: 'showCopyFlyout', value: false });

  const handleResellerIdChange = async (event) => {
    const resellerId = event.target.value;
    setAccountNumber(resellerId);

    if (resellerId.length >= 3) {
      const response = await resellerLookUp(
        resellerId,
        copyFlyout.accountLookUpEndpoint
      );
      setQuotes(response);
    }
  };

  const handleQuoteSelectedChange = async (event, newInput) => {
    setSelectedQuote(newInput);
    const response = await checkQuoteExitsforReseller(
      newInput.resellerId,
      newInput.agreementNo,
      copyFlyout.checkQuoteExitsforResellerEndpoint
    );
    setEnableCopy(!response.quoteExists);
  };

  const handleCopy = async () => {
    const response = await copyQuote(
      selectedQuote.quoteId,
      selectedQuote.resellerId,
      copyFlyout.copyQuoteEndpoint
    );
    closeFlyout();
    const toaster = {
      isOpen: true,
      origin: 'fromUpdate',
      isAutoClose: false,
      isSuccess: true,
      message: getDictionaryValue(
        copyFlyout.copySuccessMessage,
        copyFlyout.copySuccessMessage
      ),
    };
    const toaster1 = {
      isOpen: true,
      origin: 'fromUpdate',
      isAutoClose: false,
      isSuccess: false,
      title: 'errorTitle',
      message: getDictionaryValue(
        copyFlyout.copyFailureMessage,
        copyFlyout.copyFailureMessage
      ),
    };
    effects.setCustomState({ key: 'toaster', value: { ...toaster1 } });
  };

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const handleFocusIn = () => {
    setAutocompleteTitle(
      getDictionaryValue(copyFlyout.searchLabel, copyFlyout.searchLabel)
    );
  };

  const handleFocusOut = () => {
    if (resellerId.length === 0) {
      setAutocompleteTitle(
        getDictionaryValue(
          copyFlyout.searchPlaceholder,
          copyFlyout.searchPlaceholder
        )
      );
    }
  };

  return (
    <BaseFlyout
      open={showCopyFlyout}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
    >
      <div className="cmp-renewals-copy-flyout">
        <section className="cmp-renewals-copy-flyout__header">
          <h4 className="cmp-renewals-copy-flyout__header-title">
            {getDictionaryValue(copyFlyout.title, copyFlyout.title || 'Copy')}
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
            {getDictionaryValue(copyFlyout.description, copyFlyout.description)}
          </div>
          <div className="cmp-renewals-copy-flyout__content-search">
            <Autocomplete
              id="combo-box-demo"
              freeSolo={true}
              options={quotes}
              getOptionLabel={(option) => option.accountNumber}
              onChange={handleQuoteSelectedChange}
              value={selectedQuote}
              renderOption={(props, option) => {
                return (
                  <li {...props}>
                    <div>
                      <div className="cmp-autocomplete__option-name">
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
                  label={autocompleteTitle}
                  variant="standard"
                  onChange={handleResellerIdChange}
                  onBlur={handleFocusOut}
                  onFocus={handleFocusIn}
                  placeholder={getDictionaryValue(
                    copyFlyout.searchPlaceholder,
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
            {selectedQuote && (
              <QuoteDetails quote={selectedQuote} labels={copyFlyout} />
            )}

            <div>
              <Toaster
                onClose={onCloseToaster}
                store={(state) => ({
                  isOpen: false,
                  Child: <div>manu</div>,
                  isSuccess: true,
                  origin: 'fromUpdate',
                  title: 'YAY!',
                  message: 'manu1',
                  isAutoClose: false,
                })}
                message={'manu'}
                MuiDrawerProps={{
                  variant: 'persistent',
                }}
              />
            </div>
          </div>
        </section>
        <section className="cmp-renewals-copy-flyout__footer">
          <button
            className="cmp-renewals-copy-flyout__footer-cancel--enabled"
            enabled={!enableCopy}
            onClick={handleCopy}
          >
            {getDictionaryValue(copyFlyout.button, copyFlyout.button || 'Copy')}
          </button>
        </section>
      </div>
    </BaseFlyout>
  );
}

export default CopyFlyout;
