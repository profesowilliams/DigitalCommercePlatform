import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRightSmallIcon,
  ChevronDownSmallIcon,
} from '../../../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../../store/OrderTrackingStore';

function DropdownColumn({ eventProps }) {

  const [isToggled, setIsToggled] = useState(false);

  const mainGridRowsTotalCounter = useOrderTrackingStore(
    (state) => state.mainGridRowsTotalCounter
  );

  useEffect(() => {
    if (mainGridRowsTotalCounter === 1) {
      setIsToggled(true);
    }
  }, []);

  useMemo(() => eventProps?.node.setExpanded(isToggled), [isToggled]);
  const toggleDetails = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div
      className="cmp-order-tracking-grid__select-column"
      onClick={toggleDetails}
    >
      <div style={{ display: isToggled ? 'none' : 'block' }}>
        <ChevronRightSmallIcon />
      </div>
      <div style={{ display: isToggled ? 'block' : 'none' }}>
        <ChevronDownSmallIcon />
      </div>
    </div>
  );
}
export default DropdownColumn;
