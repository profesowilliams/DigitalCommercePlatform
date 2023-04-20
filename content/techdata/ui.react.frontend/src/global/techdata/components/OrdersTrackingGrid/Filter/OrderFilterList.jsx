import React from 'react';
import OrderFilterListItem from './OrderFilterListItem';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function OrderFilterList() {  
  const filterList = useOrderTrackingStore((state) => state.filterList);
  return filterList.map((x) => (
    <OrderFilterListItem key={x.id} id={x.id} open={x.open} title={x.title} field={x.field}/>
  ))
}
export default OrderFilterList;