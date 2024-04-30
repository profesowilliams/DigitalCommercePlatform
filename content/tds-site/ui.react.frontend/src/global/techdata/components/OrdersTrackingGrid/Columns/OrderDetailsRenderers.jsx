import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers({
  data,
  config,
  openFilePdf,
  rowsToGrayOutTDNameRef,
  newItem,
  onQueryChanged,
  totalCounter,
}) {
  const detailRender = useOrderTrackingStore(
    (state) => state.filter.detailRender
  );
  return (
    <>
      {detailRender === 'primary' && (
        <DropdownOrderDetails
          data={data}
          aemConfig={config}
          openFilePdf={openFilePdf}
          rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          newItem={newItem}
          onQueryChanged={onQueryChanged}
          totalCounter={totalCounter}
        />
      )}
    </>
  );
}

export default OrderDetailsRenderers;
