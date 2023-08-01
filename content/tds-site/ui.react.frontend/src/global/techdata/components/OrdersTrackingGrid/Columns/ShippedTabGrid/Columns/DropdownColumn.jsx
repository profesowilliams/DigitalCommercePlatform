import React, { useEffect, useState, useMemo } from 'react';

function DropdownColumn({ eventProps }) {
  const [isToggled, setIsToggled] = useState(false);

  // removed unnecessary useEffect, state change will actually rerender the component
  // added useMemo for future optimization, when another state or props change will trigger a rerender with stale value of `isToggle`
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
