import React from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderCount from './OrderCount';
import OrderFilterDatePicker from './OrderFilterDatapicker';
import OrderFilterItems from './OrderFilterItems';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function OrderFilterListItem({
  id,
  open,
  accordionLabel,
  group,
  filtersRefs,
  filterLabels,
  filterDateOptions,
}) {
  const filterList = useOrderTrackingStore((state) => state.filter.filterList);
  const { setFilterList } = useOrderTrackingStore((state) => state.effects);

  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.customFiltersChecked
  );
  const { computeClassName } = useComputeBranding(useOrderTrackingStore);

  if (!filterList) return null;

  const handleFilterClick = (id) => {
    const updateList = filterList.map((x) =>
      x.id === id ? { ...x, open: !x.open } : x
    );
    setFilterList(updateList);
  };

  let customCounter = 0;
  const increaseCounter = (filter) => {
    filter?.filterOptionList
      ? filter.filterOptionList.map(
          (element) => element.checked && customCounter++
        )
      : filter?.dataRangeLabel && customCounter++;
  };

  const getCustomFilterCounter = () => {
    customFiltersChecked.map(
      (filter) => filter.id === id && increaseCounter(filter)
    );
    return customCounter;
  };

  const showCounter = (labelType) => {
    switch (labelType) {
      case getDictionaryValueOrKey(filterLabels.dateRange):
        return dateRangeFiltersChecked.length;
      case getDictionaryValueOrKey(filterLabels.orderStatus):
        return orderStatusFiltersChecked.length;
      case getDictionaryValueOrKey(filterLabels.orderType):
        return orderTypeFiltersChecked.length;
      default:
        return getCustomFilterCounter();
    }
  };
  const counter = showCounter(accordionLabel);

  const showField = (group) => {
    switch (group) {
      case 'date':
        return (
          <div className="datepicker-wrapper">
            <OrderFilterDatePicker
              filtersRefs={filtersRefs}
              filterLabels={filterLabels}
              filterDateOptions={filterDateOptions}
            />
          </div>
        );
      case 'order':
        return (
          <OrderFilterItems
            itemKey={accordionLabel}
            filtersRefs={filtersRefs}
            filterLabels={filterLabels}
          />
        );
      default:
        return <></>;
    }
  };
  const orderField = showField(group);

  return (
    <>
      <div
        className={`order-filter-accordion__item ${!open ? 'separator' : ''}`}
        onClick={() => handleFilterClick(id)}
      >
        <div className="order-filter-accordion__item--group">
          <h3 className={`${open ? computeClassName('active') : ''}`}>
            {accordionLabel}
          </h3>
          <OrderCount>{counter > 0 ? counter : ''}</OrderCount>
        </div>
      </div>
      {open && orderField}
    </>
  );
}
export default OrderFilterListItem;
