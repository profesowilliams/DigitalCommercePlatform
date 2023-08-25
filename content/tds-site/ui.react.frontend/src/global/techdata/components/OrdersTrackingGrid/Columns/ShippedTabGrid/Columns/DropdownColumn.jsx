import React, { useState, useMemo } from 'react';
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
        <i className="fas fa-chevron-right"></i>
      </div>
      <div style={{ display: isToggled ? 'block' : 'none' }}>
        <i className="fas fa-chevron-down"></i>
      </div>
    </div>
  );
}
export default DropdownColumn;
