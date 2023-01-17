import React from 'react';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import OrderExport from './Export/OrderExport';
import OrderFilter from './Filter/OrderFilter';
import OrderSearch from './Search/OrderSearch';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import { setDefaultSearchDateRange } from './utils/orderTrackingUtils';

function OrdersTrackingGrid(props) {
  const componentProp = JSON.parse(props.componentProp);
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };
  const defaultSearchDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );

  return (
    <div className='cmp-order-tracking-grid'>
      <BaseGridHeader
        leftComponents={[
          <div className='cmp-order-tracking-grid__open-orders'>
            <input type="checkbox" id='cmp-order-tracking-select-orders' />
            <label htmlFor="cmp-order-tracking-select-orders">Open orders</label>
          </div>
        ]}
        rightComponents={[
          <OrderSearch /> ,
          <VerticalSeparator />,
          <OrderFilter />,
          <VerticalSeparator />,
          <OrderExport />,
        ]}
      />
      <BaseGrid
        columnList={componentProp.columnList}
        definitions={ordersTrackingDefinition()}
        config={gridConfig}
        gridConfig={gridConfig}
        defaultSearchDateRange={defaultSearchDateRange}
      />
    </div>
  );
}

export default OrdersTrackingGrid;
