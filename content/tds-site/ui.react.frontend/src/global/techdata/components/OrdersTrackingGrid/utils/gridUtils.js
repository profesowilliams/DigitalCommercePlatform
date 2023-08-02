import { requestFileBlobWithoutModal } from '../../../../../utils/utils';
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

  if (mappedResponse.status !== 200 && !mappedResponse.data) {
    return {
      data: {
        content: {
          items: null,
          totalItems,
          pageCount,
          pageNumber,
          refinementGroups,
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
};

export function updateQueryString(pageNumber) {
  if (!pageNumber) return;
  if (pageNumber === 1) {
    if (location.href.includes('page=')) {
      history.replaceState(null, '', location.origin + location.pathname);
    }
  } else {
    history.replaceState(null, '', `?page=${pageNumber}`);
  }
}

export const addCurrencyToTotalColumn = (list, userData) => {
  const activeCustomer = userData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';

  return list.map((column) => {
    if (column.columnKey === 'priceFormatted') {
      column.columnLabel = `Total (${defaultCurrency})`;
      return column;
    }
    return column;
  });
};

export const downloadFileBlob = async (
  flyoutType,
  orderId,
  selectedId,
  componentProp
) => {
  try {
    const url = componentProp.ordersDownloadDocumentsEndpoint || 'nourl';
    const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
    const downloadOrderInvoicesUrl =
      url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;
    const name = `${flyoutType}.zip`;
    await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, name, {
      redirect: false,
    });
  } catch (error) {
    console.error('Error', error);
  }
};

export const getPaginationValue = (
  response,
  ordersCountResponse,
  gridConfig
) => {
  const paginationValue = setPaginationData(
    ordersCountResponse?.data?.content,
    response?.data?.content?.pageNumber,
    gridConfig.itemsPerPage
  );
  return paginationValue;
};

const doesMatchByInvoiceId = (searchInvoice, orderInvoices) =>
  orderInvoices.some((invoice) => invoice.id == searchInvoice);

const doesMatchByDeliveryNote = (searchDeliveryNote, deliveryNotes) =>
  deliveryNotes.some((deliveryNote) => deliveryNote.id == searchDeliveryNote);

const doesMatchById = (searchId, orderId) => searchId === orderId;

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
  let retValue = false;
  if (oldSort?.sortData?.length && newSort?.sortData?.length) {
    retValue =
      oldSort.sortData[0].colId == newSort.sortData[0].colId &&
      oldSort.sortData[0].sort == newSort.sortData[0].sort;
  }
  return retValue;
};