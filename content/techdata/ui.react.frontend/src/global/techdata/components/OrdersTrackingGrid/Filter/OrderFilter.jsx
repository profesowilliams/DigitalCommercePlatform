import React, { useState, useRef } from 'react';
import {
  OptionsIcon,
  OptionsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderFilterModal from './OrderFilterModal';
import OrderCount from './OrderCount';

function OrderFilter({ aemData, onQueryChanged, filtersRefs }) {
  const isFilterModalOpen = useOrderTrackingStore((st) => st.isFilterModalOpen);
  const effects = useOrderTrackingStore((st) => st.effects);
  const orderFilterCounter = useOrderTrackingStore( state => state.orderFilterCounter);
  const topReference = useRef();
  const { toggleFilterModal } = effects;
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
        onClick={toggleFilterModal}
      >
        {isFilterHovered ? (
          <OptionsIconFilled fill="#262626" className="icon-hover" />
        ) : (
          <OptionsIcon fill="#262626" className="icon-hover" />
        )}
        {orderFilterCounter > 0 && <OrderCount>{orderFilterCounter}</OrderCount>}
      </div>
      {isFilterModalOpen && (
        <OrderFilterModal
          onQueryChanged={onQueryChanged}
          topReference={topReference}
          filtersRefs={filtersRefs}
        />
      )}
    </>
  );
}
export default OrderFilter;