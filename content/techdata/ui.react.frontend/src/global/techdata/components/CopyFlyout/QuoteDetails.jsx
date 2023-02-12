import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export const QuoteDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { accountNumber, accountName, city } = quote;

  const AccountNumberWithHighlight = () => {
    const wordToHighlight = accountNumber?.split(currentlyTypedWord);
    if (wordToHighlight?.length === 1) {
      return <span>{accountNumber}</span>;
    }
    return (
      <>
        <span
          className="cmp-renewals-copy-flyout__content-search__quote--highlighted"
        >
          {currentlyTypedWord}
        </span>
        <span>{wordToHighlight[1]}</span>
      </>
    );
  };
  return (
    <div className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote">
      <div className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
        {labels &&
          getDictionaryValueOrKey(
            labels.selectedAccountLabel || 'Selected account'
          )}
      </div>
      <div>
        {labels && (
          <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
            {getDictionaryValueOrKey(
              labels.accountNumberLabel || 'Account number:'
            )}
          </span>
        )}
        <AccountNumberWithHighlight />
      </div>
      <div>
        {labels && (
          <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
            {getDictionaryValueOrKey(
              labels.accountNameLabel || 'Account name:'
            )}
          </span>
        )}
        {accountName}
      </div>
      <div>
        {labels && (
          <span className="cmp-renewals__quotecmp-renewals-copy-flyout__selected-quote__label">
            {getDictionaryValueOrKey(labels.cityLabel || 'City:')}
          </span>
        )}
        {city}
      </div>
    </div>
  );
};
