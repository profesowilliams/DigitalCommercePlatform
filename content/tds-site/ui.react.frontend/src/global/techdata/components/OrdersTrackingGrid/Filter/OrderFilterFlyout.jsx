import React, { useState, useRef, useEffect } from 'react';
import OrderFilterTags from './OrderFilterTags';
import OrderFilterDate from './OrderFilterDate';
import OrderFilterStatus from './OrderFilterStatus';
import OrderFilterType from './OrderFilterType';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { CollapseIcon, ExpandIcon } from '../../../../../fluentIcons/FluentIcons';
import { compareFilters } from './Utils/utils';

/**
 * Functional component representing the Order Filter Flyout feature.
 * - Manages filter states and user interactions.
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChanged - Callback function invoked when filter changes
 * @param {Function} props.onFlyoutOpen - Callback function invoked when the flyout opens
 * @param {Object} props.filters - References to filters used in the component
 * @param {Object} props.appliedFilters - References to the applied filters
 * @param {React.Ref} props.subheaderReference - Reference to subheader element
 */
const OrderFilterFlyout = ({
  onFilterChanged,
  onFlyoutOpen,
  filters,
  appliedFilters,
  subheaderReference
}) => {
  const [showFilterTags, setShowFilterTags] = useState(false);

  const [areThereAnyFiltersSelectedButNotApplied, setAreThereAnyFiltersSelectedButNotApplied] = useState(false);
  const [dateFromTo, setDateFromTo] = useState({ type: filters?.date?.type, from: filters?.date?.from, to: filters?.date?.to });
  const dateFilterRef = useRef();

  const [checkedStatuses, setCheckedStatuses] = useState(filters?.statuses || []);
  const statusFilterRef = useRef();

  const [checkedTypes, setCheckedTypes] = useState(filters?.types || []);
  const typeFilterRef = useRef();

  const [showLess, setShowLess] = useState(false);

  const filtersFlyoutConfig = useOrderTrackingStore((state) => state.filtersFlyout);

  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

  const { setCustomState } = useOrderTrackingStore((state) => state.effects);

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  /**
   * Function to show the filtered results.
   * - Closes the filters flyout.
   * - Triggers the filter change callback with the current filter selections.
   */
  const showResult = () => {
    console.log("OrderFilterFlyout::showResult");

    // Close the filters flyout by setting its 'show' property to false
    setCustomState({ key: 'filtersFlyout', value: { show: false } });

    // Trigger the onFilterChanged callback with the selected filters
    onFilterChanged({
      onSearchAction: true, // Indicates that this action is a search action
      date: dateFromTo,     // The selected date range
      statuses: checkedStatuses, // The selected statuses
      types: checkedTypes        // The selected types
    });
  };

  /**
   * Handles the action when clearing filters in the order filter flyout.
   * - Resets states and clears filters.
   */
  const handleClearFilter = () => {
    console.log("OrderFilterFlyout::handleClearFilter");

    // Resetting states and clearing filters
    setCustomState({
      key: 'filtersFlyout',
      value: { show: false }, // Hiding filter flyout
    });

    console.log("OrderFilterFlyout::resetControls");
    // Resetting controls state to default (user rejected changes)
    dateFilterRef.current.set(dateFromTo);
    statusFilterRef.current.set(checkedStatuses);
    typeFilterRef.current.set(checkedTypes);
  };

  /**
   * Handles changes to the date filter
   * @param {Object} option - The selected date filter option
   */
  const onDateFilterChange = (option) => {
    console.log('OrderFilterFlyout::onDateFilterChange');

    // Update the current date filter reference with the selected option
    filters.date = option;

    // Update the state to reflect the selected date range
    setDateFromTo(option);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();

    // Update the state to indicate whether there are any filters selected but not applied
    setAreThereAnyFiltersSelectedButNotApplied(!compareFilters(appliedFilters, filters));
  };

  /**
   * Handles changes to the status filter
   * @param {Array} option - The selected status filter options
   */
  const onStatusFilterChange = (option) => {
    console.log('OrderFilterFlyout::onStatusFilterChange');

    // Update the current status filter reference with the selected options
    filters.statuses = option;

    // Update the state to reflect the selected status options
    setCheckedStatuses(option);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();

    // Update the state to indicate whether there are any filters selected but not applied
    setAreThereAnyFiltersSelectedButNotApplied(!compareFilters(appliedFilters, filters));
  };

  /**
   * Handles changes to the type filter
   * @param {Array} types - The selected type filter options
   */
  const onTypeFilterChange = (types) => {
    console.log('OrderFilterFlyout::onTypeFilterChange');

    // Update the current type filter reference with the selected options
    filters.types = types;

    // Update the state to reflect the selected type options
    setCheckedTypes(types);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();

    // Update the state to indicate whether there are any filters selected but not applied
    setAreThereAnyFiltersSelectedButNotApplied(!compareFilters(appliedFilters, filters));
  };

  /**
   * Handles changes to the overall filters
   * @param {Object} newFilters - The selected filters object
   */
  const onFilterChange = (newFilters) => {
    console.log('OrderFilterFlyout::onFilterChange');

    /**
     * Update date
     */
    // Update the current date filter reference with the selected option
    filters.date = newFilters.date;

    // Update the state to reflect the selected date range
    setDateFromTo(newFilters.date);

    // Update the date filter reference with the selected date
    dateFilterRef.current.set(newFilters.date);

    /**
     * Update statuses
     */
    // Update the current status filter reference with the selected options
    filters.statuses = newFilters.statuses;

    // Update the state to reflect the selected status options
    setCheckedStatuses(newFilters.statuses);

    // Update the status filter reference with the selected statuses
    statusFilterRef.current.set(newFilters.statuses);

    /**
     * Update types
     */
    // Update the current type filter reference with the selected options
    filters.types = newFilters.types;

    // Update the state to reflect the selected type options
    setCheckedTypes(newFilters.types);

    // Update the type filter reference with the selected types
    typeFilterRef.current.set(newFilters.types);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();

    // Update the state to indicate whether there are any filters selected but not applied
    setAreThereAnyFiltersSelectedButNotApplied(!compareFilters(appliedFilters, filters));
  };

  /**
   * Function to show or hide filter tags based on the number of applied filters
   */
  const showHideFilterTags = () => {
    console.log('OrderFilterFlyout::showHideFilterTags');

    // Calculate the number of applied filters
    const numberOfAppliedFilters =
      // Check if date filters are applied and count them as one if they are
      (filters?.date?.from && filters?.date?.to && filters?.date?.type ? 1 : 0) +
      // Count the number of selected statuses
      (filters?.statuses?.length || 0) +
      // Count the number of selected types
      (filters?.types?.length || 0);

    // Update the state to show or hide filter tags based on the number of applied filters
    setShowFilterTags(numberOfAppliedFilters > 0);
  };

  /**
   * Callback function invoked when the flyout opens.
   * This function calls the provided onFlyoutOpen function, if defined.
   */
  const onOpen = () => {
    // Check if the onFlyoutOpen function is provided and is a function
    if (typeof onFlyoutOpen === 'function') {
      // Call the onFlyoutOpen function
      onFlyoutOpen();
    }
  };

  useEffect(() => {
    console.log('OrderFilterFlyout::useEffect::filtersFlyoutConfig');

    // Check if the `filtersFlyoutConfig` object has a `show` property that is truthy
    if (filtersFlyoutConfig?.show) {
      onOpen();
    }
    // The dependency array ensures this effect runs whenever `filtersFlyoutConfig` changes
  }, [filtersFlyoutConfig]);

  useEffect(() => {
    console.log('OrderFilterFlyout::useEffect::empty');

    // Update the state to indicate whether there are any filters selected but not applied
    setAreThereAnyFiltersSelectedButNotApplied(!compareFilters(appliedFilters, filters));
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <BaseFlyout
      open={filtersFlyoutConfig?.show}
      onClose={handleClearFilter}
      width="360px"
      anchor="right"
      titleLabel={translations?.Title}
      buttonLabel={translations?.ShowResult}
      disabledButton={!areThereAnyFiltersSelectedButNotApplied}
      onClickButton={showResult}
      isTDSynnex={true}
      subheaderReference={subheaderReference}
    >
      <section className="cmp-flyout__content-without-padding teal_scroll height_order_filters">
        <div className={'order-filter-accordion'}>
          <OrderFilterDate
            ref={dateFilterRef}
            onChange={onDateFilterChange}
            initialFilter={filters?.date}
          />
          <OrderFilterStatus
            ref={statusFilterRef}
            onChange={onStatusFilterChange}
            initialFilter={filters?.statuses}
          />
          <OrderFilterType
            ref={typeFilterRef}
            onChange={onTypeFilterChange}
            initialFilter={filters?.types}
          />
        </div>
      </section>
      {showFilterTags && (
        <section
          className={`filter-order-tags-container ${showLess ? 'activated' : ''
            }`}
        >
          <span onClick={toggleShowLess} className="order-filter-tags-more">
            {showLess ? <ExpandIcon /> : <CollapseIcon />}
          </span>
          <OrderFilterTags
            dateFromTo={dateFromTo}
            checkedStatuses={checkedStatuses}
            checkedTypes={checkedTypes}
            onChange={onFilterChange}
          />
        </section>
      )}
    </BaseFlyout>
  );
};

export default OrderFilterFlyout;