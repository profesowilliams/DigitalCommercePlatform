import React, { useState } from 'react';
import {
  OptionsIcon,
  OptionsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderCountClear from './OrderCountClear';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
function OrderFilter({ clearFilters, gridConfig }) {
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
      <Tooltip
        title={getDictionaryValueOrKey(gridConfig?.filterTooltip)}
        placement="top"
        arrow
        disableInteractive={true}
      >
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
      </Tooltip>
      {orderFilterCounter > 0 && (
        <OrderCountClear clearFilters={clearFilters}>
          {orderFilterCounter}
        </OrderCountClear>
      )}
    </>
  );
}
export default OrderFilter;
