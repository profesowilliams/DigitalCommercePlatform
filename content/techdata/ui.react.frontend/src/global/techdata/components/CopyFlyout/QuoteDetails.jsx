import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export const QuoteDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { accountNumber, name, city } = quote;

  const AccountNumberWithHighlight = () => {
    return (
      <>
        <span
          className="cmp-renewals-copy-flyout__content-search__quote--highlighted"
        >
          {currentlyTypedWord}
        </span>
        <span>{accountNumber?.substring(currentlyTypedWord.length)}</span>
      </>
    );
  };
  return (
    <div className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote">
      {accountNumber && <>
        <div className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label-header">
          {labels &&
            getDictionaryValueOrKey(
              labels.selectedAccountLabel || 'Selected account'
            )}
        </div>
        <div className='cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__account-number'>
          {labels && (
            <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
              {getDictionaryValueOrKey(
                labels.accountNumberLabel || 'Account number:'
              )}
            </span>
          )}
          <AccountNumberWithHighlight />
        </div>
        <div className='cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__account-name'>
          {labels && (
            <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
              {getDictionaryValueOrKey(
                labels.accountNameLabel || 'Account name:'
              )}
            </span>
          )}
          {name}
        </div>
        <div className='cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__city'>
          {labels && (
            <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
              {getDictionaryValueOrKey(labels.cityLabel || 'City:')}
            </span>
          )}
          {city}
        </div>
      </>}
    </div>
  );
};
