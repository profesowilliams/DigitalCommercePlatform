import { usGet } from '../../../../../utils/api';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  calcSecondLevelSorting,
  isFirstTimeSortParameters,
  isRepeatedSortAction,
  isSameFilterRepeated,
  mapStrucToUrlStr,
  urlStrToMapStruc,
  compareSort,
} from '../../RenewalsGrid/utils/renewalUtils';

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
  reportValue = null
) => {
  const mapUrl = urlStrToMapStruc(url + '?PageSize=25');
  const { createdFrom, createdTo } = filtersRefs;
  const fromRef = createdFrom?.current;
  const toRef = createdTo?.current;
  if (reportValue) {
    mapUrl.set('reportName', reportValue);
  } else if (fromRef && toRef) {
    mapUrl.set('createdFrom', fromRef);
    mapUrl.set('createdTo', toRef);
  } else {
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  }

  try {
    const result = await usGet(mapStrucToUrlStr(mapUrl));
    return result;
  } catch (error) {
    console.error('error on orders count >>', error);
  }
};

export async function fetchReport(reportUrl, reportName, pagination) {
  const mapUrl = urlStrToMapStruc(reportUrl + '?PageNumber=1');
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

export async function fetchData(config) {
  const {
    request,
    hasSortChanged,
    searchCriteria,
    customPaginationRef,
    previousSortChanged,
    onFiltersClear,
    firstAPICall,
    onSearchAction,
    optionFieldsRef,
    previousFilter,
    defaultSearchDateRange,
    filtersRefs,
  } = config;

  const { url } = request;
  const mapUrl = urlStrToMapStruc(url);

  const isFirstAPICall = firstAPICall.current === true;
  console.log('IS FIRST API CALL', isFirstAPICall);
  if (defaultSearchDateRange) {
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  }

  if (onSearchAction) {
    mapUrl.delete('createdFrom');
    mapUrl.delete('createdTo');
  }

  Object.keys(filtersRefs).map((filter) => {
    if (!['status', 'type'].includes(filter)) {
      const filterValue = filtersRefs[filter]?.current;
      filterValue && mapUrl.set(filter, filterValue);
    } else if (filter === 'customFilterRef') {
      filtersRefs[filter].current?.map((ref) => {
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
      mapUrl.set(
        'SortBy',
        sortData[0].colId === 'reseller' ? 'CustomerPO' : sortData[0].colId
      );
    }

    const secondLevelSort = calcSecondLevelSorting(sortData);

    if (secondLevelSort && !secondLevelSort.includes('undefined')) {
      mapUrl.set('SortBySecondLevel', secondLevelSort);

      if (secondLevelSort.includes('renewedduration')) {
        const renewedWithSupport = secondLevelSort.replace(
          'renewedduration',
          'support'
        );
        mapUrl.set('SortBySecondLevelComposite', renewedWithSupport);
      }
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

    if (customPaginationRef.current?.pageNumber !== 1 && onSearchAction) {
      mapUrl.set('PageNumber', 1);
    }
  } else {
    if (onSearchAction) {
      mapUrl.set('PageNumber', 1);
    }
  }

  if (onFiltersClear) {
    mapUrl.set('PageNumber', 1);
  }

  const { sortData } = hasSortChanged.current || {};
  const sortBy = sortData?.map(
    (c) => `${c.colId === 'reseller' ? 'CustomerPO' : c.colId}:${c.sort ?? ''}`
  );
  const params = { ...optionFieldsRef.current, sortBy };

  const isSameFilter = isSameFilterRepeated(previousFilter.current, params);
  if (!isSameFilter) {
    params.PageNumber = 1;
  }

  const filtersStatusAndType =
    (filtersRefs.type.current ?? '') + (filtersRefs.status.current ?? '');

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

export function hasLocalStorageData(key) {
  return localStorage.getItem(key) !== null;
}

export function getLocalStorageData(key) {
  return hasLocalStorageData(key) && JSON.parse(localStorage.getItem(key));
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

export const getFilterFlyoutPredefined = (filterLabels) => [
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
    filterOptionList: [
      {
        id: 1,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.open),
        filterOptionKey: 'Open',
        group: 'status',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.investigation),
        filterOptionKey: 'Investigation',
        group: 'status',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.shipping),
        filterOptionKey: 'Shipping',
        group: 'status',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.reject),
        filterOptionKey: 'Reject',
        group: 'status',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.complete),
        filterOptionKey: 'Complete',
        group: 'status',
      },
      {
        id: 6,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.cancelled),
        filterOptionKey: 'Cancelled',
        group: 'status',
      },
      {
        id: 7,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.onHold),
        filterOptionKey: 'OnHold',
        group: 'status',
      },
      {
        id: 8,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.shipped),
        filterOptionKey: 'Shipped',
        group: 'status',
      },
      {
        id: 9,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.inProcess),
        filterOptionKey: 'InProcess',
        group: 'status',
      },
    ],
    open: false,
  },
  {
    id: 3,
    accordionLabel: getDictionaryValueOrKey(filterLabels.orderType),
    filterField: 'order',
    group: 'order',
    open: false,
    filterOptionList: [
      {
        id: 1,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.ediOrXml),
        filterOptionKey: 'ZZED',
        group: 'type',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.inTouch),
        filterOptionKey: 'ZZCC&type=ZZIT',
        group: 'type',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.licensing),
        filterOptionKey: 'ZZSL',
        group: 'type',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.manual),
        filterOptionKey: 'ZZCT&type=ZZOR&type=ZZPB',
        group: 'type',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(filterLabels.thirdParty),
        filterOptionKey: 'ZZSB',
        group: 'type',
      },
    ],
  },
];

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
  ];};
