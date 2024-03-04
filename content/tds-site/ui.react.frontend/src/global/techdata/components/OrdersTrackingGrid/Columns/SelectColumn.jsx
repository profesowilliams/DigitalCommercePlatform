import React, { useState, useMemo } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getExpandedLineAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
function SelectColumn({ eventProps, orderId }) {
  const [isToggled, setIsToggled] = useState(false);

  // removed unnecessary useEffect, state change will actually rerender the component
  // added useMemo for future optimization, when another state or props change will trigger a rerender with stale value of `isToggle`
  useMemo(() => eventProps.node.setExpanded(isToggled), [isToggled]);

  const toggleDetails = () => {
    setIsToggled(!isToggled);
    pushDataLayerGoogle(getExpandedLineAnalyticsGoogle(orderId));
  };

  return (
    <div
      className="cmp-order-tracking-grid__select-column"
      onClick={toggleDetails}
    >
      <div style={{ display: isToggled ? 'none' : 'flex' }}>
        <ChevronRightIcon />
      </div>
      <div style={{ display: isToggled ? 'flex' : 'none' }}>
        <ChevronDownIcon />
      </div>
    </div>
  );
}

export default SelectColumn;
