import React from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderCount from './OrderCount';
import OrderFilterDatePicker from './OrderFilterDatapicker';
import OrderFilterItems from './OrderFilterItems';

function OrderFilterListItem({ id, open, title, field, filtersRefs }) {
  const filterList = useOrderTrackingStore((state) => state.filterList);
  const { setFilterList } = useOrderTrackingStore((state) => state.effects);

  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.dateRangeFiltersChecked
  );
  const { computeClassName } = useComputeBranding(useOrderTrackingStore);

  if (!filterList) return null;

  const handleFilterClick = (id) => {
    const updateList = filterList.map((x) =>
      x.id === id ? { ...x, open: !x.open } : x
    );
    setFilterList(updateList);
  };

  const showCounter = (labelType) => {
    switch (labelType) {
      case 'Date Range':
        return dateRangeFiltersChecked.length;
      case 'Order Status':
        return orderStatusFiltersChecked.length;
      case 'Order Type':
        return orderTypeFiltersChecked.length;
      default:
        return 0;
    }
  };
  const counter = showCounter(title);

  const showField = (fieldType) => {
    switch (fieldType) {
      case 'date':
        return (
          <div className="datepicker-wrapper">
            <OrderFilterDatePicker filtersRefs={filtersRefs} />
          </div>
        );
      case 'order':
        return <OrderFilterItems itemKey={title} filtersRefs={filtersRefs} />;
      default:
        return <></>;
    }
  };
  const orderField = showField(field);

  return (
    <>
      <div
        className="filter-accordion__item"
        onClick={() => handleFilterClick(id)}
      >
        <div className="filter-accordion__item--group">
          <h3 className={`${open ? computeClassName('active') : ''}`}>
            {title}
          </h3>
          <OrderCount>{counter > 0 ? counter : ''}</OrderCount>
        </div>
      </div>
      {open && orderField}
    </>
  );
}
export default OrderFilterListItem;
