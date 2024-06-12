import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getExpandedLineAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
function SelectColumn({ eventProps, orderId, created }) {
  const [isToggled, setIsToggled] = useState(false);
  const mainGridRowsTotalCounter = useOrderTrackingStore(
    (state) => state.mainGridRowsTotalCounter
  );
  useEffect(()=>{
    if (mainGridRowsTotalCounter === 1 && eventProps?.rowIndex === 0) {
        setIsToggled(true);
    }
  }, [])
  // removed unnecessary useEffect, state change will actually rerender the component
  // added useMemo for future optimization, when another state or props change will trigger a rerender with stale value of `isToggle`
  useMemo(() => eventProps.node.setExpanded(isToggled), [isToggled]);

  const toggleDetails = () => {
    setIsToggled(!isToggled);
    pushDataLayerGoogle(getExpandedLineAnalyticsGoogle(orderId, created));
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
