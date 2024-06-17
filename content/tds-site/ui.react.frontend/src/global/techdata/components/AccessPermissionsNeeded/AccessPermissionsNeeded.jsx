import React from 'react';
import { AccessPermisionsNeededIcon } from './../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

const AccessPermissionsNeeded = ({ noAccessProps }) => {
  const { noAccessTitle, noAccessMessage, noAccessBack, noAccessLink } =
    noAccessProps;
  return (
    <div className="access-permissions__wrapper">
      <AccessPermisionsNeededIcon />
      <h2 className="access-permissions__header">
        {getDictionaryValueOrKey(noAccessTitle)}
      </h2>
      <div className="access-permissions__content">
        <p className="access-permissions__message">
          {getDictionaryValueOrKey(noAccessMessage)}
        </p>
      </div>
    </div>
  );
};
export default AccessPermissionsNeeded;
