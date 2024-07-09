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

      // Set the custom state to show the criteria
      //setCustomState({ key: 'showCriteria', value: true });
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

      // Set the custom state to show the criteria
      //setCustomState({ key: 'showCriteria', value: true });
    } else {
      console.log('MainGridHeader::clearSearch::not required');
    }
  };

  const handleDeletePill = () => {
    console.log('MainGridHeader::handleDeletePill');

    clearReports();
    clearSearch();

    onPillChanged();
    onQueryChanged();
  };

  const onReportChange = (filters) => {
    console.log('MainGridHeader::onReportChange');

    // clear search criteria
    clearFilters();
    clearSearch();

    onPillChanged({
      field: filters.field,
      label: filters.label
    });

    searchParams.reports.current.value = filters.key;

    onQueryChanged({ onSearchAction: true });
  };

  const onSearchChange = (filters) => {
    console.log('MainGridHeader::onSearchChange');

    clearReports();

    onPillChanged({
      field: filters.field,
      label: filters.value
    });

    searchParams.search.current.field = filters.key;
    searchParams.search.current.value = filters.value;
    searchParams.search.current.gtmField = filters.gtmField;

    onQueryChanged({ onSearchAction: true });
  };

  const onFilterChange = (filters) => {
    console.log('MainGridHeader::onFilterChange');

    clearReports();

    searchParams.filtersRefs.current = {
      date: filters?.date,
      statuses: filters?.statuses,
      types: filters?.types
    };

    onQueryChanged({ onSearchAction: true });
  };

  const onPageChange = (data) => {
    console.log("MainGridHeader::onPageChange");

    searchParams.paginationAndSorting.current.pageNumber = data.pageNumber;

    onQueryChanged({ onSearchAction: true });
  }

  const onPillChanged = (data) => {
    console.log("MainGridHeader::onPillChanged");
    if (data) {
      setPill({ key: data.key, field: data.field, label: data.label });
    } else {
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
