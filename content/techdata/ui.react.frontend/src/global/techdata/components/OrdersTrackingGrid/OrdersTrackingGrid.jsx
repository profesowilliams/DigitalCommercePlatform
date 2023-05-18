import React, { useEffect, useRef, useState } from 'react';
import {
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
  SEARCH_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_KEY_USER_DATA,
} from '../../../../utils/constants';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import BaseGridPagination from '../BaseGrid/Pagination/BaseGridPagination';
import {
  getLocalStorageData,
  hasLocalStorageData,
  removeLocalStorageData,
  isFromRenewalDetailsPage,
  mapServiceData,
  setLocalStorageData,
  isFirstTimeSortParameters,
  updateQueryString,
} from '../RenewalsGrid/utils/renewalUtils';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import OrderExport from './Export/OrderExport';
import OrderFilter from './Filter/OrderFilter';
import Report from './Report/Report';
import Pill from '../Widgets/Pill';
import { useOrderTrackingStore } from './store/OrderTrackingStore';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import {
  fetchData,
  fetchOrdersCount,
  fetchReport,
  setPaginationData,
  addCurrentPageNumber,
  compareSort,
  getFilterFlyoutPredefined,
} from './utils/orderTrackingUtils';
import { useMultiFilterSelected } from '../RenewalFilter/hooks/useFilteringState';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';
import ExportFlyout from '../ExportFlyout/ExportFlyout';
import ToolTip from '../BaseGrid/ToolTip';
import OrderSearch from './Search/OrderSearch';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import { useStore } from '../../../../utils/useStore';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import { pushDataLayer, getSortAnalytics } from '../Analytics/analytics';
import { setDefaultSearchDateRange } from '../../../../utils/utils';
import OrderFilterFlyout from './Filter/OrderFilterFlyout';

