import { usGet } from '../../../../../utils/api';
import {
  getDictionaryValueOrKey,
  setDefaultSearchDateRange,
} from '../../../../../utils/utils';
import {
  isFirstTimeSortParameters,
  isRepeatedSortAction,
  isSameFilterRepeated,
  mapStrucToUrlStr,
  urlStrToMapStruc,
  compareSort,
  getLocalStorageData,
} from './gridUtils';
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { getAdvancedSearchNRFAnalyticsGoogle, getReportsNRFAnalyticsGoogle, getSearchNRFAnalyticsGoogle, pushDataLayerGoogle } from './analyticsUtils';

export const addDefaultDateRangeToUrl = (url, defaultDateRange) => {
  const searchParams = new URLSearchParams(defaultDateRange);
  if (defaultDateRange) {
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }
  }
};

const filtersDateGroup = [
  'createdFrom',
  'createdTo',
  'invoiceDateFrom',
  'invoiceDateTo',
  'shippedDateFrom',
  'shippedDateTo',
];

export const fetchOrdersCount = async (
  url,
  defaultSearchDateRange,
  filtersRefs,
  reportValue = null,
  searchCriteria
) => {
  const requestUrl = new URL(url);
  const dateFilters = Object.entries(filtersRefs?.current).filter(
    (entry) => filtersDateGroup.includes(entry[0]) && Boolean(entry[1])
  );

  if (reportValue) {
    requestUrl.searchParams.set('reportName', reportValue);
  } else if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    requestUrl.searchParams.set(field, value);
    const isSearchForExactId = value.length === 10;
    if (!isSearchForExactId) {
      addDefaultDateRangeToUrl(requestUrl, setDefaultSearchDateRange(90));
    }
  } else {
    addDefaultDateRangeToUrl(requestUrl, defaultSearchDateRange);
  }
  if (dateFilters.length > 0) {
    requestUrl.searchParams.delete('createdFrom');
    requestUrl.searchParams.delete('createdTo');
    dateFilters.forEach((filter) =>
      requestUrl.searchParams.set(filter[0], filter[1])
    );
  } else if (filtersRefs.current.type || filtersRefs.current.status) {
    addDefaultDateRangeToUrl(requestUrl, setDefaultSearchDateRange(90));
  }
  const filtersStatusAndType =
    (filtersRefs.current.type ?? '') + (filtersRefs.current.status ?? '');
  try {
    const result = await usGet(requestUrl.href + filtersStatusAndType);
    return result;
  } catch (error) {
    console.error('error on orders count >>', error);
    return {
      error: { isError: true },
    };
  }
};

export async function fetchReport(
  reportUrl,
  reportName,
  pagination,
  sort,
  isOnSearchAction
) {
  const mapUrl = urlStrToMapStruc(reportUrl + '?ReportName=' + reportName);
  mapUrl.set('PageNumber', pagination.current.pageNumber);

  if (isOnSearchAction) {
    mapUrl.set('PageNumber', 1);
  }

  if (sort?.current?.sortData?.[0]) {
    const { sortData } = sort.current;
    mapUrl.set('SortDirection', sortData[0].sort);
    const sortBy = sortSwap(sortData[0].colId);
    mapUrl.set('SortBy', sortBy);
  }
  const finalUrl = mapStrucToUrlStr(mapUrl);

  try {
    const result = await usGet(finalUrl);
    if (
      !result?.content?.totalItems ||
      result?.isError
    ) {
      if (reportValue) {
        pushDataLayerGoogle(getReportsNRFAnalyticsGoogle(reportValue));
      }
    }
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking grid >>', error);
  }
}

const sortSwap = (swapValue) => {
  switch (swapValue) {
    case 'reseller':
      return 'CustomerPO';
    case 'shipTo.name':
      return 'ShipTo';
    default:
      return swapValue;
  }
};

