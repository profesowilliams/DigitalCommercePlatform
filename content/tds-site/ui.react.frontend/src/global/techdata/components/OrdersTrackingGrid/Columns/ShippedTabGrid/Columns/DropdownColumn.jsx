import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRightSmallIcon,
  ChevronDownSmallIcon,
} from '../../../../../../../fluentIcons/FluentIcons';
function DropdownColumn({ eventProps, dataLength }) {

  const [isToggled, setIsToggled] = useState(false);
  useEffect(() => {
    if (dataLength === 1) {
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
