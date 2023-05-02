import React from 'react';
import { AccessPermisionsNeededIcon } from './../../../../fluentIcons/FluentIcons';

const AccessPermissionsNeeded = () => (
  <div className="access-permissions_wrapper">
    <div className="access-permissions_div">
      <AccessPermisionsNeededIcon />
      <h2 className="access-permissions_header">Access permissions needed</h2>
      <h5 className="access-permissions_content">
        {`Looks like your credentials don’t include this area.  
If you feel this is a mistake, please contact your administrator to request a change.`}
        <br/>
        Go back
      </h5>
    </div>
  </div>
);
export default AccessPermissionsNeeded;
