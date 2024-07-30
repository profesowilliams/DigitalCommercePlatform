import React, { cloneElement, useState, useEffect, useRef } from 'react';
import Report from '../Report/Report';
import Settings from '../Settings/Settings';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import Search from '../NewSearch/Search';
import OrderFilter from '../Filter/OrderFilter';
import OrderExport from '../Export/OrderExport';
import Pill from '../../Widgets/Pill';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { isFilterNotEmpty, isFilterChangeModelIsValid } from '../Filter/Utils/utils';
import { isReportFilterNotEmpty, isReportChangeModelIsValid } from '../Report/Utils/utils';
import { isSearchFilterNotEmpty, isSearchChangeModelIsValid } from '../NewSearch/Utils/utils';

/**
 * Header component to manage the main grid's header functionalities including search, filters, and pagination.
 * @param {Object} props - Component props.
 * @param {Function} props.onInit - Callback function invoked on initialization
 * @param {Function} props.onQueryChanged - Callback function invoked when the query changes.
 * @param {Object} props.analyticsCategories - Analytics categories for tracking events. (remove?)
 * @param {boolean} props.isLoading - Flag indicating if the grid data is loading.
 * @param {Object} props.searchParams - Object containing search parameters.
 * @param {Object} props.gridConfig - Configuration object for the grid.
 * @param {Object} props.settings - Settings for the main grid. (remove?)
 */
