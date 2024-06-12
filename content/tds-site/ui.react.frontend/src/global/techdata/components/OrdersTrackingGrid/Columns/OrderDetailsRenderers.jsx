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
  const detailRender = useOrderTrackingStore(
    (state) => state.filter.detailRender
  );
  const mainGridRowsTotalCounter = useOrderTrackingStore(
    (state) => state.mainGridRowsTotalCounter
  );

  return (
    <>
      {(mainGridRowsTotalCounter === 1 || detailRender === 'primary') && (
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
