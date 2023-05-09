import React from 'react';

import { getDictionaryValueOrKey } from '../../../../../../utils/utils';

export const AddressDetails = ({ address, labels, currentlyTypedWord }) => {
  const { name, line1, postalCode } = address;
  const hasMatch = address?.name?.toLowerCase()?.startsWith(currentlyTypedWord.toLowerCase());

  
  return (
    <div className="cmp-flyout__quotecmp-flyout__selected-quote">
      {name && (
        <>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__account-number">
            {name}
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__account-name">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(
                  labels.accountNameLabel || 'Account name:'
                )}
              </span>
            )}
            {line1}
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__city">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(labels.cityLabel || 'City:')}
              </span>
            )}
            {postalCode}
          </div>
        </>
      )}
    </div>
  );
};