function OrdersTrackingGrid(props) {
  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();
  const previousFilter = useRef(false);
  const hasSortChanged = useRef(false);
  const previousSortChanged = useRef(false);
  const searchCriteria = useRef({ field: '', value: '' });
  const reportFilterValue = useRef({ value: '' });
  const customPaginationRef = useRef();
  const createdFrom = useRef();
  const createdTo = useRef();
  const shippedDateFrom = useRef();
  const shippedDateTo = useRef();
  const invoiceDateFrom = useRef();
  const invoiceDateTo = useRef();
  const type = useRef();
  const status = useRef();
  const filtersRefs = {
    createdFrom,
    createdTo,
    shippedDateFrom,
    shippedDateTo,
    invoiceDateFrom,
    invoiceDateTo,
    type,
    status,
  };
  const effects = useOrderTrackingStore((st) => st.effects);
  const category = useOrderTrackingStore((state) => state.analyticsCategory);
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  const { onAfterGridInit, onQueryChanged, onOrderQueryChanged } =
    useExtendGridOperations(useOrderTrackingStore);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const hasAIORights = userData?.roleList?.some(
    (role) => role.entitlement === 'AIO'
  );
  const [isLoading, setIsLoading] = useState(true);

  const componentProp = JSON.parse(props.componentProp);
  const [pill, setPill] = useState(null);
  const formattedDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const [dateRange, setDateRange] = useState(formattedDateRange);

  const { searchOptionsList, icons, reportPillLabel } = componentProp;
  const gridApiRef = useRef();
  const firstAPICall = useRef(true);
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };

  const {
    setToolTipData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
  } = effects;

  const toolTipData = useOrderTrackingStore((st) => st.toolTipData);

  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;
  let options = {
    defaultSortingColumnKey: 'created',
    defaultSortingDirection: 'desc',
  };

  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const columnState = {
      state: isDefaultSort
        ? [
            {
              colId: dueDateKey,
              sort: dueDateDir,
            },
          ]
        : [...hasSortChanged.current.sortData],
      defaultState: { sort: null },
    };
    config.columnApi.applyColumnState({ ...columnState });
  };

  const getPaginationValue = (response, ordersCountResponse) => {
    const paginationValue = setPaginationData(
      ordersCountResponse?.data?.content,
      response?.data?.content?.pageNumber,
      gridConfig.itemsPerPage
    );
    return paginationValue;
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
      defaultSearchDateRange: dateRange,
      filtersRefs,
    };
    request.url = addCurrentPageNumber(customPaginationRef, request);
    const ordersReportUrl = new URL(componentProp.ordersReportEndpoint);
    const ordersReportCountUrl = new URL(
      componentProp.ordersReportCountEndpoint
    );
    const ordersCountUrl = new URL(componentProp.ordersCountEndpoint);
    const ordersCountResponse = await fetchOrdersCount(
      reportFilterValue.current?.value
        ? ordersReportCountUrl.href
        : ordersCountUrl.href,
      dateRange,
      filtersRefs,
      reportFilterValue.current?.value
    );
    const response = reportFilterValue.current?.value
      ? await fetchReport(ordersReportUrl, reportFilterValue.current.value)
      : await fetchData(queryOperations);

    const mappedResponse = mapServiceData(response);
    const paginationValue = getPaginationValue(
      mappedResponse,
      ordersCountResponse
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
    const currentSortState = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
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
    if (
      sortingEventFilter.length === 1 &&
      !compareSort(currentSortState, hasSortChanged.current)
    ) {
      pushDataLayer(getSortAnalytics(category, sortedModel));
    }
  };

  const removeDefaultDateRange = () => {
    setDateRange(null);
  };

  function cellMouseOver(event) {
    const offset = 2;
    const val = tootltipVal(event);
    setToolTipData({
      value: val,
      x: event?.event?.pageX + offset,
      y: event?.event?.pageY + offset,
      show: val ? true : false,
    });
  }

  function cellMouseOut() {
    setToolTipData({
      value: '',
      x: 0,
      y: 0,
      show: false,
    });
  }

  function tootltipVal(event) {
    switch (event.colDef.headerName) {
      case 'PO Nº':
        return event.value;
      case 'Ship to':
        return event.value;
      default:
        return null;
    }
  }

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

  const doesMatchById = (searchId, orderId) => searchId === orderId;

  const doesMatchByInvoiceId = (searchInvoice, orderInvoices) =>
    orderInvoices.some((invoice) => invoice.id == searchInvoice);

  const doesCurrentSearchMatchResult = (result) => {
    if (searchCriteria.current.field === 'Id') {
      return doesMatchById(searchCriteria.current.value, result.id);
    } else if (searchCriteria.current.field === 'invoiceId') {
      return doesMatchByInvoiceId(
        searchCriteria.current.value,
        result.invoices
      );
    }
  };

  const onDataLoad = (response) => {
    if (response.length >= 1 && doesCurrentSearchMatchResult(response[0])) {
      removeLocalStorageData(SEARCH_LOCAL_STORAGE_KEY);
      window.location.href = `${componentProp.detailUrl}.html?id=${response[0].id}`;
    }
    setIsLoading(false);
  };

  const addCurrencyToTotalColumn = (list) => {
    const userDataLS = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA))
      : null;
    const currentUserData =
      isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : userDataLS;

    const activeCustomer = currentUserData?.activeCustomer;
    const defaultCurrency = activeCustomer?.defaultCurrency || '';
    return list.map((el) => {
      if (el.columnKey === 'priceFormatted') {
        const newColumn = el;
        newColumn.columnLabel = `Total (${defaultCurrency})`;
        return newColumn;
      } else {
        return el;
      }
    });
  };

  const downloadFileBlob = async (flyoutType, orderId) => {
    try {
      const url = componentProp.ordersDownloadDocumentsEndpoint || 'nourl';
      const mapIds = orderId.map((ids) => `&id=${ids}`).join('');
      const downloadOrderInvoicesUrl = url + `?Type=${flyoutType}${mapIds}`;
      const name = `${flyoutType}.zip`;
      await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, name, {
        redirect: false,
      });
    } catch (error) {
      console.error('Error', error);
    }
  };

  function downloadAllFile(flyoutType, orderId) {
    return downloadFileBlob(flyoutType, orderId);
  }

  async function openFilePdf(flyoutType, orderId) {
    const url = componentProp.ordersDownloadDocumentsEndpoint || 'nourl';
    const singleDownloadUrl = url + `?Type=${flyoutType}&id=${orderId[0]}`;
    const name = `${orderId[0]}.pdf`;
    await requestFileBlobWithoutModal(singleDownloadUrl, name, {
      redirect: true,
    });
  }

  useEffect(() => {
    if (
      hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
    setFilterList(
      getFilterFlyoutPredefined(
        gridConfig.orderFilterTypes,
        gridConfig.orderFilterStatus
      )
    ); //componentProp?.filterListItems - function should connect both filters
    setUserData();
  }, []);
  console.log('OT userData', userData);
  return (
    <div className="cmp-order-tracking-grid">
      <BaseGridHeader
        leftComponents={[
          <BaseGridPagination
            ref={customPaginationRef}
            store={useOrderTrackingStore}
            onQueryChanged={onQueryChanged}
            disabled={isLoading}
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
            onQueryChanged={onSearchChange}
            ref={searchCriteria}
            store={useOrderTrackingStore}
            hideLabel={true}
          />,
          <VerticalSeparator />,
          <OrderFilter />,
          <VerticalSeparator />,
          <Report
            selectOption={onReportChange}
            ref={reportFilterValue}
            selectedKey={pill?.key}
          />,
          <VerticalSeparator />,
          <OrderExport />,
        ]}
      />
      <BaseGrid
        columnList={addCurrencyToTotalColumn(componentProp.columnList)}
        definitions={ordersTrackingDefinition(
          componentProp,
          openFilePdf,
          hasAIORights
        )}
        config={gridConfig}
        options={options}
        gridConfig={gridConfig}
        defaultSearchDateRange={dateRange}
        requestInterceptor={customRequestInterceptor}
        mapServiceData={mapServiceData}
        onSortChanged={onSortChanged}
        onAfterGridInit={_onAfterGridInit}
        onDataLoad={onDataLoad}
        onCellMouseOver={cellMouseOver}
        onCellMouseOut={cellMouseOut}
      />
      <ToolTip toolTipData={toolTipData} />
      <div className="cmp-renewals__pagination--bottom">
        <BaseGridPagination
          ref={customPaginationRef}
          store={useOrderTrackingStore}
          onQueryChanged={onQueryChanged}
          disabled={isLoading}
        />
      </div>
      <DNotesFlyout
        store={useOrderTrackingStore}
        dNotesFlyout={gridConfig.dNotesFlyout}
        dNoteColumnList={gridConfig.dNoteColumnList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        downloadAllFile={(flyoutType, orderId) =>
          downloadAllFile(flyoutType, orderId)
        }
        openFilePdf={(flyoutType, orderId) => openFilePdf(flyoutType, orderId)}
      />
      <InvoicesFlyout
        store={useOrderTrackingStore}
        invoicesFlyout={gridConfig.invoicesFlyout}
        invoicesColumnList={gridConfig.invoicesColumnList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        downloadAllFile={(flyoutType, orderId) =>
          downloadAllFile(flyoutType, orderId)
        }
        openFilePdf={(flyoutType, orderId) => openFilePdf(flyoutType, orderId)}
        hasAIORights={hasAIORights}
      />
      <ExportFlyout
        store={useOrderTrackingStore}
        exportFlyout={gridConfig.exportFlyout}
        exportOptionsList={gridConfig.exportOptionsList}
        exportSecondaryOptionsList={gridConfig.exportSecondaryOptionsList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
      />
      <OrderFilterFlyout
        onQueryChanged={onQueryChanged}
        filtersRefs={filtersRefs}
        isTDSynnex={isTDSynnex}
        aemData={componentProp}
      />
    </div>
  );
}

export default OrdersTrackingGrid;
