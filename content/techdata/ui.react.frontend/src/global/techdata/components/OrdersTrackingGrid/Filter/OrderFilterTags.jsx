import React from 'react';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderFilterTag from './OrderFilterTag';

function OrderFilterTags({ filtersRefs }) {
  const {
    setOrderStatusFiltersChecked,
    setOrderTypeFiltersChecked,
    setDateRangeFiltersChecked,
    setCustomState,
    setCustomFiltersChecked,
  } = useOrderTrackingStore((state) => state.effects);
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.dateRangeFiltersChecked
  );
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.customFiltersChecked
  );
  const dateType = useOrderTrackingStore((state) => state.dateType);

  const handleFilterCloseClick = (id, group) => {
    if (group === 'status') {
      const newList = orderStatusFiltersChecked.filter((x) => x.id !== id);
      filtersRefs.status.current = newList.join();
      setOrderStatusFiltersChecked(newList);
    } else if (group === 'type') {
      const newList = orderTypeFiltersChecked.filter((x) => x.id !== id);
      filtersRefs.type.current = newList.join();
      setOrderTypeFiltersChecked(newList);
    } else if (group === 'date') {
      setDateRangeFiltersChecked([]);
      setCustomState({
        key: 'customStartDate',
        value: undefined,
      });
      setCustomState({
        key: 'customEndDate',
        value: undefined,
      });
      Object.keys(filtersRefs)
        .filter(
          (filter) =>
            filter !== 'type' &&
            filter !== 'status' &&
            filtersRefs[filter]?.current
        )
        .map((filter) => {
          filtersRefs[filter].current = undefined;
        });
    }
  };

  const handleCustomFilterCloseClick = (customFilterId, id) => {
    let newList = customFiltersChecked;
    newList.map((filter) => {
      filter.id === customFilterId &&
        filter.filterOptionList.map((element) => {
          element.id === id && (element.checked = false);
        });
    });
    setCustomFiltersChecked([...newList]);
  };

  const handleCustomDateFilterCloseClick = (filter) => {
    const clearDate = (customFilter) => {
      customFilter.startDate = null;
      customFilter.endDate = null;
      customFilter.dataRangeLabel = null;
    };
    let newList = customFiltersChecked;
    newList.map((_filter) => {
      _filter.id === filter.id && clearDate(_filter);
    });
    setCustomFiltersChecked([...newList]);
  };

  const getCustomFiltersFromCheckboxes = (filter) =>
    filter.filterOptionList.map(
      (element) =>
        element.checked && (
          <OrderFilterTag
            closeHandler={() =>
              handleCustomFilterCloseClick(filter.id, element.id)
            }
            value={element?.filterOptionLabel}
            id={element.id}
            key={element.id}
          />
        )
    );

  const getCustomFiltersFromSelectedDate = (filter) =>
    filter?.group === 'customDate' &&
    filter?.dataRangeLabel && (
      <OrderFilterTag
        closeHandler={() => handleCustomDateFilterCloseClick(filter)}
        value={filter?.dataRangeLabel}
        id={filter.id}
        key={filter.id}
      />
    );

  return (
    <div className={`order-filter-tags-container teal_scroll`}>
      {[
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ].map((filter) => (
        <OrderFilterTag
          closeHandler={() => handleFilterCloseClick(filter.id, filter?.group)}
          value={
            filter?.group === 'date'
              ? `${dateType} : ${filter.filterOptionLabel}`
              : filter.filterOptionLabel
          }
          id={filter.id}
          key={filter.id}
        />
      ))}

      {customFiltersChecked.map((filter) =>
        filter?.filterOptionList
          ? getCustomFiltersFromCheckboxes(filter)
          : getCustomFiltersFromSelectedDate(filter)
      )}
    </div>
  );
}
export default OrderFilterTags;
