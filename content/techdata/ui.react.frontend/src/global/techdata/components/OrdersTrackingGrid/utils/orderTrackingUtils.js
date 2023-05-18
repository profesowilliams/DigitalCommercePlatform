import { usGet } from '../../../../../utils/api';
import {
  formatDatePicker,
  createdFromDate,
  getDictionaryValue,
  getDictionaryValueOrKey,
} from '../../../../../utils/utils';
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

export async function fetchReport(reportUrl, reportName) {
  const mapUrl = urlStrToMapStruc(reportUrl + '?PageNumber=1');
  mapUrl.set('ReportName', reportName);
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

  if (defaultSearchDateRange) {
    addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  }

  if (onSearchAction) {
    mapUrl.delete('createdFrom');
    mapUrl.delete('createdTo');
  }

  Object.keys(filtersRefs).map((filter) => {
    const filterValue = filtersRefs[filter]?.current;
    filterValue && mapUrl.set(filter, filterValue);
  });

  if (hasSortChanged.current) {
    const { sortData } = hasSortChanged.current;

    if (sortData[0]) {
      mapUrl.set('SortDirection', sortData[0].sort);
      mapUrl.set('SortBy', sortData[0].colId);
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
  const sortBy = sortData?.map((c) => `${c.colId}:${c.sort ?? ''}`);
  const params = { ...optionFieldsRef.current, sortBy };

  const isSameFilter = isSameFilterRepeated(previousFilter.current, params);
  if (!isSameFilter) {
    params.PageNumber = 1;
  }

  const filterUrl = mapStrucToUrlStr(mapUrl);
  console.log('filterUrl JUST FOR TEST', filterUrl);
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
  const shortStartDateMonth = startDate.format('MMMM').substring(0, 3);
  const startDateMonth = startDate.format('M');
  const startDateDay = startDate.format('D');

  const shortEndDateMonth = endDate.format('MMMM').substring(0, 3);
  const endDateMonth = endDate.format('M');
  const endDateDay = endDate.format('D');

  return startDateMonth === endDateMonth
    ? `${shortStartDateMonth} ${startDateDay}-${endDateDay}`
    : `${shortStartDateMonth} ${startDateDay}-${shortEndDateMonth} ${endDateDay}`;
};
export { compareSort };

export const getFilterFlyoutPredefined = (orderFilterTypes, orderFilterStatus) => [
  { id: 1, accordionLabel: 'Date Range', filterField: 'date', open: false },
  {
    id: 2,
    accordionLabel: 'Order Status',
    filterField: 'order',
    filterOptionList: [
      {
        id: 1,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.open ?? 'Open'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.open ?? 'Open'
        ),
        group: 'status',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.investigation ?? 'Investigation'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.investigation ?? 'Investigation'
        ),
        group: 'status',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.shipping ?? 'Shipping'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.shipping ?? 'Shipping'
        ),
        group: 'status',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.rejected ?? 'Reject'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.rejected ?? 'Reject'
        ),
        group: 'status',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.complete ?? 'Complete'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.complete ?? 'Complete'
        ),
        group: 'status',
      },
      {
        id: 6,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.cancelled ?? 'Cancelled'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.cancelled ?? 'Cancelled'
        ),
        group: 'status',
      },
      {
        id: 7,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.onHold ?? 'OnHold'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.onHold ?? 'OnHold'
        ),
        group: 'status',
      },
      {
        id: 8,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.shipped ?? 'Shipped'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.shipped ?? 'Shipped'
        ),
        group: 'status',
      },
      {
        id: 9,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterStatus?.inProcess ?? 'InProcess'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterStatus?.inProcess ?? 'InProcess'
        ),
        group: 'status',
      },
    ],
    open: false,
  },
  {
    id: 3,
    accordionLabel: 'Order Type',
    filterField: 'order',
    open: false,
    filterOptionList: [
      {
        id: 1,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzcc?.label ?? 'InTouch'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzcc?.key ?? 'ZZCC'
        ),
        group: 'type',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzct?.label ?? 'Manual'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzct?.key ?? 'ZZCT'
        ),
        group: 'type',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzed?.label ?? 'EDI or XML'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzed?.key ?? 'ZZED'
        ),
        group: 'type',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzit?.label ?? 'InTouch'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzit?.key ?? 'ZZIT'
        ),
        group: 'type',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzkb?.label ?? 'Consignment Fill-Up'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzkb?.key ?? 'ZZKB'
        ),
        group: 'type',
      },
      {
        id: 6,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzlv?.label ?? 'License'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzlv?.key ?? 'ZZLV'
        ),
        group: 'type',
      },
      {
        id: 7,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzmr?.label ?? 'TDMRS Project'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzmr?.key ?? 'ZZMR'
        ),
        group: 'type',
      },
      {
        id: 8,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzor?.label ?? 'Manual'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzor?.key ?? 'ZZOR'
        ),
        group: 'type',
      },
      {
        id: 9,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzpb?.label ?? 'Manual'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzpb?.key ?? 'ZZPB'
        ),
        group: 'type',
      },
      {
        id: 10,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzpe?.label ?? 'TD Staff purchase'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzpe?.key ?? 'ZZPE'
        ),
        group: 'type',
      },
      {
        id: 11,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzpt?.label ?? 'Project order'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzpt?.key ?? 'ZZPT'
        ),
        group: 'type',
      },
      {
        id: 12,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzqt?.label ?? 'Quotation'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzqt?.key ?? 'ZZQT'
        ),
        group: 'type',
      },
      {
        id: 13,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzsb?.label ?? 'Third Party'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzsb?.key ?? 'ZZSB'
        ),
        group: 'type',
      },
      {
        id: 14,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzsl?.label ?? 'Licensing'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzsl?.key ?? 'ZZSL'
        ),
        group: 'type',
      },
      {
        id: 15,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzso?.label ?? 'Stocking Order'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzso?.key ?? 'ZZSO'
        ),
        group: 'type',
      },
      {
        id: 16,
        filterOptionLabel: getDictionaryValueOrKey(
          orderFilterTypes?.zzst?.label ?? 'StreamOne'
        ),
        filterOptionKey: getDictionaryValueOrKey(
          orderFilterTypes?.zzst?.key ?? 'ZZST'
        ),
        group: 'type',
      },
    ],
  },
];
