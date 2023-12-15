import React from 'react';
import { AccessPermisionsNeededIcon } from './../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

const AccessPermissionsNeeded = ({ noAccessProps }) => {
  const { noAccessTitle, noAccessMessage, noAccessBack } = noAccessProps;
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
        <p className="access-permissions__link">
          <a href="https://intouch.staging.tdsynnex.eu/InTouch/MVC/MicroSite/Private?corpregionid=14&categorypageid=10612&msmenuid=11579">
            {getDictionaryValueOrKey(noAccessBack)}
          </a>
        </p>
      </div>
    </div>
  );
};
export default AccessPermissionsNeeded;
