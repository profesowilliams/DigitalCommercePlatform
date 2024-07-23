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

export const addCurrencyToTotalColumn = (list) => {
  return list.map((column) => {
    column.columnLabel = getDictionaryValueOrKey(column.columnLabel);
    return column;
  });
}