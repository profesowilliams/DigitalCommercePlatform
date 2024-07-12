import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { OptionsIcon, OptionsIconFilled, } from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderCountClear from './OrderCountClear';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../../Hover/Hover';
import OrderFilterFlyout from '../Filter/OrderFilterFlyout';
import { getUrlParamsCaseInsensitive } from '../../../../../utils/index';
import { getFilterAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import { updateUrl } from './utils/utils';

/**
 * Functional component representing the Order Filter feature
 * includes filter icon with tooltip, counter, and flyout
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function invoked when filter changes
 * @param {React.Ref} ref - Reference object used to expose imperative methods
 */
function OrderFilter({ onChange }, ref) {
  console.log('OrderFilter::init');

  // Import necessary functions and hooks from the store
  const { setFilterClicked, setCustomState } = useOrderTrackingStore(
    (state) => state.effects
  );

  // Get UI translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);

  // Extract translations for the main grid filters
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

  // State to keep track of the number of active filters
  const [numberOfFilters, setNumberOfFilters] = useState(0);

  // Get URL parameters in a case-insensitive manner
  const params = getUrlParamsCaseInsensitive();

  // State to keep track of the current filters
  const [filters, setFilters] = useState({
    date: {
      type: params.get('datetype'),
      from: params.get('datefrom'),
      to: params.get('dateto')
    },
    statuses: [...new Set(params.getAll('status'))],
    types: [...new Set(params.getAll('type'))]
  });

  /**
   * Triggers the display of the filters flyout
   */
  const triggerFiltersFlyout = () => {
    // Update the state to show the filters flyout
    setCustomState({
      key: 'filtersFlyout',
      value: { show: true },
    });
  };

  /**
   * Clears all filters and updates the URL accordingly
   */
  const clearFilters = () => {
    console.log('OrderFilter::clearFilters');

    // Clear the date, statuses and types filters
    const newFilters = {
      date: { type: undefined, from: undefined, to: undefined },
      statuses: [],
      types: []
    };

    // Set the cleared filters in the component's state
    setFilters(newFilters);

    // Reset the number of applied filters to 0
    setNumberOfFilters(0);

    // Update the URL to reflect the cleared filters
    updateUrl();

    return newFilters;
  };

  /**
   * Handler for clearing filters
   * Calls clearFilters and triggers the onChange callback with the new filters
   */
  const onClearFilters = () => {
    console.log('OrderFilter::onClearFilters');

    // Call clearFilters to reset the filters
    var newFilters = clearFilters();

    // Trigger the onChange callback with the new filters
    onChange(newFilters);
  };

  /**
   * Handles the change event when filters are updated
   * @param {Object} filters - The updated filters
   */
  const onFilterChanged = (filters) => {
    console.log('OrderFilter::onFilterChanged');

    // Calculate the number of applied filters
    const numberOfAppliedFilters =
      (filters?.date?.from && filters?.date?.to && filters?.date?.type ? 1 : 0) +
      (filters?.statuses?.length || 0) +
      (filters?.types?.length || 0);

    // Trigger a query change event with the updated filter
    onChange(filters);

    // Update the URL to reflect the filters
    updateUrl(filters);

    // Set number of applied filters to calculated number
    setNumberOfFilters(numberOfAppliedFilters);

    if (numberOfAppliedFilters > 0) {
      // Push data to Google Analytics
      pushDataLayerGoogle(getFilterAnalyticsGoogle(filters));
    }
  };

  /**
   * Exposes methods to the parent component using a ref
   * @param {React.Ref} ref - Reference object to expose imperative methods
   */
  useImperativeHandle(ref, () => ({
    /**
     * Cleans up by clearing all filters
     */
    cleanUp() {
      console.log('OrderFilter::cleanUp');
      // Call the clearFilters function to reset all filters
      clearFilters();
    },
  }));

  /**
   * Updates the count of applied filters when filters change
   * Runs only once on component mount
   */
  useEffect(() => {
    console.log('OrderFilter::useEffect::empty');
    // Call onFilterChanged with the current filters to update the applied filters count
    onFilterChanged(filters);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <Tooltip
        title={translations?.Tooltip}
        placement="top"
        arrow
        disableInteractive={true}
      >
        <div
          className="cmp-order-tracking-grid__filter"
          onClick={() => {
            triggerFiltersFlyout();
            setFilterClicked(false);
          }}
        >
          <Hover
            onHover={
              <OptionsIconFilled fill="#262626" className="icon-hover" />
            }
          >
            <OptionsIcon fill="#262626" className="icon-hover" />
          </Hover>
        </div>
      </Tooltip>
      {numberOfFilters > 0 && (
        <OrderCountClear onClearFilters={onClearFilters}>
          {numberOfFilters}
        </OrderCountClear>
      )}
      <OrderFilterFlyout
        onFilterChanged={onFilterChanged}
        filters={filters}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
    </>
  );
}

export default forwardRef(OrderFilter);