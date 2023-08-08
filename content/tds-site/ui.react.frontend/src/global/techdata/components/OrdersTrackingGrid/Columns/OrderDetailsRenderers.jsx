import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import DropdownOrderDetails from './DropdownOrderDetails';

function OrderDetailsRenderers(props) {
  const detailRender = useOrderTrackingStore((state) => state.detailRender);

  return (
    <>
      {detailRender === 'primary' && (
        <DropdownOrderDetails data={props.data} aemConfig={props.config} />
      )}
    </>
  );
}

export default OrderDetailsRenderers;