export async function fetchData(config) {
  const {
    request,
    hasSortChanged,
    searchCriteria,
    customPaginationRef,
    previousSortChanged,
    firstAPICall,
    isOnSearchAction,
    previousFilter,
    defaultSearchDateRange,
    filtersRefs,
  } = config;

  const { url } = request;
  const requestUrl = new URL(url);
  const isFirstAPICall = firstAPICall.current === true;

  if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    const isSearchForExactId = field === 'Id' && value.length === 10;
    if (isSearchForExactId) {
      requestUrl.searchParams.delete('createdFrom');
      requestUrl.searchParams.delete('createdTo');
    } else {
      addDefaultDateRangeToUrl(requestUrl, setDefaultSearchDateRange(90));
    }
  } else if (defaultSearchDateRange) {
    addDefaultDateRangeToUrl(requestUrl, defaultSearchDateRange);
  }
  const dateFilters = Object.entries(filtersRefs?.current).filter(
    (entry) => filtersDateGroup.includes(entry[0]) && Boolean(entry[1])
  );
  if (dateFilters.length !== 0) {
    requestUrl.searchParams.delete('createdFrom');
    requestUrl.searchParams.delete('createdTo');
  }
  Object.keys(filtersRefs.current).map((filter) => {
    if (!['status', 'type'].includes(filter)) {
      const filterValue = filtersRefs.current[filter];
      filterValue && requestUrl.searchParams.set(filter, filterValue);
    } else if (filter === 'customFilterRef') {
      filtersRefs.current[filter].map((ref) => {
        ref?.filterOptionList?.map((option) => {
          option?.checked &&
            requestUrl.searchParams.appends(
              option.filterOptionLabel,
              option.filterOptionKey
            );
        });
      });
    }
  });

  if (hasSortChanged.current) {
    const { sortData } = hasSortChanged.current;

    if (sortData[0]) {
      requestUrl.searchParams.set('SortDirection', sortData[0].sort);
      const sortBy = sortSwap(sortData[0].colId);
      requestUrl.searchParams.set('SortBy', sortBy);
    }

    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const isEqual = isRepeatedSortAction(
      previousSortChanged.current?.sortData,
      hasSortChanged.current?.sortData
    );
    const pageNumber = customPaginationRef.current?.pageNumber;

    if (pageNumber !== 1 && !isDefaultSort && !isFirstAPICall) {
      if (!isEqual) requestUrl.searchParams.set('PageNumber', 1);
    }
  }
  if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    requestUrl.searchParams.set(field, value);
  }
  if (isOnSearchAction.current) {
    requestUrl.searchParams.set('PageNumber', 1);
  }
  const { sortData } = hasSortChanged.current || {};
  const sortBy = sortData?.map((c) => `${sortSwap(c.colId)}:${c.sort ?? ''}`);
  const params = { sortBy };

  const isSameFilter = isSameFilterRepeated(previousFilter.current, params);
  if (!isSameFilter) {
    params.PageNumber = 1;
  }
  if (
    dateFilters.length === 0 &&
    (filtersRefs.current.type || filtersRefs.current.status)
  ) {
    addDefaultDateRangeToUrl(requestUrl, setDefaultSearchDateRange(90));
  }

  const filtersStatusAndType =
    (filtersRefs.current.type ?? '') + (filtersRefs.current.status ?? '');

  const filterUrl = requestUrl.href + filtersStatusAndType;
  previousSortChanged.current = hasSortChanged.current;
  firstAPICall.current = false;

  try {
    const result = await usGet(filterUrl, params);
    if(!result?.content?.totalItems ||
      result?.isError
    ) {
    if (searchCriteria.current?.field) {
      pushDataLayerGoogle(getSearchNRFAnalyticsGoogle());
    }
    if (filtersStatusAndType !== '' || dateFilters.length > 0) {
      pushDataLayerGoogle(getAdvancedSearchNRFAnalyticsGoogle());
    }
  }
    previousFilter.current = { ...params };
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking grid >>', error);
  }
}

export function setPaginationData(response, pageNumber, pageSize = 25) {
  const pageCount = Math.ceil(response.totalItems / pageSize);

  return {
    currentResultsInPage: pageSize,
    totalCounter: response.totalItems,
    pageCount,
    pageNumber: parseInt(pageNumber) || 1,
  };
}

export function addCurrentPageNumber(customPaginationRef, request) {
  const INITIAL_PAGE = 1;
  const urlMap = urlStrToMapStruc(request.url);
  const pageNumber =
    customPaginationRef.current?.pageNumber ||
    INITIAL_PAGE; /** to take care of 0 value */
  urlMap.set('PageNumber', pageNumber);
  return mapStrucToUrlStr(urlMap);
}

