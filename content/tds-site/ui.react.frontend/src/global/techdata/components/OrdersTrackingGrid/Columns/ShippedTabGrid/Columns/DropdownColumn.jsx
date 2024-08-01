import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRightSmallIcon,
  ChevronDownSmallIcon,
} from '../../../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * DropdownColumn component renders a dropdown icon in a grid column. It allows users to 
 * expand or collapse a row in the grid by toggling the state of the icon.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.eventProps - The properties passed from the parent component, 
 *                                    including the row node to control expansion.
 * @returns {JSX.Element} The rendered dropdown column component.
 */
function DropdownColumn({ eventProps }) {
  // State to track if the dropdown is toggled (expanded) or not
  const [isToggled, setIsToggled] = useState(false);

  // Fetch the total count of rows in the main grid from the order tracking store
  const mainGridRowsTotalCounter = useOrderTrackingStore(
    (state) => state.mainGridRowsTotalCounter
  );

  // Effect to auto-expand the dropdown if there is only one row in the main grid
  useEffect(() => {
    if (mainGridRowsTotalCounter === 1) {
      setIsToggled(true);
    }
  }, [mainGridRowsTotalCounter]);

  // Use memoization to set the expansion state of the row based on the toggled state
  useMemo(() => eventProps?.node.setExpanded(isToggled), [isToggled, eventProps?.node]);

  // Toggle the dropdown state when the icon is clicked
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