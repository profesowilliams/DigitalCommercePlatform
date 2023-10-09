import React, { cloneElement, useState, useEffect } from 'react';
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
}) {
  const [pill, setPill] = useState(null);

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

  const removeQueryParams = () => {
    const newURL = window.location.pathname;
    window.history.pushState({}, document.title, newURL);
  };

  const handleDeletePill = () => {
    removeQueryParams();
    setPill();
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
      reportAnalyticsLabel={analyticsCategories.report}
      reportOptions={reportOptions}
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
