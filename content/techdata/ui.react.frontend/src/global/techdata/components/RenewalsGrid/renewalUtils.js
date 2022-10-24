import { usGet, usPost } from "../../../../utils/api";
import {
  FILTER_LOCAL_STORAGE_KEY,
  PAGINATION_LOCAL_STORAGE_KEY,
  PLANS_ACTIONS_LOCAL_STORAGE_KEY,
  SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
  TOASTER_LOCAL_STORAGE_KEY,
} from "../../../../utils/constants";
import { sortRenewalObjects } from "../../../../utils/utils";
import { pushEvent, ANALYTICS_TYPES } from "../../../../utils/dataLayerUtils";

export  const secondLevelOptions = {
    colId: 'total',
    sort: "desc",
  }


  export function isFirstTimeSortParameters(sortingList){
    const {colId} = secondLevelOptions;
    if ( !sortingList ) return true;
    const { sortData } = sortingList;        
    const colIdList = sortData.map(s => s.colId);
    Object.defineProperty(colIdList, 'hasDefaultValues',{
        writable: false,
        value: function (compareList){
            const validArgs = [];
            for (const item of compareList){
                validArgs.push(this.includes(item))
            }
            return validArgs.every(sort => sort);
        }
    })
    return colIdList.hasDefaultValues(["dueDate",colId]);    
}

export function mapServiceData(response) {
    const mappedResponse = { ...response };
    const items = mappedResponse?.data?.content?.items?.map((val) => ({
        ...val,
    }));
    const itemsWithActions = items
        ? items.map((data) => ({ ...data, actions: true }))
        : [];
    const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
    const pageCount = mappedResponse?.data?.content?.pageCount ?? 0;
    const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
    const refinementGroups =
        mappedResponse?.data?.content?.refinementGroups;

    if (mappedResponse.status !== 200 && !mappedResponse.data) {
        return {
            data: {
                content: {
                    items: null,
                    totalItems,
                    pageCount,
                    pageNumber,
                    refinementGroups                    
                },
            },
        };
    }

    mappedResponse.data.content = {
        items: itemsWithActions,
        totalItems,
        pageCount,
        pageNumber,
        refinementGroups,
    };
    return mappedResponse;
}

export function mapSortIdByPrice(gridApiRef, request) {
    if (request.url.includes("SortBy=id")) {
        gridApiRef.current.columnApi.applyColumnState({
            state: [{ ...secondLevelOptions, sort: "asc" }],
            defaultState: { sort: null },
        });
        return true;
    }
    return false;
}

export function priceDescendingByDefaultHandle(sortingFields, mappedResponse) {
    const { dueDateKey, dueDateDir, secondLevelOptions } = sortingFields;

    const sortModel = [
        { colId: dueDateKey, sort: dueDateDir },
        { ...secondLevelOptions },
    ];
    const query = {
        SortBy: `${sortModel?.[0]?.colId ?? "id"}:${sortModel?.[0]?.sort ?? ""}${sortModel?.[1] ? "," : ""
            }${sortModel?.[1]?.colId ?? ""}:${sortModel?.[1]?.sort ?? ""}`
    };
    const multiSorting =
        sortRenewalObjects(mappedResponse?.data?.content?.items, query) ?? 0;
    return [...multiSorting];
}

function urlStrToMapStruc(urlStri = ''){
    return new Map(urlStri.split("&").map(e => e.split("=")));
}

function mapStrucToUrlStr(urlMapStruc = new Map()){
    return Array.from(urlMapStruc)
      .map((e) => e.join('='))
      .join('&')
      .replace('SortBySecondLevel', 'SortBy')
      .replace('SortBySecondLevelComposite', 'SortBy');
}

export function addCurrentPageNumber(customPaginationRef, request) {
    const INITIAL_PAGE = 1;
    const urlMap = urlStrToMapStruc(request.url);
    const pageNumber = customPaginationRef.current?.pageNumber || INITIAL_PAGE; /** to take care of 0 value */
    if (pageNumber !== INITIAL_PAGE) {    
        urlMap.set("PageNumber",pageNumber)
        return mapStrucToUrlStr(urlMap)              
    }  
    return request.url;
}

export function isFilterPostRequest(hasSortChanged,isFilterDataPopulated){
    if (hasSortChanged.current && isFilterDataPopulated.current) {
        return true
    }
    return false
}

