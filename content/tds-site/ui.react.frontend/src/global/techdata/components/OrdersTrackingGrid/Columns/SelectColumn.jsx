import React, { useEffect, useState, useMemo } from 'react'
import { Icon } from '@iconify/react';

function SelectColumn({data, eventProps}) {
  const [isToggled, setIsToggled] = useState(false);

  // removed unnecessary useEffect, state change will actually rerender the component
  // added useMemo for future optimization, when another state or props change will trigger a rerender with stale value of `isToggle`
  useMemo(() => eventProps.node.setExpanded(isToggled), [isToggled])

  const toggleDetails = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div
      className="cmp-order-tracking-grid__select-column"
      onClick={toggleDetails}
    >
      <div
        className="cmp-order-tracking-grid__select-column__caret"
        style={{ display: isToggled ? 'none' : 'block' }}
      >
        <i className="fas fa-chevron-right"></i>
      </div>
      <div
        className="cmp-order-tracking-grid__select-column__caret"
        style={{ display: isToggled ? 'block' : 'none' }}
      >
        <i className="fas fa-chevron-down"></i>
      </div>
    </div>
  );
}

export default SelectColumn