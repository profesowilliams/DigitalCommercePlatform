import React from 'react';
import {
  OptionsIcon,
  OptionsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderCountClear from './OrderCountClear';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Hover from '../../Hover/Hover';

function OrderFilter({ clearFilters, gridConfig, clearReports }) {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.filter.orderFilterCounter
  );
  const { setFilterClicked, setCustomState } = useOrderTrackingStore(
    (state) => state.effects
  );

  const triggerFiltersFlyout = () => {
    setCustomState({
      key: 'filtersFlyout',
      value: { show: true, clearReports },
    });
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
          onClick={() => {
            triggerFiltersFlyout();
            setFilterClicked(false);
          }}
        >
          <Hover
            onHover={
              <OptionsIconFilled fill="#262626" className="icon-hover" />
            }
          >
            <OptionsIcon fill="#262626" className="icon-hover" />
          </Hover>
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