function compareMaps(map1, map2) {
    let testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (let [key, val] of map1) {
        testVal = map2.get(key);        
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}

function isSameFilterRepeated(previousFilter, newFilter){   

    const prevMap = new Map(Object.entries(previousFilter));
    prevMap.delete('sortBy');
    prevMap.delete('PageNumber');
    const newMap = new Map(Object.entries(newFilter));
    newMap.delete('sortBy');
    newMap.delete('PageNumber');
    const isFilterEqual = compareMaps(prevMap,newMap);    
    return isFilterEqual;
}

export async function fetchRenewalsFilterByPost(config){
    const {
      hasSortChanged,
      isFilterDataPopulated,
      optionFieldsRef,
      customPaginationRef,
      componentProp,
      previousFilter,
      searchCriteria,      
    } = config;
    if (isFilterPostRequest(hasSortChanged,isFilterDataPopulated)) {
        const sortBy = hasSortChanged.current?.sortData.map(c => `${c.colId}:${c.sort ?? ''}`);
        const params = { ...optionFieldsRef.current, sortBy };       
        if (customPaginationRef.current?.pageNumber !== 1) {
          params.PageNumber = customPaginationRef.current?.pageNumber;
        }        
        if(searchCriteria.current?.field && searchCriteria.current?.value ){
            const {field, value} = searchCriteria.current;
            params[field] = value;
        }
        const isSameFilter = isSameFilterRepeated(previousFilter.current, params);
        if (!isSameFilter) params.PageNumber = 1;
        const result = await usPost(componentProp.uiServiceEndPoint, params);
        previousFilter.current = {...params};
        return result
      }
    return false
}

function sortListToUrlStr (sortList){
    return sortList.map(c => `SortBy=${c.colId}:${c.sort ?? ''}`).join('&');
}

function extractSortColAndDirection(sortDataRef = []){
    const [sortParam] = sortDataRef;   
    return {
        isColReseted: !sortParam?.colId || !sortParam?.sort,
        sortStrValue: `${sortParam?.colId}:${sortParam?.sort}`
    }
}

function calcSecondLevelSorting(sortList){
    if (!Array.isArray(sortList) && !sortList.length == 2) return false;
    const [_, sortParam] = sortList;
    return `${sortParam?.colId}:${sortParam?.sort}`
}

function isRepeatedSortAction(previusSort, newSort){ 
    if (!previusSort || !newSort) return false;
    const previusSortList = previusSort.map(({colId, sort}) => ({colId, sort}));
    const newSortList = newSort.map(({colId, sort}) => ({colId, sort}));
    const isEqual = sortListToUrlStr(previusSortList) === sortListToUrlStr(newSortList);
    return isEqual
}

function clickPriceTheFirstTime(isPriceColumnClicked, previousSortChanged, gridApiRef){
    if (isPriceColumnClicked?.current && isFirstTimeSortParameters(previousSortChanged?.current)){
        gridApiRef.current.columnApi.applyColumnState({
            state: [{...secondLevelOptions}]
        })     
    }
}

export async function fetchRenewalsByGet(config){
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
      gridApiRef
    } = config;

    clickPriceTheFirstTime(isPriceColumnClicked, previousSortChanged, gridApiRef);
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const isEqual = isRepeatedSortAction(previousSortChanged.current?.sortData, hasSortChanged.current?.sortData );
    const mapUrl = urlStrToMapStruc(request.url);  
    const {sortStrValue, isColReseted} = extractSortColAndDirection(hasSortChanged.current?.sortData);
    const secondLevelSort = calcSecondLevelSorting(hasSortChanged.current?.sortData);
    if(secondLevelSort && !secondLevelSort.includes("undefined")) {
        mapUrl.set('SortBySecondLevel',secondLevelSort);
        if(secondLevelSort.includes("renewedduration")) {
            const renewedWithSupport = secondLevelSort.replace('renewedduration', 'support');
            mapUrl.set('SortBySecondLevelComposite', renewedWithSupport);
        }
    }
    mapUrl.set('SortBy',sortStrValue);
    if (isColReseted) mapUrl.delete('SortBy');
    mapUrl.delete('SortDirection')  
    const pageNumber = customPaginationRef.current?.pageNumber;
    const isNotFirstAPICall = firstAPICall.current === false;

    if (pageNumber !== 1 && !isDefaultSort && isNotFirstAPICall) {
        if (!isEqual) mapUrl.set('PageNumber',1);
    }
    if (searchCriteria.current?.field) {
        const {field, value} = searchCriteria.current;
        mapUrl.set(field,value);  
        if (pageNumber !== 1, onSearchAction){
          mapUrl.set('PageNumber',1);
        }
    } else {
        if (onSearchAction) mapUrl.set('PageNumber',1);
    }    
    if (onFiltersClear) mapUrl.set('PageNumber', 1);
    const finalUrl = mapStrucToUrlStr(mapUrl);
    previousSortChanged.current = hasSortChanged.current;
    firstAPICall.current = false;    
    let gridData =  await usGet(finalUrl);
    if (!localStorage.getItem('sessionId'))
        setTimeout(() => gridData = usGet(finalUrl), 0)  
    return gridData;
}

