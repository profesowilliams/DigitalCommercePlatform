import React, { useState, useRef } from 'react';
import OrderFilterTags from './OrderFilterTags';
import OrderFilterDate from './OrderFilterDate';
import OrderFilterStatus from './OrderFilterStatus';
import OrderFilterType from './OrderFilterType';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { CollapseIcon, ExpandIcon } from '../../../../../fluentIcons/FluentIcons';

/**
 * Functional component representing the Order Filter Flyout feature.
 * - Manages filter states and user interactions.
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChanged - Callback function invoked when filter changes
 * @param {Object} props.filters - References to filters used in the component
 * @param {React.Ref} props.subheaderReference - Reference to subheader element
 */
const OrderFilterFlyout = ({
  onFilterChanged,
  filters,
  subheaderReference
}) => {
  const [showFilterTags, setShowFilterTags] = useState(false);

  const [dateFromTo, setDateFromTo] = useState({ type: filters?.date?.type, from: filters?.date?.from, to: filters?.date?.to });
  const dateFilterRef = useRef();

  const [checkedStatuses, setCheckedStatuses] = useState(filters?.statuses || []);
  const statusFilterRef = useRef();

  const [checkedTypes, setCheckedTypes] = useState(filters?.types || []);
  const typeFilterRef = useRef();

  const [areThereAnyFiltersSelectedButNotApplied, setAreThereAnyFiltersSelectedButNotApplied] = useState(false);

  const [showLess, setShowLess] = useState(false);

  const filtersFlyoutConfig = useOrderTrackingStore(
    (state) => state.filtersFlyout
  );

  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

  const { setCustomState } = useOrderTrackingStore((state) => state.effects);

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  const showResult = () => {
    console.log("OrderFilterFlyout::showResult");

    setCustomState({ key: 'filtersFlyout', value: { show: false } });

    onFilterChanged({
      onSearchAction: true,
      date: dateFromTo,
      statuses: checkedStatuses,
      types: checkedTypes
    });

    setAreThereAnyFiltersSelectedButNotApplied(false);
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

    setAreThereAnyFiltersSelectedButNotApplied(false); // Resetting filter applied state
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

    // Indicate that there are not applied filter changes
    setAreThereAnyFiltersSelectedButNotApplied(true);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();
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

    // Indicate that there are not applied filter changes
    setAreThereAnyFiltersSelectedButNotApplied(true);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();
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

    // Indicate that there are not applied filter changes
    setAreThereAnyFiltersSelectedButNotApplied(true);

    // Show/hide filter tags to indicate that filters are applied
    showHideFilterTags();
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