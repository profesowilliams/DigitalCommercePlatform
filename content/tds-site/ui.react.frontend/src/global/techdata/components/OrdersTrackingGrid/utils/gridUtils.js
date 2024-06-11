import { setPaginationData } from './orderTrackingUtils';

export const isLocalDevelopment = window.origin === 'http://localhost:8080';

export function getLocalStorageData(key) {
  return hasLocalStorageData(key) && JSON.parse(localStorage.getItem(key));
}

export const hasLocalStorageData = (key) => {
  return localStorage.getItem(key) !== null;
};

export const setLocalStorageData = (key, value) => {
  localStorage.setItem(key || '', JSON.stringify(value) || '');
};

export const removeLocalStorageData = (key = '') => {
  key && localStorage.removeItem(key);
};

export const resetLocalStorage = (keys = []) => {
  keys.map((key) => localStorage.removeItem(key));
};

export const mapServiceData = (response) => {
  const mappedResponse = { ...response };
  const items = mappedResponse?.data?.content?.items?.map((val) => ({
    ...val,
  }));
  const itemsWithActions = items
    ? items.map((data) => ({ ...data, actions: true }))
    : [];
  const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
  const pageCount = mappedResponse?.data?.content?.pageCount ?? 1;
  const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
  const refinementGroups = mappedResponse?.data?.content?.refinementGroups;
  const queryCacheKey = mappedResponse?.data?.content?.queryCacheKey;
  if (mappedResponse.status !== 200 && !mappedResponse.data) {
    return {
      data: {
        content: {
          items: null,
          totalItems,
          pageCount,
          pageNumber,
          refinementGroups,
          queryCacheKey,
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
    queryCacheKey,
  };
  return mappedResponse;
};

export function updateQueryString(pageNumber) {
  if (!pageNumber) return;
  const searchParams = new URLSearchParams(window.location.search);
  if (pageNumber > 1) {
    searchParams.set('page', pageNumber);
  } else {
    searchParams.delete('page');
  }
  history.replaceState(null, '', '?' + searchParams.toString());
}

/**
 * Function to build a query string from an array of elements
 * Each element will be prefixed with `?id=` for the first element
 * and `&id=` for the subsequent elements.
 *
 * @param {Array} elements - Array of elements to be included in the query string
 * @returns {string} - The constructed query string
 */
export function buildQueryString(elements) {
  // Check if the input array is empty, return an empty string if true
  if (elements.length === 0) {
    return '';
  }

  // Initialize the query string with the first element prefixed by ?id=
  let queryString = `?id=${elements[0]}`;

  // Loop through the rest of the elements, starting from the second element
  for (let i = 1; i < elements.length; i++) {
    // Append each element to the query string, prefixed by &id=
    queryString += `&id=${elements[i]}`;
  }

  // Return the constructed query string
  return queryString;
}

export const addCurrencyToTotalColumn = (list, userData) => {
  return list.map((column) => {
    column.columnLabel = getDictionaryValueOrKey(column.columnLabel);
    return column;
  });
};

export const getPaginationValue = (
  response,
  ordersCountResponse,
  gridConfig
) => {
  const paginationValue = setPaginationData(
    ordersCountResponse?.data?.content,
    response?.data?.content,
    gridConfig.itemsPerPage
  );
  return paginationValue;
};

const doesMatchByInvoiceId = (searchInvoice, orderInvoices) =>
  orderInvoices.some((invoice) => invoice.id == searchInvoice);

const doesMatchByDeliveryNote = (searchDeliveryNote, deliveryNotes) =>
  deliveryNotes.some((deliveryNote) => deliveryNote.id == searchDeliveryNote);

const doesMatchById = (searchId, orderId) => searchId === orderId;

// DEPRECATED: Now for every single row results you get redirected, so only checking results.length
export const doesCurrentSearchMatchResult = (result, searchCriteria) => {
  if (searchCriteria.current.field === 'Id') {
    return doesMatchById(searchCriteria.current.value, result.id);
  } else if (searchCriteria.current.field === 'InvoiceId') {
    return doesMatchByInvoiceId(searchCriteria.current.value, result.invoices);
  } else if (searchCriteria.current.field === 'DeliveryNote') {
    return doesMatchByDeliveryNote(
      searchCriteria.current.value,
      result.deliveryNotes
    );
  }
};

export const secondLevelOptions = {
  colId: 'total',
  sort: 'desc',
};

export const filtersDateGroup = [
  'createdFrom',
  'createdTo',
  'etaDateFrom',
  'etaDateTo',
  'invoiceDateFrom',
  'invoiceDateTo',
  'shippedDateFrom',
  'shippedDateTo',
];

export function isFirstTimeSortParameters(sortingList) {
  const { colId } = secondLevelOptions;
  if (!sortingList) return true;
  const { sortData } = sortingList;
  const colIdList = sortData.map((s) => s.colId);
  Object.defineProperty(colIdList, 'hasDefaultValues', {
    writable: false,
    value: function (compareList) {
      const validArgs = [];
      for (const item of compareList) {
        validArgs.push(this.includes(item));
      }
      return validArgs.every((sort) => sort);
    },
  });
  return colIdList.hasDefaultValues(['dueDate', colId]);
}

export function calcSecondLevelSorting(sortList) {
  if (!Array.isArray(sortList) && !sortList.length == 2) return false;
  const [_, sortParam] = sortList;
  return `${sortParam?.colId}:${sortParam?.sort}`;
}

function sortListToUrlStr(sortList) {
  return sortList.map((c) => `SortBy=${c.colId}:${c.sort ?? ''}`).join('&');
}

export function isRepeatedSortAction(previusSort, newSort) {
  if (!previusSort || !newSort) return false;
  const previusSortList = previusSort.map(({ colId, sort }) => ({
    colId,
    sort,
  }));
  const newSortList = newSort.map(({ colId, sort }) => ({ colId, sort }));
  const isEqual =
    sortListToUrlStr(previusSortList) === sortListToUrlStr(newSortList);
  return isEqual;
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

export function isSameFilterRepeated(previousFilter, newFilter) {
  const prevMap = new Map(Object.entries(previousFilter));
  prevMap.delete('sortBy');
  prevMap.delete('PageNumber');
  const newMap = new Map(Object.entries(newFilter));
  newMap.delete('sortBy');
  newMap.delete('PageNumber');
  const isFilterEqual = compareMaps(prevMap, newMap);
  return isFilterEqual;
}

export function mapStrucToUrlStr(urlMapStruc = new Map()) {
  return Array.from(urlMapStruc)
    .map((e) => e.join('='))
    .join('&')
    .replace('SortBySecondLevel', 'SortBy')
    .replace('SortBySecondLevelComposite', 'SortBy');
}

export function urlStrToMapStruc(urlStri = '') {
  return new Map(urlStri.split('&').map((e) => e.split('=')));
}

export const compareSort = (oldSort, newSort) => {
  return (
    oldSort[0]?.colId === newSort[0]?.colId &&
    oldSort[0]?.sort === newSort[0]?.sort
  );
};

export function extractSortColAndDirection(sortDataRef = []) {
  const [sortParam] = sortDataRef;
  return {
    isColReseted: !sortParam?.colId || !sortParam?.sort,
    sortStrValue: `${sortParam?.colId}:${sortParam?.sort}`,
  };
}

export const pageAccessedByReload =
  (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType('navigation')
    .map((nav) => nav.type)
    .includes('reload');
