import {
  getLocalStorageData,
  hasLocalStorageData,
  isFromRenewalDetailsPage,
} from '../../RenewalsGrid/utils/renewalUtils';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';

export const basicGridState = {
  resetGrid: null,
  aemConfig: null,
  gridApi: null,
};

export const paginationState = {
  pagination: {
    totalCounter: 0,
    stepBy: 25,
    currentResultsInPage: getLocalValueOrDefault(
      ORDER_PAGINATION_LOCAL_STORAGE_KEY,
      'currentResultsInPage',
      0
    ),
    pageNumber: getLocalValueOrDefault(
      ORDER_PAGINATION_LOCAL_STORAGE_KEY,
      'pageNumber',
      getFromQueryString('page=') || 1
    ),
  },
};

export const filterState = {
  refinements: undefined,
};

/**
 * Returns the value of `param` if it exists in the query string
 * or else return false.
 * @param {string} param Query string param
 * @returns any | false
 */
export function getFromQueryString(param) {
  if (location?.href?.includes(param)) {
    return location.href.split(param).pop() === '1'
      ? false
      : location.href.split(param).pop();
  }

  return false;
}

/**
 * A function to check if a key exist in localstorage and return its value. If the
 * key is not found, the default value passed as `otherwise` argument
 * will be returned.
 * @param {string} key LocalStorage key name
 * @param {string} property Property that we intend to find in local storage key
 * @param {string | number} otherwise a default return value if the check fails
 * @returns Either the parsed Object or the value of otherwise argument.
 */
export function getLocalValueOrDefault(key, property, otherwise) {
  if (hasLocalStorageData(key)) {
    return getLocalStorageData(key)[property];
  } else {
    return otherwise;
  }
}

export function getLocalSelectedDateRange(key, otherwise) {
  if (hasLocalStorageData(key) && isFromRenewalDetailsPage()) {
    const { customStartDate = '', customEndDate = '' } =
      getLocalStorageData(key);
    return customStartDate && customEndDate
      ? [customStartDate, customEndDate]
      : otherwise;
  } else {
    return otherwise;
  }
}
