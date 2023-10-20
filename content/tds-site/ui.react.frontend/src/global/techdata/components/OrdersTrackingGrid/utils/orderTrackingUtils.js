import { usGet } from '../../../../../utils/api';
import {
  getDictionaryValueOrKey,
  setDefaultSearchDateRange,
} from '../../../../../utils/utils';
import {
  isFirstTimeSortParameters,
  calcSecondLevelSorting,
  isRepeatedSortAction,
  isSameFilterRepeated,
  mapStrucToUrlStr,
  urlStrToMapStruc,
  compareSort,
} from './gridUtils';

export const addDefaultDateRangeToUrl = (url, defaultDateRange) => {
  if (defaultDateRange) {
    const dateRange = urlStrToMapStruc(defaultDateRange).entries();
    url.set(...dateRange.next().value);
    url.set(...dateRange.next().value);
  }
};

export const fetchOrdersCount = async (
  url,
  defaultSearchDateRange,
  filtersRefs,
  reportValue = null,
  searchCriteria
) => {
  const mapUrl = urlStrToMapStruc(url + '?PageSize=25');
  const dateFilters = Object.entries(filtersRefs?.current).filter((entry) =>
    Boolean(entry[1])
  );

  if (reportValue) {
    mapUrl.set('reportName', reportValue);
  } else if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    mapUrl.set(field, value);
    addDefaultDateRangeToUrl(mapUrl, setDefaultSearchDateRange(90));
  } else {
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  }

  if (dateFilters.length > 0) {
    dateFilters.forEach((filter) => mapUrl.set(filter[0], filter[1]));
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  } 
  const filtersStatusAndType =
    (filtersRefs.current.type ?? '') + (filtersRefs.current.status ?? '');
  try {
    const result = await usGet(mapStrucToUrlStr(mapUrl) + filtersStatusAndType);
    return result;
  } catch (error) {
    console.error('error on orders count >>', error);
    return {
      error: { isError: true },
    };
  }
};

export async function fetchReport(reportUrl, reportName, pagination) {
  const mapUrl = urlStrToMapStruc(reportUrl + '?');
  mapUrl.set('ReportName', reportName);
  mapUrl.set('PageNumber', pagination.current.pageNumber);
  const finalUrl = mapStrucToUrlStr(mapUrl);

  try {
    const result = await usGet(finalUrl);
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
    filterDefaultDateRange = false,
  } = config;

  const { url } = request;
  const mapUrl = urlStrToMapStruc(url);

  const isFirstAPICall = firstAPICall.current === true;
  if (defaultSearchDateRange) {
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  }

  if (searchCriteria.current?.field) {
    addDefaultDateRangeToUrl(mapUrl, setDefaultSearchDateRange(90));
  }

  Object.keys(filtersRefs.current).map((filter) => {
    if (!['status', 'type'].includes(filter)) {
      const filterValue = filtersRefs.current[filter];
      filterValue && mapUrl.set(filter, filterValue);
    } else if (filter === 'customFilterRef') {
      filtersRefs.current[filter].map((ref) => {
        ref?.filterOptionList?.map((option) => {
          option?.checked &&
            mapUrl.set(option.filterOptionLabel, option.filterOptionKey);
        });
      });
    }
  });

  if (hasSortChanged.current) {
    const { sortData } = hasSortChanged.current;

    if (sortData[0]) {
      mapUrl.set('SortDirection', sortData[0].sort);
      const sortBy = sortSwap(sortData[0].colId);
      mapUrl.set('SortBy', sortBy);
    }

    const secondLevelSort = calcSecondLevelSorting(sortData);

    if (secondLevelSort && !secondLevelSort.includes('undefined')) {
      mapUrl.set('SortBySecondLevel', secondLevelSort);
    }

    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const isEqual = isRepeatedSortAction(
      previousSortChanged.current?.sortData,
      hasSortChanged.current?.sortData
    );
    const pageNumber = customPaginationRef.current?.pageNumber;

    if (pageNumber !== 1 && !isDefaultSort && !isFirstAPICall) {
      if (!isEqual) mapUrl.set('PageNumber', 1);
    }
  }
  if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    mapUrl.set(field, value);

    if (isOnSearchAction) {
      mapUrl.set('PageNumber', 1);
    }
  }

  const { sortData } = hasSortChanged.current || {};
  const sortBy = sortData?.map((c) => `${sortSwap(c.colId)}:${c.sort ?? ''}`);
  const params = { sortBy };

  const isSameFilter = isSameFilterRepeated(previousFilter.current, params);
  if (!isSameFilter) {
    params.PageNumber = 1;
  }

  if (filterDefaultDateRange) {
    const dateTo = new Date();
    const day = dateTo.getDate();
    const month = dateTo.getMonth();
    const year = dateTo.getFullYear();
    const today = `${year}-${month}-${day}`;
    mapUrl.set('createdFrom', fromDay);
    const dateFrom = dateTo.getDate() - 90;
    const dayFrom = dateFrom.getDate();
    const monthFrom = dateFrom.getMonth();
    const yearFrom = dateFrom.getFullYear();
    const fromDay = `${yearFrom}-${monthFrom}-${dayFrom}`;
    mapUrl.set('createdTo', today);
  }

  const filtersStatusAndType =
    (filtersRefs.current.type ?? '') + (filtersRefs.current.status ?? '');

  const filterUrl = mapStrucToUrlStr(mapUrl) + filtersStatusAndType;

  previousSortChanged.current = hasSortChanged.current;
  firstAPICall.current = false;

  try {
    const result = await usGet(filterUrl, params);
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

export const getDateRangeLabel = (startDate, endDate) => {
  if (startDate && endDate) {
    const shortStartDateMonth = startDate.format('MMMM').substring(0, 3);
    const startDateMonth = startDate.format('M');
    const startDateDay = startDate.format('D');

    const shortEndDateMonth = endDate.format('MMMM').substring(0, 3);
    const endDateMonth = endDate.format('M');
    const endDateDay = endDate.format('D');

    return startDateMonth === endDateMonth
      ? `${shortStartDateMonth} ${startDateDay}-${endDateDay}`
      : `${shortStartDateMonth} ${startDateDay}-${shortEndDateMonth} ${endDateDay}`;
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
      searchKey: 'Id',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(dnoteNo),
      searchKey: 'DeliveryNote',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(invoiceNo),
      searchKey: 'InvoiceId',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(poNo),
      searchKey: 'CustomerPO',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: getDictionaryValueOrKey(serialNo),
      searchKey: 'SerialNo',
      showIfIsHouseAccount: false,
    },
  ];
};
