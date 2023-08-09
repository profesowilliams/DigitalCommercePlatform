import React from 'react';
import { useOrderTrackingStore } from '../../../store/OrderTrackingStore';
import DropdownOrderShippedTabGridDetails from './DropdownOrderShippedTabGridDetails';
function ShippedTabGridRenderers(props) {
  const detailRender = useOrderTrackingStore((state) => state.detailRender);
  return (
    <>
      {detailRender === 'primary' && (
        <DropdownOrderShippedTabGridDetails
          data={props.data}
          aemConfig={props.config}
        />
      )}
    </>
  );
}
export default ShippedTabGridRenderers;