export function setPaginationData(mappedResponse,pageSize) {
    const { pageCount, pageNumber, totalItems } = mappedResponse;
    return {
        currentResultsInPage: pageSize,
        totalCounter: totalItems,
        pageCount,
        pageNumber: parseInt(pageNumber),
    };
}



/**
 * Set value to the key in localstorage.
 * @param {string} key 
 * @param {object} value 
 */
export function setLocalStorageData(key, value) {
    localStorage.setItem(key || '', JSON.stringify(value) || '');
}

export function removeLocalStorageData(key = '') {
    key && localStorage.removeItem(key);
}

/**
 * Check if a key is present in localstorage
 * @param {string} key 
 * @returns boolean
 */
export function hasLocalStorageData(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * Get the value of passed `key` if it is present in localstorage
 * @param {string} key 
 * @returns boolean
 */
export function getLocalStorageData(key) {
    return hasLocalStorageData(key) && JSON.parse(localStorage.getItem(key));
}

/**
 * Removes the specified keys from localstorage
 */
export function clearLocalStorageGridData() {
    localStorage.removeItem(SEARCH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(PAGINATION_LOCAL_STORAGE_KEY);
    localStorage.removeItem(SORT_LOCAL_STORAGE_KEY);
    localStorage.removeItem(PLANS_ACTIONS_LOCAL_STORAGE_KEY);
    localStorage.removeItem(FILTER_LOCAL_STORAGE_KEY);
    localStorage.removeItem(TOASTER_LOCAL_STORAGE_KEY);
}

export function isFromRenewalDetailsPage() {
    const renewalsDetailsUrl = process.env.NODE_ENV === "development" ? 'td-renewals-details-react' : 'renewal-details.html';
    return (document.referrer.split('?')[0])?.split('/')?.pop() === renewalsDetailsUrl;
}

/**
 * Updates query string if page number is not 1
 * If page number is 1, it removes query string with default URL.
 * @param {number} pageNumber page number
 */
export function updateQueryString(pageNumber) {
    if (!pageNumber) return
    if (pageNumber === 1) {
        if (location.href.includes('page=')) {
            history.replaceState(null, '', location.origin + location.pathname);
        }
    } else {
        history.replaceState(null, '', `?page=${pageNumber}`);
    }
};

export async function handleFetchDataStrategy(renewalOperations) {
    const { hasSortChanged, isFilterDataPopulated } = renewalOperations;
    const shouldFetchByPost = isFilterPostRequest(hasSortChanged, isFilterDataPopulated);   
    return shouldFetchByPost ? fetchRenewalsFilterByPost({ ...renewalOperations })
                             : fetchRenewalsByGet({ ...renewalOperations });
};

export const analyticsColumnDataToPush = (name) => ({
    type: ANALYTICS_TYPES.types.button,
    category: ANALYTICS_TYPES.category.renewalsActionColumn,
    name,
});

export const redirectToRenewalDetail = (detailUrl, id = "") => {
    pushEvent(ANALYTICS_TYPES.events.click, analyticsColumnDataToPush(ANALYTICS_TYPES.name.seeDetails));
    const renewalDetailsURL = encodeURI(
      `${window.location.origin}${detailUrl}.html?id=${id ?? ""}`
    );
    window.location.href = renewalDetailsURL;
};

export const formatRenewedDuration = (type, renewed, support) => {
  return [type, renewed?.split(' ').slice(0, 2).join(' '), support]
    .filter(Boolean)
    .join(', ');
};

export const checkIfAnyDateRangeIsCleared = ({dateOptionsList,filterList,customStartDate,customEndDate}) => {  
    const [dateOption] = dateOptionsList.filter(o => o.checked)  
    if (!dateOption) return false
    if ((!customStartDate || !customEndDate) && dateOption.field === 'custom'){     
        getLocalStorageData;
        setLocalStorageData;
      const filterLocalStorage = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY);  
      const dateOptionsUncheckedList = dateOptionsList.map( o => ({...o, checked: false}));
      const filterUnopenedList = filterList.map(o => { 
        if (o.field === "date"){
            return {...o, open:false};
        }      
        return o;
      })     
      if (filterLocalStorage) {
          Reflect.deleteProperty(filterLocalStorage,'customEndDate');
          Reflect.deleteProperty(filterLocalStorage,'customStartDate');
          Reflect.deleteProperty(filterLocalStorage,'dateSelected');
          filterLocalStorage.filterList = [...filterUnopenedList];
      }     
      setLocalStorageData(FILTER_LOCAL_STORAGE_KEY,{...filterLocalStorage}) 
      return {dateOptionsUncheckedList,filterUnopenedList};
    }
    return false;
}