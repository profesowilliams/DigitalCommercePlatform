import React from 'react';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderFilterTag from './OrderFilterTag';
import { filtersDateGroup } from '../utils/gridUtils';

function OrderFilterTags({ filtersRefs, filterDateOptions }) {
  const {
    setOrderStatusFiltersChecked,
    setOrderTypeFiltersChecked,
    setDateRangeFiltersChecked,
    setCustomState,
    setPredefinedFiltersSelectedAfter,
    setCustomizedFiltersSelectedAfter,
    setFilterClicked,
    setAreThereAnyFiltersSelectedButNotApplied,
    setCurrentStartDate,
    setCurrentEndDate,
  } = useOrderTrackingStore((state) => state.effects);
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.customFiltersChecked
  );
  const dateType = useOrderTrackingStore((state) => state.filter.dateType);

  const handleFilterCloseClick = (id, group) => {
    if (group === 'status') {
      const newList = orderStatusFiltersChecked.filter((x) => x.id !== id);
      filtersRefs.current.status = newList
        .map((element) => '&status=' + element.filterOptionKey)
        .join('');
      setOrderStatusFiltersChecked(newList);
      setFilterClicked(true);
      setAreThereAnyFiltersSelectedButNotApplied();
      setPredefinedFiltersSelectedAfter([
        ...newList,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ]);
    } else if (group === 'type') {
      const newList = orderTypeFiltersChecked.filter((x) => x.id !== id);
      filtersRefs.current.type = newList
        .map((element) => '&type=' + element.filterOptionKey)
        .join('');
      setOrderTypeFiltersChecked(newList);
      setFilterClicked(true);
      setAreThereAnyFiltersSelectedButNotApplied();
      setPredefinedFiltersSelectedAfter([
        ...orderStatusFiltersChecked,
        ...newList,
        ...dateRangeFiltersChecked,
      ]);
    } else if (group === 'date') {
      setDateRangeFiltersChecked([]);
      setPredefinedFiltersSelectedAfter([
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ]);
      setCustomState({
        key: 'customStartDate',
        value: undefined,
      });
      setCustomState({
        key: 'customEndDate',
        value: undefined,
      });
      setFilterClicked(true);
      setAreThereAnyFiltersSelectedButNotApplied();
      filtersDateGroup.map(
        (filter) => (filtersRefs.current[filter] = undefined)
      );
      setCurrentStartDate(null);
      setCurrentEndDate(null);
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
    setAreThereAnyFiltersSelectedButNotApplied();
    setCustomizedFiltersSelectedAfter(structuredClone(newList));
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
    setAreThereAnyFiltersSelectedButNotApplied();
    setCustomizedFiltersSelectedAfter(structuredClone(newList));
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
  const dateTypeKeyName = filterDateOptions.find(
    (option) => option.key === dateType
  )?.label?.props?.children;
  const dateTypeLabel = dateType
    ? dateTypeKeyName[0]?.props?.children[0] || dateTypeKeyName
    : '';

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
              ? `${dateTypeLabel}: ${filter.filterOptionLabel}`
              : filter.filterOptionLabel
          }
          id={filter.id}
          key={`${filter.id}${filter?.group}`}
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
