import React from 'react';
import OrderFilterListItem from './OrderFilterListItem';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function OrderFilterList({ filtersRefs, filterLabels, filterDateOptions }) {
  const filterList = useOrderTrackingStore((state) => state.filter.filterList);
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
      filterDateOptions={filterDateOptions}
    />
  ));
}
export default OrderFilterList;
