import React, { cloneElement } from 'react';

function BaseGridHeader({ leftComponents, rightComponents }) {
  return (
    <div className="cmp-renewals-subheader">
      <div className="cmp-renewals-subheader-left">
        {leftComponents?.length
          ? leftComponents.map((component, index) =>
              cloneElement(component, { key: index })
            )
          : null}
      </div>
      <div className="renewal-filters">
        {rightComponents?.length
          ? rightComponents.map((component, index) =>
              cloneElement(component, { key: index })
            )
          : null}
      </div>
    </div>
  );
}

export default BaseGridHeader;
