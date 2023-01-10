import React from 'react';
import BaseGrid from '../BaseGrid/BaseGrid';
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
  const defaultSearchDateRange = setDefaultSearchDateRange(componentProp?.defaultSearchDateRange);

  return (
    <BaseGrid
      columnList={componentProp.columnList}
      definitions={ordersTrackingDefinition()}
      config={gridConfig} 
      gridConfig={gridConfig}
      defaultSearchDateRange={defaultSearchDateRange}
    />
  );
}

export default OrdersTrackingGrid;
