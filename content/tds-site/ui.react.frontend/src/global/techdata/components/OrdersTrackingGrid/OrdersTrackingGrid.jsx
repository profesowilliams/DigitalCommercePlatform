import React, { useEffect, useRef, useState } from 'react';
import {
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
} from '../../../../utils/constants';
import {
  requestFileBlobWithoutModal,
  setDefaultSearchDateRange,
} from '../../../../utils/utils';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import ToolTip from '../BaseGrid/ToolTip';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';
import { useMultiFilterSelected } from '../RenewalFilter/hooks/useFilteringState';
import {
  getLocalStorageData,
  hasLocalStorageData,
  isFirstTimeSortParameters,
  isFromRenewalDetailsPage,
  mapServiceData,
  removeLocalStorageData,
  setLocalStorageData,
  updateQueryString,
} from '../RenewalsGrid/utils/renewalUtils';
import Pill from '../Widgets/Pill';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import OrderExport from './Export/OrderExport';
import OrderFilter from './Filter/OrderFilter';
import OrderFilterFlyout from './Filter/OrderFilterFlyout';
import Report from './Report/Report';
import OrderSearch from './Search/OrderSearch';
import { useOrderTrackingStore } from './store/OrderTrackingStore';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import AccessPermissionsNeeded from './../AccessPermissionsNeeded/AccessPermissionsNeeded';
import {
  addCurrentPageNumber,
  compareSort,
  fetchData,
  fetchOrdersCount,
  fetchReport,
  getFilterFlyoutPredefined,
  getFilterFlyoutCustomized,
  setPaginationData,
} from './utils/orderTrackingUtils';
import Toaster from '../Widgets/Toaster';
import {
  getSortAnalyticsGoogle,
  pushDataLayerGoogle,
} from './utils/analyticsUtils';
import OrderTrackingGridPagination from './Pagination/OrderTrackingGridPagination';

