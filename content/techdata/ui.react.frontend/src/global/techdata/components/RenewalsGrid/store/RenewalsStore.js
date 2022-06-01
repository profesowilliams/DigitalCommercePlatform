import Create from "zustand";
import { renewalsComputed } from "./RenewalsComputed";
// import { createTrackedSelector } from "react-tracked";
import { renewalsEffects } from "./RenewalsEffects";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage } from "../renewalUtils";
import { PAGINATION_LOCAL_STORAGE_KEY, PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";

const DATE_DEFAULT_OPTIONS = [
  {
    DueDateFrom: new Date(),
    label: "overdue",
    field: "overdue",
  },
  {
    label: "Today",
    field: "today",
  },
  {
    label: "0 - 30 days",
    field: "30",
  },
  {
    label: "31 - 60 days",
    field: "60",
  },
  {
    label: "61 - 90 days",
    field: "90",
  },
  {
    label: "91+ days",
    field: "91",
  },
  {
    label: "Custom date range",
    field: "custom",
  },
];

const INITIAL_STATE = {
  filterList: null,
  isFilterModalOpen: false,
  appliedFilterCount: 0,
  dateOptionsList: DATE_DEFAULT_OPTIONS.map(item => ({ ...item, checked: false })),
  dateSelected: null,
  datePickerState: null,
  finalResults: [],
  pagination: {
    totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "currentResultsInPage", 0),
    pageNumber: getLocalValueOrDefault(PAGINATION_LOCAL_STORAGE_KEY, "pageNumber", 1),
  },
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  refinements: undefined,
  customStartDate:undefined,
  customEndDate:undefined,
  aemConfig:null,
  gridApi:null,
  detailRender: getLocalValueOrDefault(PLANS_ACTIONS_LOCAL_STORAGE_KEY, "detailRender", "primary"),
  renewalOptionState:null,
  resetFilter:false,
  rowCollapsedIndexList:null
};

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
  if (hasLocalStorageData(key)) {
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
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("RenewalsStore", renewalStore);
}
