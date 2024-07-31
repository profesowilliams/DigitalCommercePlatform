import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers({
  data,
  config,
  openFilePdf,
  rowsToGrayOutTDNameRef,
  newItem,
  onQueryChanged,
}) {
  console.log('OrderDetailsRenderers::init');

  const mainGridRowsTotalCounter = useOrderTrackingStore(
    (state) => state.mainGridRowsTotalCounter
  );

  return (
    <>
      {(mainGridRowsTotalCounter === 1) && (
        <DropdownOrderDetails
          data={data}
          aemConfig={config}
          openFilePdf={openFilePdf}
          rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          newItem={newItem}
          onQueryChanged={onQueryChanged}
        />
      )}
    </>
  );
}

export default OrderDetailsRenderers;