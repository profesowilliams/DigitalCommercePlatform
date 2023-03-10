import Create from "zustand";
import { renewalsEffects } from "../../RenewalsGrid/store/RenewalsEffects";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage } from "../../RenewalsGrid/utils/renewalUtils";
import { FILTER_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY, PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";

import { DATE_DEFAULT_OPTIONS } from "./StoreConstants";

export const basicGridState = {
  resetGrid:null,
  aemConfig:null,
  gridApi:null,
};

export const paginationState = {
  pagination: {
    totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "currentResultsInPage", 0),
    pageNumber: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "pageNumber", getFromQueryString('page=') || 1),
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
    return location.href.split(param).pop() === '1' ? false : location.href.split(param).pop();
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
  if (hasLocalStorageData(key) && isFromRenewalDetailsPage()) {
    return getLocalStorageData(key)[property];
  } else {
    return otherwise;
  }
}

export function getLocalSelectedDateRange(key, otherwise){
  if (hasLocalStorageData(key) && isFromRenewalDetailsPage()) {
    const {customStartDate = '', customEndDate = ''} = getLocalStorageData(key);
    return customStartDate && customEndDate ? [customStartDate, customEndDate] : otherwise;
  } else {
    return otherwise;
  }
}