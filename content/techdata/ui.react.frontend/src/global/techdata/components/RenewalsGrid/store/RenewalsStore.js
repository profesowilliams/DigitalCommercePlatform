import Create from "zustand";
import { renewalsComputed } from "./RenewalsComputed";
// import { createTrackedSelector } from "react-tracked";
import { renewalsEffects } from "./RenewalsEffects";
//Removed temporarily to fix an issue with the pipeline
//import { mountStoreDevtool } from "simple-zustand-devtools";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage } from "../renewalUtils";
import { FILTER_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY, PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import moment from "moment";
import { DATE_DEFAULT_OPTIONS } from "./RenewalsStoreConstants";

const INITIAL_STATE = {
  filterList: getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "filterList", null), 
  isFilterModalOpen: false,
  appliedFilterCount: getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "count", 0),
  dateOptionsList: DATE_DEFAULT_OPTIONS.map(item => ({ ...item, checked: item.field === getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected })),
  dateSelected: getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "dateSelected", null),
  datePickerState: null,
  finalResults: [],
  pagination: {
    totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "currentResultsInPage", 0),
    pageNumber: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "pageNumber", getFromQueryString('page=') || 1),
  },
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  refinements: undefined,
  customStartDate: getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "customStartDate", undefined),
  customEndDate: getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "customEndDate", undefined),
  aemConfig:null,
  gridApi:null,
  detailRender: getLocalValueOrDefault(PLANS_ACTIONS_LOCAL_STORAGE_KEY, "detailRender", "primary"),
  renewalOptionState:null,
  resetFilter:false,
  rowCollapsedIndexList:null,
  dueDaysIcons: null
};

/**
 * Returns the value of `param` if it exists in the query string
 * or else return false.
 * @param {string} param Query string param
 * @returns any | false
 */
function getFromQueryString(param) {
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
function getLocalValueOrDefault(key, property, otherwise) {
  if (hasLocalStorageData(key) && isFromRenewalDetailsPage()) {
    return getLocalStorageData(key)[property];
  } else {
    return otherwise;
  }
}

const store = (set, get, a) => ({
  ...INITIAL_STATE,
  effects: renewalsEffects(set, get),
});

const renewalStore = Create(store);
// export const useRenewalGridState = createTrackedSelector(renewalStore);
export const useRenewalGridState = renewalStore;
//Removed temporarily to fix an issue with the pipeline
/*if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("RenewalsStore", renewalStore);
}
*/