function OrdersTrackingGrid(props) {
  const [userData, setUserData] = useState(null);
  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();
  const [columnDefinition, setColumnDefinition] = useState();
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
  const customFilterRef = useRef();
  const filtersRefs = {
    createdFrom,
    createdTo,
    shippedDateFrom,
    shippedDateTo,
    invoiceDateFrom,
    invoiceDateTo,
    type,
    status,
    customFilterRef,
  };
  const effects = useOrderTrackingStore((st) => st.effects);
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  const { onAfterGridInit, onQueryChanged, onOrderQueryChanged } =
    useExtendGridOperations(useOrderTrackingStore);

  const hasAIORights = userData?.roleList?.some(
    (role) => role.entitlement === 'AIO'
  );
  const hasCanViewOrdersRights = userData?.roleList?.some(
    (role) => role.entitlement === 'CanViewOrders'
  );
  const hasOrderTrackingRights = userData?.roleList?.some(
    (role) => role.entitlement === 'OrderTracking'
  );
  const [isLoading, setIsLoading] = useState(true);

  const componentProp = JSON.parse(props.componentProp);
  const [pill, setPill] = useState(null);
  const formattedDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const [dateRange, setDateRange] = useState(formattedDateRange);

  const {
    searchOptionsList,
    icons,
    reportPillLabel,
    filterListValues,
    dateOptionsList,
    filterLabels,
    noAccessProps,
    analyticsCategories,
    paginationLabels,
  } = componentProp;
  const gridApiRef = useRef();
  const firstAPICall = useRef(true);
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };

  const predefined = getFilterFlyoutPredefined(filterLabels);

  const customized = getFilterFlyoutCustomized(
    dateOptionsList,
    filterListValues,
    predefined.length + 1
  );

  const {
    setToolTipData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
    setCustomFiltersChecked,
    setDateType,
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
      pushDataLayerGoogle(
        getSortAnalyticsGoogle(analyticsCategories.sort, sortedModel)
      );
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

  const doesMatchByDeliveryNote = (searchDeliveryNote, deliveryNotes) =>
    deliveryNotes.some((deliveryNote) => deliveryNote.id == searchDeliveryNote);

  const doesCurrentSearchMatchResult = (result) => {
    if (searchCriteria.current.field === 'Id') {
      return doesMatchById(searchCriteria.current.value, result.id);
    } else if (searchCriteria.current.field === 'InvoiceId') {
      return doesMatchByInvoiceId(
        searchCriteria.current.value,
        result.invoices
      );
    } else if (searchCriteria.current.field === 'DeliveryNote') {
      return doesMatchByDeliveryNote(
        searchCriteria.current.value,
        result.deliveryNotes
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
    const activeCustomer = userData?.activeCustomer;
    const defaultCurrency = activeCustomer?.defaultCurrency || '';

    return list.map((column) => {
      if (column.columnKey === 'priceFormatted') {
        column.columnLabel = `Total (${defaultCurrency})`;
        return column;
      }
      return column;
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

  function onCloseToaster() {
    closeAndCleanToaster();
  }
  const isLocalDevelopment = window.origin === 'http://localhost:8080';

  const hasAccess =
    hasCanViewOrdersRights || hasOrderTrackingRights || isLocalDevelopment;

  useEffect(() => {
    if (
      hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
    setFilterList([...predefined, ...customized]);
    setCustomFiltersChecked(customized);
    window.getSessionInfo &&
      window.getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
    setDateType(filterLabels.orderDateLabel);
  }, []);

  return (
    <>
      {(userData?.activeCustomer || isLocalDevelopment) && (
        <>
          {hasAccess ? (
            <div className="cmp-order-tracking-grid">
              <BaseGridHeader
                leftComponents={[
                  <OrderTrackingGridPagination
                    ref={customPaginationRef}
                    store={useOrderTrackingStore}
                    onQueryChanged={onQueryChanged}
                    disabled={isLoading}
                    paginationAnalyticsLabel={analyticsCategories.pagination}
                    resultsLabel={paginationLabels.results}
                    ofLabel={paginationLabels.of}
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
                <OrderTrackingGridPagination
                    ref={customPaginationRef}
                    store={useOrderTrackingStore}
                    onQueryChanged={onQueryChanged}
                    disabled={isLoading}
                    paginationAnalyticsLabel={analyticsCategories.pagination}
                    resultsLabel={paginationLabels.results}
                    ofLabel={paginationLabels.of}
                />
              </div>
              <DNotesFlyout
                store={useOrderTrackingStore}
                dNotesFlyout={gridConfig.dNotesFlyout}
                dNoteColumnList={gridConfig.dNoteColumnList}
                subheaderReference={document.querySelector(
                  '.subheader > div > div'
                )}
                isTDSynnex={isTDSynnex}
                downloadAllFile={(flyoutType, orderId) =>
                  downloadAllFile(flyoutType, orderId)
                }
                openFilePdf={(flyoutType, orderId) =>
                  openFilePdf(flyoutType, orderId)
                }
              />
              <InvoicesFlyout
                store={useOrderTrackingStore}
                invoicesFlyout={gridConfig.invoicesFlyout}
                invoicesColumnList={gridConfig.invoicesColumnList}
                subheaderReference={document.querySelector(
                  '.subheader > div > div'
                )}
                isTDSynnex={isTDSynnex}
                downloadAllFile={(flyoutType, orderId) =>
                  downloadAllFile(flyoutType, orderId)
                }
                openFilePdf={(flyoutType, orderId) =>
                  openFilePdf(flyoutType, orderId)
                }
                hasAIORights={hasAIORights}
              />
              <ExportFlyout
                store={useOrderTrackingStore}
                exportFlyout={gridConfig.exportFlyout}
                exportOptionsList={gridConfig.exportOptionsList}
                exportSecondaryOptionsList={
                  gridConfig.exportSecondaryOptionsList
                }
                subheaderReference={document.querySelector(
                  '.subheader > div > div'
                )}
                isTDSynnex={isTDSynnex}
                exportAnalyticsLabel={analyticsCategories.export}
              />
              <Toaster
                classname="toaster-modal-otg"
                onClose={onCloseToaster}
                store={useOrderTrackingStore}
                message={{
                  successSubmission: 'successSubmission',
                  failedSubmission: 'failedSubmission',
                }}
              />
              <OrderFilterFlyout
                onQueryChanged={onQueryChanged}
                filtersRefs={filtersRefs}
                isTDSynnex={isTDSynnex}
                filterLabels={filterLabels}
                analyticsCategories={analyticsCategories}
                subheaderReference={document.querySelector(
                  '.subheader > div > div'
                )}
              />
            </div>
          ) : (
            <AccessPermissionsNeeded noAccessProps={noAccessProps} />
          )}
        </>
      )}
    </>
  );
}
export default OrdersTrackingGrid;
