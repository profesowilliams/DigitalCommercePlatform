import React from 'react';
import { If } from './../../../helpers/If';
import './orderfilter.scss';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

const OrderFilterItems = ({ itemKey, filtersRefs }) => {
  const filterList = useOrderTrackingStore((state) => state.filterList);
  const orderStatusFilters = filterList.find(
    (filter) => filter.accordionLabel === 'Order Status'
  ).filterOptionList;
  const orderTypeFilters = filterList.find(
    (filter) => filter.accordionLabel === 'Order Type'
  ).filterOptionList;
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const effects = useOrderTrackingStore((state) => state.effects);
  //temporary until we haven't data from another source

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
      ? orderStatusFiltersChecked.filter((x) => x.id !== id)
      : [
          ...orderStatusFiltersChecked,
          ...orderStatusFilters.filter((x) => x.id === id),
        ];
    filtersRefs.status.current = newList.map((x) => x.filterOptionLabel).join();
    effects.setOrderStatusFiltersChecked(newList);
  };

  const isStatusFilterChecked = (id) => {
    return orderStatusFiltersChecked.some((x) => x.id === id);
  };

  const onChangeTypeFilter = (id) => {
    const newList = isTypeFilterChecked(id)
      ? orderTypeFiltersChecked.filter((x) => x.id !== id)
      : [
          ...orderTypeFiltersChecked,
          ...orderTypeFilters.filter((x) => x.id === id),
        ];
    filtersRefs.type.current = newList.map((x) => x.filterOptionLabel).join();
    effects.setOrderTypeFiltersChecked(newList);
  };

  const isTypeFilterChecked = (id) => {
    return orderTypeFiltersChecked.some((x) => x.id === id);
  };

  return (
    <div className="check-order-wrapper">
      <If condition={itemKey === 'Order Status'}>
        <FormControl>
          {orderStatusFilters &&
            orderStatusFilters.map((x) => (
              <FormControlLabel
                key={x.id}
                control={
                  <Checkbox
                    sx={styleCheckbox}
                    checked={isStatusFilterChecked(x.id)}
                  />
                }
                label={x.filterOptionKey}
                onChange={() => onChangeStatusFilter(x.id)}
              />
            ))}
        </FormControl>
      </If>
      <If condition={itemKey === 'Order Type'}>
        <FormControl>
          {orderTypeFilters &&
            orderTypeFilters.map((x) => (
              <FormControlLabel
                key={x.id}
                control={
                  <Checkbox
                    sx={styleCheckbox}
                    checked={isTypeFilterChecked(x.id)}
                  />
                }
                label={x.filterOptionKey}
                onChange={() => onChangeTypeFilter(x.id)}
              />
            ))}
        </FormControl>
      </If>
    </div>
  );
};
export default OrderFilterItems;
