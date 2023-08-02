import React, { cloneElement } from 'react';

function BaseGridHeader({ leftComponents, rightComponents }) {
  return (
    <div className="cmp-base-grid-subheader">
      <div className="cmp-base-grid-subheader-left">
        {leftComponents?.length
          ? leftComponents.map((component, index) =>
              cloneElement(component, { key: index })
            )
          : null}
      </div>
      <div className="base-grid-filters">
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
