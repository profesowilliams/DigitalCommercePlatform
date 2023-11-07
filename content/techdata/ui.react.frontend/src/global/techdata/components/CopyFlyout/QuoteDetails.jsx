import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export const QuoteDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { accountNumber, name, city } = quote;

  const isNumeric = (str) => {
    return /^[0-9]+$/.test(str);
  };

  const isAccountNumFlag = isNumeric(currentlyTypedWord);

  const AccountNumberWithHighlight = () => {
      if (!currentlyTypedWord) {
        return accountNumber;
      }

      let string = accountNumber.substr(0, accountNumber.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()));
      let endString = accountNumber.substr(
          accountNumber.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()) +
            currentlyTypedWord.length
    );
    let highlightedText = accountNumber.substr(
      accountNumber.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()),
      currentlyTypedWord.length
    );
    return (
    isAccountNumFlag ? (
      <>
        <span>{string}</span>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {highlightedText}
        </span>
        <span>{endString}</span>
      </>
      ) : accountNumber
    );
  };

  const AccountNameWithHighlight = () => {
    if (!currentlyTypedWord) {
      return name;
    }

    let string = name.substr(0, name.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()));
    let endString = name.substr(
        name.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()) +
          currentlyTypedWord.length
      );
      let highlightedText = name.substr(
        name.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()),
        currentlyTypedWord.length
      );
    return (
        !isAccountNumFlag ? (
      <>
        <span>{string}</span>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {highlightedText}
        </span>
        <span>{endString}</span>
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
