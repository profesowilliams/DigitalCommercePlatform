import React, { cloneElement, useState, useEffect } from 'react';
import Report from '../Report/Report';
import Settings from '../Settings/Settings';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import OrderSearch from '../Search/OrderSearch';
import OrderFilter from '../Filter/OrderFilter';
import OrderExport from '../Export/OrderExport';
import Pill from '../../Widgets/Pill';
import { getPredefinedSearchOptionsList } from '../utils/orderTrackingUtils';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  REPORTS_LOCAL_STORAGE_KEY,
} from '../../../../../utils/constants';
import {
  setLocalStorageData,
  removeLocalStorageData,
  getLocalStorageData,
} from '../utils/gridUtils';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

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
  filtersRefs,
  settings,
}) {
  const {
    setCustomState,
    clearAllOrderFilters,
    setFilterClicked,
    setPredefinedFiltersApplied,
    setCustomizedFiltersApplied,
    clearCheckedButNotAppliedOrderFilters,
  } = useOrderTrackingStore((st) => st.effects);

  const proactiveMessagingFlag = useOrderTrackingStore(
    (state) => state.featureFlags.proactiveMessage
  );
  const [pill, setPill] = useState(
    getLocalStorageData(REPORTS_LOCAL_STORAGE_KEY) || null
  );

  const searchOptions = [
    ...getPredefinedSearchOptionsList(searchLabels),
    ...searchOptionsList,
  ];
  const {
    openOrdersLabel,
    newBacklogLabel,
    eolReportLabel,
    todaysShipmentsDeliveriesLabel,
    last7DaysOrdersLabel,
    last30DaysOrdersLabel,
    last7DaysShipmentsLabel,
    last30DaysShipmentsLabel,
  } = gridConfig?.reportLabels;

  const reportOptions = [
    {
      key: 'OpenOrders',
      label: getDictionaryValueOrKey(openOrdersLabel),
    },
    {
      key: 'NewBacklog',
      label: getDictionaryValueOrKey(newBacklogLabel),
    },
    {
      key: 'TodaysShipmentsDeliveries',
      label: getDictionaryValueOrKey(todaysShipmentsDeliveriesLabel),
    },
    {
      key: 'Last7DaysOrders',
      label: getDictionaryValueOrKey(last7DaysOrdersLabel),
    },
    {
      key: 'Last30DaysOrders',
      label: getDictionaryValueOrKey(last30DaysOrdersLabel),
    },
    {
      key: 'Last7DaysShipments',
      label: getDictionaryValueOrKey(last7DaysShipmentsLabel),
    },
    {
      key: 'Last30DaysShipments',
      label: getDictionaryValueOrKey(last30DaysShipmentsLabel),
    },
    {
      key: 'EOLOrders',
      label: getDictionaryValueOrKey(eolReportLabel),
    },
  ];

  const clearFilters = () => {
    filtersRefs.current = {};
    clearAllOrderFilters();
    setFilterClicked(false);
    setPredefinedFiltersApplied([]);
    setCustomizedFiltersApplied([]);
    setLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY, {
      dates: [],
      types: [],
      statuses: [],
    });
    clearCheckedButNotAppliedOrderFilters();
    onQueryChanged({ onSearchAction: true });
  };

  const clearReports = () => {
    removeQueryParamsReport();
    setPill();
    removeLocalStorageData(REPORTS_LOCAL_STORAGE_KEY);
    setCustomState({
      key: 'showCriteria',
      value: true,
    });
  };

  const removeDefaultDateRange = () => {
    setDateRange(null);
  };

  const onReportChange = (option) => {
    clearFilters();
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
      field: '',
      value: '',
    });
    removeLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY);
    searchCriteria.current = { field: '', value: '' };
    filtersRefs.current = {};
    setPill({ key: option.key, label: option.label });
    removeDefaultDateRange();
    onQueryChanged({ onSearchAction: true });
    setCustomState({
      key: 'showCriteria',
      value: false,
    });
  };

  const removeQueryParamsReport = () => {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (key === 'report') {
        params.delete(key);
      }
    });
    window.history.pushState(
      {},
      document.title,
      `${window.location.pathname}?${params}`
    );
  };

  const handleDeletePill = () => {
    clearReports();
    onQueryChanged();
  };

  const onSearchChange = () => {
    setPill();
    removeDefaultDateRange();
    onQueryChanged({ onSearchAction: true });
  };

  const rightComponents = [
    ...(pill
      ? [
          <Pill
            children={
              <span className="td-capsule__text">
                {getDictionaryValueOrKey(reportPillLabel)}: {pill.label}
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
      hideLabel={true}
      gridConfig={gridConfig}
      searchAnalyticsLabel={analyticsCategories.search}
      clearReports={clearReports}
    />,
    <VerticalSeparator />,
    <OrderFilter
      clearFilters={clearFilters}
      gridConfig={gridConfig}
      clearReports={clearReports}
    />,
    <VerticalSeparator />,
    <Report
      selectOption={onReportChange}
      ref={reportFilterValue}
      selectedKey={pill?.key}
      reportAnalyticsLabel={analyticsCategories.report}
      reportOptions={reportOptions}
      gridConfig={gridConfig}
    />,
    <VerticalSeparator />,
    ...(settings && proactiveMessagingFlag
      ? [
          <Settings settings={settings} gridConfig={gridConfig} />,
          <VerticalSeparator />,
        ]
      : []),
    <OrderExport gridConfig={gridConfig} />,
  ];
  const leftComponents = [
    <OrderTrackingGridPagination
      ref={customPaginationRef}
      onQueryChanged={onQueryChanged}
      disabled={isLoading}
      paginationAnalyticsLabel={analyticsCategories.pagination}
      paginationLabels={paginationLabels}
    />,
  ];

  useEffect(() => {
    if (reportFilterValue.current.value) {
      const selectedReport = reportOptions.find(
        (option) => option.key === reportFilterValue.current.value
      );

      if (selectedReport) {
        setPill({
          key: selectedReport.key,
          label: selectedReport.label,
        });
      } else {
        setPill(null);
      }
    } else {
      setPill(null);
    }
  }, [reportFilterValue.current.value]);

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
