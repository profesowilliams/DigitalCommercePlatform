import React from 'react';
import { If } from './../../../helpers/If';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderFilterItems = ({ itemKey, filtersRefs, filterLabels }) => {
  const filterList = useOrderTrackingStore((state) => state.filter.filterList);
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const orderStatusFilters = filterList.find(
    (filter) =>
      filter.accordionLabel ===
      getDictionaryValueOrKey(filterLabels.orderStatus)
  ).filterOptionList;
  const orderTypeFilters = filterList.find(
    (filter) =>
      filter.accordionLabel === getDictionaryValueOrKey(filterLabels.orderType)
  ).filterOptionList;
  const {
    setOrderTypeFiltersChecked,
    setOrderStatusFiltersChecked,
    setPredefinedFiltersSelectedAfter,
    setFilterClicked,
    setAreThereAnyFiltersSelectedButNotApplied,
  } = useOrderTrackingStore((state) => state.effects);

  const styleCheckbox = {
    color: '#262626',
    '&.Mui-checked': {
      color: '#005758',
      accentColor: '#005758',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  };

  const onChangeStatusFilter = (id) => {
    const newList = isStatusFilterChecked(id)
      ? orderStatusFiltersChecked.filter((status) => status.id !== id)
      : [
          ...orderStatusFiltersChecked,
          ...orderStatusFilters.filter((status) => status.id === id),
        ];
        filtersRefs.current.status = newList
          .map((element) => '&status=' + element.filterOptionKey)
          .join('');
    setOrderStatusFiltersChecked(newList);
    setPredefinedFiltersSelectedAfter([
      ...newList,
      ...orderTypeFiltersChecked,
      ...dateRangeFiltersChecked,
    ]);
    setFilterClicked(true);
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  const isStatusFilterChecked = (id) => {
    return orderStatusFiltersChecked.some((status) => status.id === id);
  };

  const onChangeTypeFilter = (id) => {
    const newList = isTypeFilterChecked(id)
      ? orderTypeFiltersChecked.filter((type) => type.id !== id)
      : [
          ...orderTypeFiltersChecked,
          ...orderTypeFilters.filter((type) => type.id === id),
        ];
    filtersRefs.current.type = newList
      .map((element) => '&type=' + element.filterOptionKey)
      .join('');
    setOrderTypeFiltersChecked(newList);
    setPredefinedFiltersSelectedAfter([
      ...orderStatusFiltersChecked,
      ...newList,
      ...dateRangeFiltersChecked,
    ]);
    setFilterClicked(true);
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  const isTypeFilterChecked = (id) => {
    return orderTypeFiltersChecked.some((type) => type.id === id);
  };

  return (
    <div className="check-order-wrapper">
      <If
        condition={
          itemKey === getDictionaryValueOrKey(filterLabels.orderStatus)
        }
      >
        <FormControl>
          {orderStatusFilters &&
            orderStatusFilters.map((status) => (
              <FormControlLabel
                key={status.id}
                control={
                  <Checkbox
                    sx={styleCheckbox}
                    checked={isStatusFilterChecked(status.id)}
                  />
                }
                label={status.filterOptionLabel}
                onChange={() => onChangeStatusFilter(status.id)}
              />
            ))}
        </FormControl>
      </If>
      <If
        condition={itemKey === getDictionaryValueOrKey(filterLabels.orderType)}
      >
        <FormControl>
          {orderTypeFilters &&
            orderTypeFilters.map((type) => (
              <FormControlLabel
                key={type.id}
                control={
                  <Checkbox
                    sx={styleCheckbox}
                    checked={isTypeFilterChecked(type.id)}
                  />
                }
                label={type.filterOptionLabel}
                onChange={() => onChangeTypeFilter(type.id)}
              />
            ))}
        </FormControl>
      </If>
    </div>
  );
};
export default OrderFilterItems;
