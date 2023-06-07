import React from 'react';
import OrderFilterListItem from './OrderFilterListItem';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function OrderFilterList({ filtersRefs, filterLabels }) {
  const filterList = useOrderTrackingStore((state) => state.filterList);
  return filterList.map((x) => (
    <OrderFilterListItem
      key={x.id}
      id={x.id}
      open={x.open}
      accordionLabel={x.accordionLabel}
      filterField={x.filterField}
      group={x.group}
      filtersRefs={filtersRefs}
      filterOptionList={x?.filterOptionList}
      filterLabels={filterLabels}
    />
  ));
}
export default OrderFilterList;
