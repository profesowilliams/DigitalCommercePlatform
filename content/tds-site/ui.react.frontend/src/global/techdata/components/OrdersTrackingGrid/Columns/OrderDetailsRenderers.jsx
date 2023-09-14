import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers(props) {
  const detailRender = useOrderTrackingStore((state) => state.detailRender);
  return (
    <>
      {detailRender === 'primary' && (
        <DropdownOrderDetails
          data={props.data}
          aemConfig={props.config}
          openFilePdf={props.openFilePdf}
          hasAIORights={props.hasAIORights}
          hasOrderModificationRights={props.hasOrderModificationRights}
          setDetailsApiResponse={props.setDetailsApiResponse}
          gridRef={props.gridRef}
          rowToGrayOutTDNameRef={props.rowToGrayOutTDNameRef}
        />
      )}
    </>
  );
}

export default OrderDetailsRenderers;
