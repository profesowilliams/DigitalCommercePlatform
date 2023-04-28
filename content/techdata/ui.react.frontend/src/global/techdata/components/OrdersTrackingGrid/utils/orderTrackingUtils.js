import { usGet } from "../../../../../utils/api";
import { formatDatePicker, createdFromDate } from "../../../../../utils/utils";
import {
  calcSecondLevelSorting,
  isFirstTimeSortParameters,
  isRepeatedSortAction,
  isSameFilterRepeated,
  mapStrucToUrlStr,
  urlStrToMapStruc,
} from '../../RenewalsGrid/utils/renewalUtils';

const reportOptionsConfig = {
  last7Days: [
    ['createdFrom', formatDatePicker(createdFromDate(7))],
    ['createdTo', formatDatePicker(new Date())],
  ],
  last30Days: [
    ['createdFrom', formatDatePicker(createdFromDate(30))],
    ['createdTo', formatDatePicker(new Date())],
  ],
  allOutstanding: [['status', 'all']],
};

const reporstDefaultDateRangeConfig = [
  ['createdFrom', formatDatePicker(createdFromDate(90))],
  ['createdTo', formatDatePicker(new Date())],
];

const addReportDateRangeToUrl = (mapUrl, reportFilterValue) => {
  reportOptionsConfig[reportFilterValue].map((params) => {
    mapUrl.set(...params);
  });
};

const addMapUrlParamsForReports = (mapUrl, reportFilterValue) => {
  reporstDefaultDateRangeConfig.map((params) => {
    mapUrl.set(...params);
  });
  addReportDateRangeToUrl(mapUrl, reportFilterValue);
};

export const addDefaultDateRangeToUrl = (url, defaultDateRange) => {
  if (defaultDateRange) {
    const dateRange = urlStrToMapStruc(defaultDateRange).entries();
    url.set(...dateRange.next().value);
    url.set(...dateRange.next().value);
  }
};

export const fetchOrdersCount = async (
  url,
  reportFilterValue,
  defaultSearchDateRange
) => {
  const mapUrl = urlStrToMapStruc(url + '?PageSize=25');

  addDefaultDateRangeToUrl(mapUrl, defaultSearchDateRange);
  if (reportFilterValue) {
    addReportDateRangeToUrl(mapUrl, reportFilterValue);
  }

  try {
    const result = await usGet(mapStrucToUrlStr(mapUrl));
    return result;
  } catch (error) {
    console.error('error on orders count >>', error);
  }
};

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
    isPriceColumnClicked,
    gridApiRef,
    isFilterDataPopulated,
    optionFieldsRef,
    componentProp,
    previousFilter,
    reportFilterValue,
    defaultSearchDateRange,
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

  if (reportFilterValue.current?.value) {
    addMapUrlParamsForReports(mapUrl, reportFilterValue.current.value);
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