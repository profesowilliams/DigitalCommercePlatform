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
    mapUrl.set('repotrName', reportValue);
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
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.open),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.open),
        group: 'status',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.investigation),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.investigation),
        group: 'status',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.shipping),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.shipping),
        group: 'status',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.rejected),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.rejected),
        group: 'status',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.complete),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.complete),
        group: 'status',
      },
      {
        id: 6,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.cancelled),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.cancelled),
        group: 'status',
      },
      {
        id: 7,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.onHold),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.onHold),
        group: 'status',
      },
      {
        id: 8,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.shipped),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.shipped),
        group: 'status',
      },
      {
        id: 9,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterStatus.inProcess),
        filterOptionKey: getDictionaryValueOrKey(orderFilterStatus.inProcess),
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
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzcc.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzcc.key),
        group: 'type',
      },
      {
        id: 2,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzct.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzct.key),
        group: 'type',
      },
      {
        id: 3,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzed.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzed.key),
        group: 'type',
      },
      {
        id: 4,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzit.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzit.key),
        group: 'type',
      },
      {
        id: 5,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzkb.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzkb.key),
        group: 'type',
      },
      {
        id: 6,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzlv.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzlv.key),
        group: 'type',
      },
      {
        id: 7,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzmr.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzmr.key),
        group: 'type',
      },
      {
        id: 8,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzor.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzor.key),
        group: 'type',
      },
      {
        id: 9,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzpb.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzpb.key),
        group: 'type',
      },
      {
        id: 10,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzpe.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzpe.key),
        group: 'type',
      },
      {
        id: 11,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzpt.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzpt.key),
        group: 'type',
      },
      {
        id: 12,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzqt.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzqt.key),
        group: 'type',
      },
      {
        id: 13,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzsb.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzsb.key),
        group: 'type',
      },
      {
        id: 14,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzsl.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzsl.key),
        group: 'type',
      },
      {
        id: 15,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzso.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzso.key),
        group: 'type',
      },
      {
        id: 16,
        filterOptionLabel: getDictionaryValueOrKey(orderFilterTypes.zzst.label),
        filterOptionKey: getDictionaryValueOrKey(orderFilterTypes.zzst.key),
        group: 'type',
      },
    ],
  },
];
