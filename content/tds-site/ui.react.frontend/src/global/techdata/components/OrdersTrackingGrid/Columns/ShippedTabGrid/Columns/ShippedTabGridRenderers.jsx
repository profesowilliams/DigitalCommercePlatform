import React from 'react';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';
import DropdownOrderShippedTabGridDetails from './DropdownOrderShippedTabGridDetails';

function ShippedTabGridRenderers(props) {

  const detailRender = useOrderTrackingStore(
    (state) => state.filter.detailRender
  );

 return (
   <>
     {detailRender === 'primary' && (
       <DropdownOrderShippedTabGridDetails
         data={props.data.items}
         aemConfig={props.config}
       />
     )}
   </>
 );
}

export default ShippedTabGridRenderers;