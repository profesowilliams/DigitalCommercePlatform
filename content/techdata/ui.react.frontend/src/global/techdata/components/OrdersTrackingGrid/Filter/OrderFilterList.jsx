import React from 'react';
import OrderFilterListItem from './OrderFilterListItem';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function OrderFilterList({filtersRefs}) {  
  const filterList = useOrderTrackingStore((state) => state.filterList);
  return filterList.map((x) => (
    <OrderFilterListItem key={x.id} id={x.id} open={x.open} title={x.title} field={x.field} filtersRefs={filtersRefs}/>
  ))
}
export default OrderFilterList;