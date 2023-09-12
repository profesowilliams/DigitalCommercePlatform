import React, { useState, useMemo } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from '../../../../../../../fluentIcons/FluentIcons';
function DropdownColumn({ eventProps }) {
  const [isToggled, setIsToggled] = useState(false);

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
        <ChevronRightIcon />
      </div>
      <div style={{ display: isToggled ? 'block' : 'none' }}>
        <ChevronDownIcon />
      </div>
    </div>
  );
}
export default DropdownColumn;
