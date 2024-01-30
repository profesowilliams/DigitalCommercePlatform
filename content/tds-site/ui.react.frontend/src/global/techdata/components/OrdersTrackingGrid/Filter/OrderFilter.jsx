import React, { useState } from 'react';
import {
  OptionsIcon,
  OptionsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderCountClear from './OrderCountClear';

function OrderFilter({ onQueryChanged }) {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.filter.orderFilterCounter
  );
  const { toggleFilterModal, setFilterClicked } = useOrderTrackingStore(
    (st) => st.effects
  );
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const handleMouseOverFilter = () => {
    setIsFilterHovered(true);
  };
  const handleMouseLeaveFilter = () => {
    setIsFilterHovered(false);
  };

  return (
    <>
      <div
        className="cmp-order-tracking-grid__filter"
        onMouseOver={handleMouseOverFilter}
        onMouseLeave={handleMouseLeaveFilter}
        onClick={() => {
          toggleFilterModal();
          setFilterClicked(false);
        }}
      >
        {isFilterHovered ? (
          <OptionsIconFilled fill="#262626" className="icon-hover" />
        ) : (
          <OptionsIcon fill="#262626" className="icon-hover" />
        )}
      </div>
      {orderFilterCounter > 0 && (
        <OrderCountClear onQueryChanged={onQueryChanged}>
          {orderFilterCounter}
        </OrderCountClear>
      )}
    </>
  );
}
export default OrderFilter;
