import Create from "zustand";
import { renewalsEffects } from "./RenewalsEffects";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage } from "../utils/renewalUtils";
import { FILTER_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY, PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";

import { DATE_DEFAULT_OPTIONS } from "../../BaseGrid/store/StoreConstants";
import { basicGridState, filterState, getLocalSelectedDateRange, getLocalValueOrDefault, paginationState } from "../../BaseGrid/store/GridStore";

const INITIAL_STATE = {
  ...basicGridState,
  filterList: getLocalValueOrDefault(
    FILTER_LOCAL_STORAGE_KEY,
    'filterList',
    null
  ),
  isFilterModalOpen: false,
  isFilterButtonDisable: true,
  appliedFilterCount: getLocalValueOrDefault(
    FILTER_LOCAL_STORAGE_KEY,
    'count',
    0
  ),
  dateOptionsList: DATE_DEFAULT_OPTIONS.map((item) => ({
    ...item,
    checked:
      item.field ===
      getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected,
  })),
  dateSelected: getLocalValueOrDefault(
    FILTER_LOCAL_STORAGE_KEY,
    'dateSelected',
    null
  ),
  datePickerState: getLocalSelectedDateRange(FILTER_LOCAL_STORAGE_KEY, null),
  finalResults: [],
  ...paginationState,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  ...filterState,
  customStartDate: getLocalValueOrDefault(
    FILTER_LOCAL_STORAGE_KEY,
    'customStartDate',
    undefined
  ),
  customEndDate: getLocalValueOrDefault(
    FILTER_LOCAL_STORAGE_KEY,
    'customEndDate',
    undefined
  ),
  detailRender: getLocalValueOrDefault(
    PLANS_ACTIONS_LOCAL_STORAGE_KEY,
    'detailRender',
    'primary'
  ),
  renewalOptionState: null,
  resetFilter: false,
  rowCollapsedIndexList: null,
  dueDaysIcons: null,
  openedActionMenu: null,
  toaster: {
    isOpen: false,
    title: '',
    message: '',
    origin: 'dashboard',
    isSuccess: false,
  },
  isTDSynnex: false,
  branding: '',
  showCopyFlyout: false,
  analyticsCategory: 'renewals',
  showImportButton: false,
  renewalsGridRefreshIndex: 0,
};

const store = (set, get, a) => ({
  ...INITIAL_STATE,
  effects: renewalsEffects(set, get),
});

export const useRenewalGridState = Create(store);

if (process.env.NODE_ENV === "development") {
  import("simple-zustand-devtools").then(({mountStoreDevtool}) => {
    mountStoreDevtool("RenewalsStore", useRenewalGridState);
  });
}