export const getDateRangeLabel = (startDate, endDate, shortDateFormat) => {
  if (startDate && endDate) {
    const startDateFormatted = startDate.format(
      getDictionaryValueOrKey(shortDateFormat)
    );
    const endDateFormatted = endDate.format(
      getDictionaryValueOrKey(shortDateFormat)
    );

    return `${startDateFormatted} - ${endDateFormatted}`;
  } else {
    return '';
  }
};
export { compareSort };

export const getFilterFlyoutPredefined = (filterLabels, refinements) => {
  const statuses = refinements?.orderStatuses || [];
  const types = refinements?.orderTypes || [];

  return [
    {
      id: 1,
      accordionLabel: getDictionaryValueOrKey(filterLabels.dateRange),
      filterField: 'date',
      group: 'date',
      open: false,
    },
    {
      id: 2,
      accordionLabel: getDictionaryValueOrKey(filterLabels.orderStatus),
      filterField: 'order',
      group: 'order',
      filterOptionList: statuses.map((element) => ({
        id: element.status,
        filterOptionLabel: element.statusText,
        filterOptionKey: element.status,
        group: 'status',
      })),
      open: false,
    },
    {
      id: 3,
      accordionLabel: getDictionaryValueOrKey(filterLabels.orderType),
      filterField: 'order',
      group: 'order',
      open: false,
      filterOptionList: types.map((element) => ({
        id: element.type,
        filterOptionLabel: element.typeText,
        filterOptionKey: element.type,
        group: 'type',
      })),
    },
  ];
};

export const getFilterFlyoutCustomized = (
  dateOptionsList,
  filterListValues,
  startIndex = 0
) => {
  let customizedFilters = [];
  if (dateOptionsList) {
    dateOptionsList.map((date, index) =>
      customizedFilters.push({
        id: index + startIndex,
        accordionLabel: date.label,
        filterField: date.key,
        group: 'customDate',
        open: false,
        startDate: null,
        endDate: null,
        dataRangeLabel: null,
      })
    );
  }
  if (filterListValues) {
    const customFilterIndex =
      startIndex + (dateOptionsList ? dateOptionsList.length : 0);

    filterListValues.map((filter, index) =>
      customizedFilters.push({
        id: index + customFilterIndex,
        accordionLabel: filter.accordionLabel,
        filterField: filter.filterField,
        group: 'custom',
        filterOptionList: filter.filterOptionsValues?.map((value, index) => ({
          id: index,
          filterOptionLabel: value.filterOptionLabel,
          filterOptionKey: value.filterOptionKey,
          checked: false,
        })),
      })
    );
  }
  return customizedFilters;
};

export const getPredefinedSearchOptionsList = (aemData) => {
  const { orderNo, dnoteNo, invoiceNo, poNo, serialNo } = aemData || {};
  return [
    {
      searchLabel: getDictionaryValueOrKey(orderNo),
      param: 'id',
      searchKey: 'Id',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(dnoteNo),
      param: 'deliverynote',
      searchKey: 'DeliveryNote',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(invoiceNo),
      param: 'invoiceid',
      searchKey: 'InvoiceId',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(poNo),
      param: 'customerpo',
      searchKey: 'CustomerPO',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(serialNo),
      param: 'serialno',
      searchKey: 'SerialNo',
      showIfIsHouseAccount: false,
    },
  ];
};

export const getInitialFiltersDataFromLS = () => {
  const data = getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY);
  if (!data){
    return {
      createdFrom: null,
      createdTo: null,
      shippedDateFrom: null,
      shippedDateTo: null,
      invoiceDateFrom: null,
      invoiceDateTo: null,
      type: null,
      status: null,
    };
  }
  const dateType = data.dates[0]?.dateType;
  return {
    dateType: dateType,
    createdFrom: dateType === 'orderDate' ? data.dates[0]?.createdFrom : null,
    createdTo: dateType === 'orderDate' ? data.dates[0]?.createdTo : null,
    shippedDateFrom:
      dateType === 'shipDate' ? data.dates[0]?.createdFrom : null,
    shippedDateTo: dateType === 'shipDate' ? data.dates[0]?.createdTo : null,
    invoiceDateFrom:
      dateType === 'invoiceDate' ? data.dates[0]?.createdFrom : null,
    invoiceDateTo: dateType === 'invoiceDate' ? data.dates[0]?.createdTo : null,
    status: data.statuses.map((status) => `&status=${status.id}`).join(''),
    type: data.types.map((type) => `&type=${type.id}`).join(''),
  };
};
