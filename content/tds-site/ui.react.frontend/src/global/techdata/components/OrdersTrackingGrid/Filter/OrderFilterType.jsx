import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderCount from './OrderCount';

/**
 * Functional component representing the type filter in the order filter feature
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function invoked when filter changes
 * @param {Object} props.initialFilter - Initial filter state
 * @param {React.Ref} ref - Reference object used to expose imperative methods
 */
const OrderFilterType = ({ onChange, initialFilter }, ref) => {
  console.log('OrderFilterType::init');
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];
  const { computeClassName } = useComputeBranding(useOrderTrackingStore);
  const [filtersCheckedCount, setFiltersCheckedCount] = useState(0);

  const filterList = useOrderTrackingStore((state) => state.refinements)
    .orderTypes
    .map((type) => {
      return {
        id: type.type,
        label: type.typeText
      }
    });
  const [filtersChecked, setFiltersChecked] = useState(initialFilter);

  const [accordionIsOpen, setAccordionIsOpen] = useState(filtersChecked?.length > 0);

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

  /**
   * Handles the change in filter checkbox status
   * @param {string} id - The ID of the filter checkbox that has been changed
   */
  const onCheckChange = (id) => {
    console.log('OrderFilterType::onCheckChange');
    const checkedList = isFilterChecked(id)
      ? filtersChecked.filter((status) => status !== id) // Remove the filter from `filtersChecked` if it's already checked
      : [
        ...filtersChecked,
        ...filterList
          .filter((status) => status.id === id) // Add the filter to `filtersChecked` if it's not already checked
          .map((element) => element.id),
      ];

    setFiltersChecked(checkedList); // Update the state with the new list of checked filters
    setFiltersCheckedCount(checkedList.length); // Update the count of checked filters

    onChange(checkedList); // Call the `onChange` function with the updated list of checked filters
  };

  /**
 * Checks if a filter with a specific ID is checked
 * @param {string} id - The ID of the filter to check
 * @returns {boolean} - True if the filter is checked, false otherwise
 */
  const isFilterChecked = (id) => {
    console.log('OrderFilterType::isFilterChecked');
    return filtersChecked.some((type) => type === id); // Check if the filter with the given ID exists in `filtersChecked`
  };

  /**
   * Runs once when the component mounts, triggering the onCheckChange function
   */
  useEffect(() => {
    // Call the onCheckChange function to handle any initial setup or state updates
    onCheckChange();
  }, []);

  /**
   * Exposes methods to the parent component using a ref
   */
  useImperativeHandle(ref, () => ({
    /**
     * Clears all selected filters
     */
    clear() {
      console.log('OrderFilterType::clear');
      onCheckChange();
    },
    /**
     * Sets the selected filters
     * @param {Array} checkedList - List of filters to be set as selected
     */
    set(checkedList) {
      console.log('OrderFilterType::set');

      // Update the state with the new list of checked filters
      setFiltersChecked(checkedList);
      // Update the count of checked filters
      setFiltersCheckedCount(checkedList.length);
    }
  }));

  /**
   * Toggles the state of an accordion
   * @param {Function} set - Setter function to update the state
   * @param {boolean} get - Current state value to toggle
   */
  const handleAccordionClick = (set, get) => {
    // Toggle the state by calling the setter function with the opposite of the current state value
    set(!get);
  };;

  return (
    <div className={`order-filter-accordion__item ${!accordionIsOpen ? 'separator' : ''}`}>
      <div className="order-filter-accordion__item--group"
        onClick={() => handleAccordionClick(setAccordionIsOpen, accordionIsOpen)}>
        <h3 className={`${accordionIsOpen ? computeClassName('active') : ''}`}>
          {translations?.OrderType}
        </h3>
        <OrderCount>{filtersCheckedCount > 0 ? filtersCheckedCount : ''}</OrderCount>
      </div>
      {accordionIsOpen && <div className="check-order-wrapper">
        <FormControl>
          {filterList &&
            filterList.map((status) => (
              <FormControlLabel
                key={status.id}
                control={
                  <Checkbox
                    sx={styleCheckbox}
                    checked={isFilterChecked(status.id)}
                  />
                }
                label={status.label}
                onChange={() => onCheckChange(status.id)}
              />
            ))}
        </FormControl>
      </div>}
    </div>
  );
};

export default forwardRef(OrderFilterType);