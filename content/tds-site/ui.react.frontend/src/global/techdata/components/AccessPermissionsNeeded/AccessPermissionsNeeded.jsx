import React from 'react';
import { AccessPermisionsNeededIcon } from './../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

const AccessPermissionsNeeded = ({ noAccessProps }) => {
  const { noAccessTitle, noAccessMessage, noAccessBack } = noAccessProps;
  return (
    <div className="access-permissions_wrapper">
      <div className="access-permissions_div">
        <AccessPermisionsNeededIcon />
        <h2 className="access-permissions_header">
          {getDictionaryValueOrKey(noAccessTitle)}
        </h2>
        <h5 className="access-permissions_content">
          {getDictionaryValueOrKey(noAccessMessage)}
          <br />
          <p>
            <a href="https://intouch.staging.tdsynnex.eu/InTouch/MVC/MicroSite/Private?corpregionid=14&categorypageid=10612&msmenuid=11579">
              {getDictionaryValueOrKey(noAccessBack)}
            </a>
          </p>
        </h5>
      </div>
    </div>
  );
};
export default AccessPermissionsNeeded;