function Header({
  onInit,
  onQueryChanged,
  analyticsCategories,
  isLoading,
  searchParams,
  paginationData,
  gridConfig,
  settings
}) {
  const proactiveMessagingFlag = useOrderTrackingStore((state) => state.featureFlags.proactiveMessage);

  const [isFiltersReady, setIsFiltersReady] = useState(false);
  const [isReportsReady, setIsReportsReady] = useState(false);
  const [isSearchReady, setIsSearchReady] = useState(false);

  const [pill, setPill] = useState();
  const reportRef = useRef();
  const searchRef = useRef();
  const filterRef = useRef();

  /**
   * Function to clear filters if any filters are applied
   *
   * @returns {boolean} - Returns true if filters were cleared, otherwise false.
   */
  const clearFilters = () => {
    // Check if any date filters or type/status filters are applied
    if (isFilterNotEmpty(searchParams.filters)) {
      console.log('Header::clearFilters');

      // Clean up the filters using the filterRef
      filterRef.current.cleanUp();

      // Clear the current filter references
      searchParams.filters = {};

      // Reset page number to 1
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };

      return true;
    } else {
      console.log('Header::clearFilters::not required');
    }

    return false;
  };

  /**
   * Function to clear report filters if any report filters are applied.
   *
   * @returns {boolean} - Returns true if report filters were cleared, otherwise false.
   */
  const clearReports = () => {
    // Check if there is any report filter applied
    if (isReportFilterNotEmpty(searchParams.reports)) {
      console.log('Header::clearReports');

      // Hide pill
      onPillChanged();

      // Clean up the report filters using the reportRef
      reportRef.current.cleanUp();

      // Clear the current report filter references
      searchParams.reports = {};

      // Reset page number to 1
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };

      return true;
    } else {
      console.log('Header::clearReports::not required');
    }

    return false;
  };

  /**
   * Function to clear search filters if any search filters are applied
   *
   * @returns {boolean} - Returns true if search filters were cleared, otherwise false.
   */
  const clearSearch = () => {
    // Check if there is any search filter applied
    if (isSearchFilterNotEmpty(searchParams.search)) {
      console.log('Header::clearSearch');

      // Hide pill
      onPillChanged();

      // Clean up the search filters using the searchRef
      searchRef.current.cleanUp();

      // Clear the current search filter references
      searchParams.search = {};

      // Reset page number to 1
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };

      return true;
    } else {
      console.log('Header::clearSearch::not required');
    }

    return false;
  };

  /**
   * Handler for filter changes in the main grid.
   * @param {Object} filters - The filters object containing the updated filter values.
   */
  const onFiltersChange = (filters) => {
    console.log('Header::onFilterChange');

    if (!isFilterChangeModelIsValid(filters)) {
      console.log('Header::onSearchChange::model is invalid');
      return;
    }

    if (!isFilterNotEmpty(filters)) {
      console.log('Header::onFilterChange::filters are empty');
      return;
    }

    console.log('Header::onFilterChange::filters are not empty');

    // Clear any existing report filters
    const reportsCleared = clearReports();

    searchParams.paginationAndSorting = searchParams.paginationAndSorting ?? {};

    // Reset page number to 1
    if (!reportsCleared && !filters?.isInit) {
      console.log('Header::onReportChange::reset page number');
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };
    }

    // Update the searchParams with the new filters
    searchParams.filters = {
      date: filters?.date,
      statuses: filters?.statuses,
      types: filters?.types
    };

    // Trigger the query change callback indicating a search action
    onQueryChanged(searchParams);
  };

  /**
   * Handler for changing the report filters in the main grid header.
   * @param {Object} filters - The filters object containing field, label, and key (report name).
   */
  const onReportsChange = (filters) => {
    console.log('Header::onReportChange');

    if (!isReportChangeModelIsValid(filters)) {
      console.log('Header::onReportChange::model is invalid');
      return;
    }

    if (!isReportFilterNotEmpty(filters)) {
      console.log('Header::onReportChange::filters are empty');
      return;
    }

    console.log('Header::onReportChange::filters are not empty');

    // Clear the current filter criteria
    const filtersCleared = clearFilters();

    // Clear the current search criteria
    const searchCleared = clearSearch();

    // Update the pill (filter indicator) with the new field and label
    onPillChanged({
      field: filters.field,
      label: filters.label
    });

    searchParams.paginationAndSorting = searchParams.paginationAndSorting ?? {};

    // Reset page number to 1
    if (!filtersCleared && !searchCleared && !filters?.isInit) {
      console.log('Header::onReportChange::reset page number');
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };
    }

    // Update the current report value in the search parameters
    searchParams.reports = { value: filters.key }

    // Trigger the query change to update the grid data, indicating a search action
    onQueryChanged(searchParams);
  };

  /**
   * Handler for changing the search filters in the main grid header.
   * @param {Object} filters - The filters object containing field, label, key, value, and gtmField.
   */
  const onSearchChange = (filters) => {
    console.log('Header::onSearchChange');

    if (!isSearchChangeModelIsValid(filters)) {
      console.log('Header::onSearchChange::model is invalid');
      return;
    }

    if (!isSearchFilterNotEmpty(filters)) {
      console.log('Header::onSearchChange::filters are empty');
      return;
    }

    console.log('Header::onSearchChange::filters are not empty');

    // Clear the current report criteria
    const reportsCleared = clearReports();

    // Update the pill (filter indicator) with the new field and value
    onPillChanged({
      field: filters.field,
      label: filters.value
    });

    searchParams.paginationAndSorting = searchParams.paginationAndSorting ?? {};

    // Reset page number to 1
    if (reportsCleared || !reportsCleared && !filters?.isInit) {
      console.log('Header::onReportChange::reset page number');
      searchParams.paginationAndSorting = {
        ...searchParams.paginationAndSorting,
        pageNumber: 1,
        queryCacheKey: ''
      };
    }

    // Update the current search parameters with the new filters
    searchParams.search = {
      field: filters.key,
      value: filters.value,
      gtmField: filters.gtmField
    }

    // Trigger the query change to update the grid data, indicating a search action
    onQueryChanged(searchParams);
  };

  /**
   * Callback function invoked when filters are initialized.
   * Sets the filters control as ready. The control can only be ready
   * when the filter criteria are empty; otherwise, the control itself 
   * will trigger a search.
   */
  const onFiltersInit = (filterIsEmpty) => {
    console.log('Header::onFiltersInit');
    setIsFiltersReady(filterIsEmpty);
  }

  /**
   * Callback function invoked when reports are initialized.
   * Sets the reports control as ready. The control can only be ready
   * when the filter criteria are empty; otherwise, the control itself 
   * will trigger a search.
   */
  const onReportsInit = (filterIsEmpty) => {
    console.log('Header::onReportsInit');
    setIsReportsReady(filterIsEmpty);
  }

  /**
   * Callback function invoked when search is initialized.
   * Sets the search control as ready. The control can only be ready
   * when the filter criteria are empty; otherwise, the control itself 
   * will trigger a search.
   */
  const onSearchInit = (filterIsEmpty) => {
    console.log('Header::onSearchInit');
    setIsSearchReady(filterIsEmpty);
  }

  /**
   * Handles page change event from the pagination component.
   * @param {Object} data - The data containing the new page number.
   */
  const onPageChange = (data) => {
    console.log("MainGridHeader::onPageChange");

    // Ensure searchParams and nested paginationAndSorting objects are defined
    searchParams.paginationAndSorting = searchParams.paginationAndSorting ?? {};

    // Update the current page number in the search parameters
    searchParams.paginationAndSorting.pageNumber = data.pageNumber;

    // Trigger the query change callback indicating a search action with updated searchParams
    onQueryChanged(searchParams);
  }

  /**
   * Handles the action of deleting a pill (filter or search criteria) in the main grid header.
   */
  const handleDeletePill = () => {
    console.log('Header::handleDeletePill');

    // Clear the reports filters
    clearReports();

    // Clear the search criteria
    clearSearch();

    // Trigger any actions associated with changing the pill
    onPillChanged();

    // Trigger the query change to update the grid data
    onQueryChanged(searchParams);
  };

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

  useEffect(() => {
    // Check if filters, reports, and search are all initialized
    if (isFiltersReady && isReportsReady && isSearchReady) {
      // If all are initialized, invoke the onInit callback function
      onInit();
    }
  }, [isFiltersReady, isReportsReady, isSearchReady]);

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
      onInit={onSearchInit}
      onChange={onSearchChange}
      gridConfig={gridConfig}
      filters={searchParams?.filters}
      analyticsLabel={analyticsCategories.search}
    />,
    <VerticalSeparator />,
    <OrderFilter
      ref={filterRef}
      onInit={onFiltersInit}
      onChange={onFiltersChange}
    />,
    <VerticalSeparator />,
    <Report
      ref={reportRef}
      onInit={onReportsInit}
      onChange={onReportsChange}
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

export default Header;