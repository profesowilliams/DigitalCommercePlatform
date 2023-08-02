import React, { cloneElement, useState } from 'react';
import Report from '../Report/Report';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import OrderSearch from '../Search/OrderSearch';
import OrderFilter from '../Filter/OrderFilter';
import OrderExport from '../Export/OrderExport';
import Pill from '../../Widgets/Pill';
import { getPredefinedSearchOptionsList } from '../utils/orderTrackingUtils';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import { ORDER_SEARCH_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { setLocalStorageData } from '../utils/gridUtils';

function MainGridHeader({
  onQueryChanged,
  searchLabels,
  searchOptionsList,
  reportPillLabel,
  setDateRange,
  analyticsCategories,
  paginationLabels,
  customPaginationRef,
  isLoading,
  searchCriteria,
  gridConfig,
  reportFilterValue,
}) {
  const [pill, setPill] = useState(null);
  const searchOptions = [
    ...getPredefinedSearchOptionsList(searchLabels),
    ...searchOptionsList,
  ];

  const removeDefaultDateRange = () => {
    setDateRange(null);
  };

  const onReportChange = (option) => {
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
      field: '',
      value: '',
    });
    setPill({ key: option.key, label: option.label });
    removeDefaultDateRange();
    onQueryChanged();
  };

  const handleDeletePill = () => {
    setPill();
    onQueryChanged();
  };

  const onSearchChange = () => {
    setPill();
    removeDefaultDateRange();
    onQueryChanged();
  };

  const rightComponents = [
    ...(pill
      ? [
          <Pill
            children={
              <span className="td-capsule__text">
                {reportPillLabel}: {pill.label}
              </span>
            }
            closeClick={handleDeletePill}
            hasCloseButton
          />,
        ]
      : []),
    <OrderSearch
      options={searchOptions}
      onQueryChanged={onSearchChange}
      ref={searchCriteria}
      store={useOrderTrackingStore}
      hideLabel={true}
      gridConfig={gridConfig}
      searchAnalyticsLabel={analyticsCategories.search}
    />,
    <VerticalSeparator />,
    <OrderFilter />,
    <VerticalSeparator />,
    <Report
      selectOption={onReportChange}
      ref={reportFilterValue}
      selectedKey={pill?.key}
      gridConfig={gridConfig}
      reportAnalyticsLabel={analyticsCategories.report}
    />,
    <VerticalSeparator />,
    <OrderExport />,
  ];
  const leftComponents = [
    <OrderTrackingGridPagination
      ref={customPaginationRef}
      store={useOrderTrackingStore}
      onQueryChanged={onQueryChanged}
      disabled={isLoading}
      paginationAnalyticsLabel={analyticsCategories.pagination}
      resultsLabel={paginationLabels.results}
      ofLabel={paginationLabels.of}
    />,
  ];

  return (
    <div className="cmp-base-grid-subheader">
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
