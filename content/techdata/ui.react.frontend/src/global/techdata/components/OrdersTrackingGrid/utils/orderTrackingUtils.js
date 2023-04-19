import { usGet } from "../../../../../utils/api";
import { formatDatePicker, createdFromDate } from "../../../../../utils/utils";
import { calcSecondLevelSorting, extractSortColAndDirection, isFirstTimeSortParameters, isRepeatedSortAction, isSameFilterRepeated, mapStrucToUrlStr, urlStrToMapStruc } from "../../RenewalsGrid/utils/renewalUtils";

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
      defaultSearchDateRange
    } = config;

    const { url } = request;
    const mapUrl = urlStrToMapStruc(url);
    const isFirstAPICall = firstAPICall.current === true;

    if (defaultSearchDateRange && isFirstAPICall) {
      const dateRange = urlStrToMapStruc(defaultSearchDateRange).entries();
      mapUrl.set(...dateRange.next().value);
      mapUrl.set(...dateRange.next().value);
    } else {
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
      reportOptionsConfig[reportFilterValue.current?.value].map((params) => {
        mapUrl.set(...params);
      });
    }

    if (onFiltersClear) {
      mapUrl.set('PageNumber', 1);
    }

    const { sortData } = hasSortChanged.current || {};
    const sortBy = sortData?.map(c => `${c.colId}:${c.sort ?? ''}`);
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