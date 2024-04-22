import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { NoItemsToModifyIcon } from '../../../../../fluentIcons/FluentIcons';

const ErrorMessage = ({ labels, enableAddLine }) => {
  return (
    <div className="error-message">
      <NoItemsToModifyIcon />
      <span className="error-message__title">
        {getDictionaryValueOrKey(labels?.sorry)}
      </span>
      <span>
        {getDictionaryValueOrKey(
          enableAddLine
            ? labels?.thereAreNoItemsAddNew
            : labels?.thereAreNoItems
        )}
      </span>
    </div>
  );
};

export default ErrorMessage;
