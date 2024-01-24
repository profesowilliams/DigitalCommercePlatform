import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers({
  data,
  config,
  openFilePdf,
  hasAIORights,
  hasOrderModificationRights,
  gridRef,
  rowsToGrayOutTDNameRef,
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
          hasAIORights={hasAIORights}
          hasOrderModificationRights={hasOrderModificationRights}
          gridRef={gridRef}
          rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        />
      )}
    </>
  );
}

export default OrderDetailsRenderers;
