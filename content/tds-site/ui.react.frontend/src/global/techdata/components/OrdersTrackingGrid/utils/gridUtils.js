import { getDictionaryValueOrKey } from '../../../../../utils/utils';

//TODO: REMOVE
export function getLocalStorageData(key) {
  return hasLocalStorageData(key) && JSON.parse(localStorage.getItem(key));
}

//TODO: REMOVE
export const hasLocalStorageData = (key) => {
  return localStorage.getItem(key) !== null;
};

//TODO: REMOVE
export const setLocalStorageData = (key, value) => {
  localStorage.setItem(key || '', JSON.stringify(value) || '');
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

export function updateQueryString(pageNumber, sort) {
  const searchParams = new URLSearchParams(window.location.search);

  if (pageNumber) {
    if (pageNumber > 1) {
      searchParams.set('page', pageNumber);
    } else {
      searchParams.delete('page');
    }
  }

  if (sort?.sortDirection) {
    searchParams.set('sortdirection', sort.sortDirection);
  }

  if (sort?.sortBy) {
    searchParams.set('sortby', sort.sortBy);
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

export const addCurrencyToTotalColumn = (list) => {
  return list.map((column) => {
    column.columnLabel = getDictionaryValueOrKey(column.columnLabel);
    return column;
  });
}