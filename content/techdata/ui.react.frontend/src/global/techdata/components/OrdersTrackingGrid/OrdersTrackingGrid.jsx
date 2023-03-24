import React, { useEffect, useRef, useState } from 'react';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY, SORT_LOCAL_STORAGE_KEY } from '../../../../utils/constants';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import BaseGridPagination from '../BaseGrid/Pagination/BaseGridPagination';
import {
  addCurrentPageNumber,
  getLocalStorageData,
  hasLocalStorageData,
  isFromRenewalDetailsPage,
  mapServiceData,
  setPaginationData,
  updateQueryString,
} from '../RenewalsGrid/utils/renewalUtils';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import OrderExport from './Export/OrderExport';
import OrderFilter from './Filter/OrderFilter';
import Report from './Report/Report';
import Pill from '../Widgets/Pill';
import OrderSearch from '../BaseGrid/Search/Search';
import { useOrderTrackingStore } from './store/OrderTrackingStore';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import {
  fetchData,
  setDefaultSearchDateRange,
} from './utils/orderTrackingUtils';
import { ANALYTICS_TYPES } from '../../../../utils/dataLayerUtils';
import { useMultiFilterSelected } from '../RenewalFilter/hooks/useFilteringState';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';

function OrdersTrackingGrid(props) {
  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();
  const previousFilter = useRef(false);
  const hasSortChanged = useRef(false);
  const previousSortChanged = useRef(false);
  const searchCriteria = useRef({ field: '', value: '' });
  const reportFilterValue = useRef({ value: '' });
  const customPaginationRef = useRef();
  const effects = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore
  );
  const componentProp = JSON.parse(props.componentProp);
  const [pill, setPill] = useState(null);

  const {
    searchOptionsList,
    shopURL,
    icons,
    reportOptions,
    reportPillLabel,
    reportFilterKey,
  } = componentProp;
  const gridApiRef = useRef();
  const firstAPICall = useRef(true);
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };
  const defaultSearchDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const { setToolTipData, setCustomState, closeAndCleanToaster } = effects;

  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
  };

  const customRequestInterceptor = async (request) => {
    const gridApi = gridApiRef?.current?.api;
    const queryOperations = {
      hasSortChanged,
      isFilterDataPopulated,
      optionFieldsRef,
      customPaginationRef,
      componentProp,
      //onSearchAction,
      searchCriteria,
      previousFilter,
      request,
      previousSortChanged,
      //onFiltersClear,
      firstAPICall,
      //isPriceColumnClicked,
      gridApiRef,
      reportFilterValue,
      reportFilterKey,
    };
    request.url = addCurrentPageNumber(customPaginationRef, request);
    //const response = await request.get(request.url);
    const response = await fetchData(queryOperations);
    const mappedResponse = mapServiceData(response);
    const paginationValue = setPaginationData(
      mappedResponse?.data?.content,
      gridConfig.itemsPerPage
    );
    const responseContent = response?.data?.content;
    const pageNumber = responseContent?.pageNumber;
    if (responseContent?.pageCount === pageNumber)
      gridApi.paginationSetPageSize(responseContent?.items?.length);
    updateQueryString(pageNumber);
    setCustomState(
      { key: 'pagination', value: paginationValue },
      {
        key: ORDER_PAGINATION_LOCAL_STORAGE_KEY,
        saveToLocal: true,
      }
    );
    return mappedResponse;
  };

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList
      .filter((o) => !!o.sort)
      .map(({ colId, sort }) => ({ colId, sort }));
    const renewalPlanItem = sortedModel.find(
      (x) => x.colId === 'renewedduration'
    );
    if (renewalPlanItem) {
      sortedModel.push({ ...renewalPlanItem, colId: 'support' });
    }
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;
    setLocalStorageData(SORT_LOCAL_STORAGE_KEY, hasSortChanged.current);
    const sortingEventFilter = evt?.columnApi
      ?.getColumnState()
      .filter((val) => val.sort);
    if (sortingEventFilter.length === 1) {
      pushEvent(ANALYTICS_TYPES.events.click, {
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsTableInteraction,
        name: sortingEventFilter?.[0]?.colId,
      });
    }
  };

  const onReportChange = (option) => {
    setPill({ key: option.key, label: option.label });
    onQueryChanged();
  };

  const handleDeletePill = () => {
    setPill();
    onQueryChanged();
  };

  useEffect(() => {
    if (
      hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
  }, []);

  return (
    <div className="cmp-order-tracking-grid">
      <BaseGridHeader
        leftComponents={[
          <VerticalSeparator />,
          <BaseGridPagination
            ref={customPaginationRef}
            store={useOrderTrackingStore}
            onQueryChanged={onQueryChanged}
          />,
        ]}
        rightComponents={[
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
            options={searchOptionsList}
            onQueryChanged={onQueryChanged}
            ref={searchCriteria}
            store={useOrderTrackingStore}
            hideLabel={true}
          />,
          <VerticalSeparator />,
          <OrderFilter />,
          <VerticalSeparator />,
          ...(reportOptions.length
            ? [
                <Report
                  options={reportOptions}
                  selectOption={onReportChange}
                  ref={reportFilterValue}
                  selectedKey={pill?.key}
                />,
              ]
            : []),
          <VerticalSeparator />,
          <OrderExport />,
        ]}
      />
      <BaseGrid
        columnList={componentProp.columnList}
        definitions={ordersTrackingDefinition(componentProp)}
        config={gridConfig}
        gridConfig={gridConfig}
        defaultSearchDateRange={defaultSearchDateRange}
        requestInterceptor={customRequestInterceptor}
        mapServiceData={mapServiceData}
        onSortChanged={onSortChanged}
        onAfterGridInit={_onAfterGridInit}
      />
      <div className="cmp-renewals__pagination--bottom">
        <BaseGridPagination
          ref={customPaginationRef}
          store={useOrderTrackingStore}
          onQueryChanged={onQueryChanged}
        />
      </div>
      <DNotesFlyout
        store={useOrderTrackingStore}
        dNotesFlyout={gridConfig.dNotesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <InvoicesFlyout
        store={useOrderTrackingStore}
        invoicesFlyout={gridConfig.invoicesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
    </div>
  );
}

export default OrdersTrackingGrid;
