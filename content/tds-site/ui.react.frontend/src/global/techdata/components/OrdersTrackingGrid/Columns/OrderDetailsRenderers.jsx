import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers({
  data,
  config,
  openFilePdf,
  rowsToGrayOutTDNameRef,
  newItem,
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
        />
      )}
    </>
  );
}

export default OrderDetailsRenderers;
