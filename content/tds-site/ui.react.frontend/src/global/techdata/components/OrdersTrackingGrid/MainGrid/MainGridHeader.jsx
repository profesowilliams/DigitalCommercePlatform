import React, { cloneElement, useState, useRef } from 'react';
import Report from '../Report/Report';
import Settings from '../Settings/Settings';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import Search from '../NewSearch/Search';
import OrderFilter from '../Filter/OrderFilter';
import OrderExport from '../Export/OrderExport';
import Pill from '../../Widgets/Pill';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * MainGridHeader component to manage the main grid's header functionalities including search, filters, and pagination.
 * @param {Object} props - Component props.
 * @param {Function} props.onQueryChanged - Callback function invoked when the query changes.
 * @param {Object} props.analyticsCategories - Analytics categories for tracking events. (remove?)
 * @param {boolean} props.isLoading - Flag indicating if the grid data is loading.
 * @param {Object} props.searchParams - Object containing search parameters.
 * @param {Object} props.gridConfig - Configuration object for the grid.
 * @param {Object} props.settings - Settings for the main grid. (remove?)
 * @param {Object} props.paginationData - Data related to pagination.
 */
function MainGridHeader({
  onQueryChanged,
  analyticsCategories,
  isLoading,
  searchParams,
  gridConfig,
  settings,
  paginationData
}) {
  const proactiveMessagingFlag = useOrderTrackingStore((state) => state.featureFlags.proactiveMessage);
  const [pill, setPill] = useState();
  const reportRef = useRef();
  const searchRef = useRef();
  const filterRef = useRef();

  /**
   * Function to clear filters if any filters are applied
   */
  const clearFilters = () => {
    // Check if any date filters or type/status filters are applied
    if (
      searchParams.filtersRefs.current?.data?.type
      || searchParams.filtersRefs.current?.data?.from
      || searchParams.filtersRefs.current?.data?.to
      || searchParams.filtersRefs.current?.statuses?.length > 0
      || searchParams.filtersRefs.current?.types?.length > 0
    ) {
      console.log('MainGridHeader::clearFilters');

      // Clean up the filters using the filterRef
      filterRef.current.cleanUp();
      // Clear the current filter references
      searchParams.filtersRefs.current = {};

      // Trigger query change indicating a search action
      onQueryChanged({ onSearchAction: true });
    } else {
      console.log('MainGridHeader::clearFilters::not required');
    }
  };

  /**
   * Function to clear report filters if any report filters are applied
   */
  const clearReports = () => {
    // Check if there is any report filter applied
    if (searchParams.reports.current?.value) {
      console.log('MainGridHeader::clearReports');

      // Hide pill
      onPillChanged();

      // Clean up the report filters using the reportRef
      reportRef.current.cleanUp();
      // Clear the current report filter references
      searchParams.reports.current = {};
    } else {
      console.log('MainGridHeader::clearReports::not required');
    }
  };

  /**
   * Function to clear search filters if any search filters are applied
   */
  const clearSearch = () => {
    // Check if there is any search filter applied
    if (searchParams.search.current?.value) {
      console.log('MainGridHeader::clearSearch');

      // Hide pill
      onPillChanged();

      // Clean up the search filters using the searchRef
      searchRef.current.cleanUp();
      // Clear the current search filter references
      searchParams.search.current = {};
    } else {
      console.log('MainGridHeader::clearSearch::not required');
    }
  };

  /**
   * Handles the action of deleting a pill (filter or search criteria) in the main grid header.
   */
  const handleDeletePill = () => {
    console.log('MainGridHeader::handleDeletePill');

    // Clear the reports filters
    clearReports();

    // Clear the search criteria
    clearSearch();

    // Trigger any actions associated with changing the pill
    onPillChanged();

    // Trigger the query change to update the grid data
    onQueryChanged();
  };

  /**
   * Handler for changing the report filters in the main grid header.
   * @param {Object} filters - The filters object containing field, label, and key (report name).
   */
  const onReportChange = (filters) => {
    console.log('MainGridHeader::onReportChange');

    // Clear the current filter criteria
    clearFilters();

    // Clear the current search criteria
    clearSearch();

    // Update the pill (filter indicator) with the new field and label
    onPillChanged({
      field: filters.field,
      label: filters.label
    });

    // Update the current report value in the search parameters
    searchParams.reports.current.value = filters.key;

    // Trigger the query change to update the grid data, indicating a search action
    onQueryChanged({ onSearchAction: true });
  };

  /**
   * Handler for changing the search filters in the main grid header.
   * @param {Object} filters - The filters object containing field, label, key, value, and gtmField.
   */
  const onSearchChange = (filters) => {
    console.log('MainGridHeader::onSearchChange');

    // Clear the current report criteria
    clearReports();

    // Update the pill (filter indicator) with the new field and value
    onPillChanged({
      field: filters.field,
      label: filters.value
    });

    // Update the current search parameters with the new filters
    searchParams.search.current.field = filters.key;
    searchParams.search.current.value = filters.value;
    searchParams.search.current.gtmField = filters.gtmField;

    // Trigger the query change to update the grid data, indicating a search action
    onQueryChanged({ onSearchAction: true });
  };

  /**
   * Handler for filter changes in the main grid.
   * @param {Object} filters - The filters object containing the updated filter values.
   */
  const onFilterChange = (filters) => {
    console.log('MainGridHeader::onFilterChange');

    // Clear any existing report filters
    clearReports();

    // Update the searchParams with the new filters
    searchParams.filtersRefs.current = {
      date: filters?.date,
      statuses: filters?.statuses,
      types: filters?.types
    };

    // Trigger the query change callback indicating a search action
    onQueryChanged({ onSearchAction: true });
  };

  /**
   * Handler for page changes in the main grid.
   * @param {Object} data - The data object containing the updated page information.
   */
  const onPageChange = (data) => {
    console.log("MainGridHeader::onPageChange");

    // Update the current page number in the search parameters
    searchParams.paginationAndSorting.current.pageNumber = data.pageNumber;

    // Trigger the query change callback indicating a search action
    onQueryChanged({ onSearchAction: true });
  }

  /**
   * Handler for changes to the pill (filter chip).
   * @param {Object} data - The data object containing the new pill information, or null to clear the pill.
   */
  const onPillChanged = (data) => {
    console.log("MainGridHeader::onPillChanged");

    // Check if data is provided to update the pill
    if (data) {
      // Update the pill state with the new key, field, and label from the data object
      setPill({ key: data.key, field: data.field, label: data.label });
    } else {
      // Clear the pill by setting it to null
      setPill(null);
    }
  }

  const leftComponents = [
    <OrderTrackingGridPagination
      onPageChange={onPageChange}
      disabled={isLoading}
      paginationData={paginationData}
    />,
  ];

  const rightComponents = [
    ...(pill && pill.field && pill.label
      ? [
        <Pill
          children={
            <span className="td-capsule__text">
              {pill.field}: {pill.label}
            </span>
          }
          closeClick={handleDeletePill}
          hasCloseButton
        />,
      ]
      : []),
    <Search
      ref={searchRef}
      onChange={onSearchChange}
      gridConfig={gridConfig}
      filtersRefs={searchParams.filtersRefs}
      analyticsLabel={analyticsCategories.search}
    />,
    <VerticalSeparator />,
    <OrderFilter
      ref={filterRef}
      onChange={onFilterChange}
      filtersRefs={searchParams.filtersRefs}
    />,
    <VerticalSeparator />,
    <Report
      ref={reportRef}
      onChange={onReportChange}
      analyticsLabel={analyticsCategories.report}
    />,
    <VerticalSeparator />,
    ...(settings && proactiveMessagingFlag
      ? [
        <Settings settings={settings} gridConfig={gridConfig} />,
        <VerticalSeparator />,
      ]
      : []),
    <OrderExport
      gridConfig={gridConfig}
      searchParams={searchParams}
      exportAnalyticsLabel={analyticsCategories.export}
    />,
  ];

  return (
    <div className="grid-subheader-pagination">
      <div className="cmp-base-grid-subheader-left">
        {leftComponents.map((component, index) =>
          cloneElement(component, { key: index })
        )}
      </div>
      <div className="base-grid-filters">
        {rightComponents.map((component, index) =>
          cloneElement(component, { key: index })
        )}
      </div>
    </div>
  );
}

export default MainGridHeader;