import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export const QuoteDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { accountNumber, name, city } = quote;

  const isNumeric = (str) => {
    return /^[0-9]+$/.test(str);
  };

  const isAccountNumFlag = isNumeric(currentlyTypedWord);

  const AccountNumberWithHighlight = () => {
    return (
    isAccountNumFlag ? (
      <>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {currentlyTypedWord}
        </span>
        <span>{accountNumber?.substring(currentlyTypedWord?.length)}</span>
      </>
      ) : accountNumber
    );
  };

  const AccountNameWithHighlight = () => {
    return (
        !isAccountNumFlag ? (
      <>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {currentlyTypedWord}
        </span>
        <span>{name?.substring(currentlyTypedWord?.length)}</span>
      </>
      ) : name
    );
  };

  return (
    <div className="cmp-flyout__quotecmp-flyout__selected-quote ">
      {accountNumber && (
        <>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__label-header">
            {labels &&
              getDictionaryValueOrKey(
                labels.selectedAccountLabel || 'Selected account'
              )}
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__account-number">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(
                  labels.accountNumberLabel || 'Account number:'
                )}
              </span>
            )}
            <AccountNumberWithHighlight />
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__account-name">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(
                  labels.accountNameLabel || 'Account name:'
                )}
              </span>
            )}
            <AccountNameWithHighlight/>
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__city">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(labels.cityLabel || 'City:')}
              </span>
            )}
            {city}
          </div>
        </>
      )}
    </div>
  );
};
