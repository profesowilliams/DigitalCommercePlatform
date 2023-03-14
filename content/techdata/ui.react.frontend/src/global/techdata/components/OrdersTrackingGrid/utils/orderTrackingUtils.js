import { usGet } from "../../../../../utils/api";
import { formateDatePicker } from "../../../../../utils/utils";
import { calcSecondLevelSorting, extractSortColAndDirection, isFirstTimeSortParameters, isRepeatedSortAction, isSameFilterRepeated, mapStrucToUrlStr, urlStrToMapStruc } from "../../RenewalsGrid/utils/renewalUtils";

export function setDefaultSearchDateRange(dateRange = '30') {
    const createdFrom = new Date();
    const createdTo = new Date();
    createdFrom.setDate(createdTo.getDate() - (parseInt(dateRange, 10) + 1));
    const createdFromString =  formateDatePicker(createdFrom);
    const createdToString =  formateDatePicker(createdTo);
    return `&createdFrom=${createdFromString}&createdTo=${createdToString}`;
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
      isPriceColumnClicked,
      gridApiRef,
      isFilterDataPopulated,
      optionFieldsRef,
      componentProp,
      previousFilter,
    } = config;
  
    const { url } = request;
    const mapUrl = urlStrToMapStruc(url);
    
    if (hasSortChanged.current) {
      const { sortData } = hasSortChanged.current;
      const { sortStrValue, isColReseted } = extractSortColAndDirection(sortData);
      const secondLevelSort = calcSecondLevelSorting(sortData);
      
      if (secondLevelSort && !secondLevelSort.includes("undefined")) {
        mapUrl.set('SortBySecondLevel', secondLevelSort);
        
        if (secondLevelSort.includes("renewedduration")) {
          const renewedWithSupport = secondLevelSort.replace('renewedduration', 'support');
          mapUrl.set('SortBySecondLevelComposite', renewedWithSupport);
        }
      }
  
      const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
      const isEqual = isRepeatedSortAction(previousSortChanged.current?.sortData, hasSortChanged.current?.sortData);
      const pageNumber = customPaginationRef.current?.pageNumber;
      const isNotFirstAPICall = firstAPICall.current === false;
  
      if (pageNumber !== 1 && !isDefaultSort && isNotFirstAPICall) {
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