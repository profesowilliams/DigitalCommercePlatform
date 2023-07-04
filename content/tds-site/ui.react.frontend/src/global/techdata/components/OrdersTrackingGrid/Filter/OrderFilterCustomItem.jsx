import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const OrderFilterCustomItem = ({
  filterOptionList,
  customFilterId,
  filtersRefs,
}) => {
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.customFiltersChecked
  );
  const { setCustomFiltersChecked, setCustomizedFiltersSelectedAfter } =
    useOrderTrackingStore((state) => state.effects);

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

  const isCustomFilterChecked = (id) => {
    return customFiltersChecked
      .find((filter) => filter.id === customFilterId)
      .filterOptionList.find((element) => element.id === id).checked;
  };

  const onChangeCustomFilter = (id) => {
    let newList = customFiltersChecked;
    newList.map((filter) => {
      filter.id === customFilterId
        ? filter.filterOptionList.map((element) => {
            element.id === id ? (element.checked = !element.checked) : element;
          })
        : filter;
    });
    filtersRefs.customFilterRef.current = newList;
    setCustomFiltersChecked([...newList]);
    setCustomizedFiltersSelectedAfter(structuredClone(newList));
  };

  return (
    <div className="check-order-wrapper">
      <FormControl>
        {filterOptionList &&
          filterOptionList.map((optionFilter) => (
            <FormControlLabel
              key={optionFilter.id}
              control={
                <Checkbox
                  sx={styleCheckbox}
                  checked={isCustomFilterChecked(optionFilter.id)}
                />
              }
              label={optionFilter.filterOptionLabel}
              onChange={() => onChangeCustomFilter(optionFilter.id)}
            />
          ))}
      </FormControl>
    </div>
  );
};
export default OrderFilterCustomItem;
