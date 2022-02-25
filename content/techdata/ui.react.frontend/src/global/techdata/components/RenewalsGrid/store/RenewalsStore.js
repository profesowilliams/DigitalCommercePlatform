import Create from "zustand";
import { renewalsComputed } from "./RenewalsComputed";
// import { createTrackedSelector } from "react-tracked";
import { renewalsEffects } from "./RenewalsEffects";
import { mountStoreDevtool } from "simple-zustand-devtools";


const DATE_DEFAULT_OPTIONS = [
  {
    DueDateFrom: new Date(),
    label: "overdue",
    field: "overdue",
  },
  {
    label: "Today",
    field: 'today'
  },
  {
    label: "0 - 30 days",
    field: "30"
  },
  {
    label: "31 - 60 days",
    field: "60"
  },
  {
    label: "61 - 90 days",
    field: "90"
  },
  {
    label: "91+ days",
    field: "91"
  },
  {
    label: "Custom date range",
    field: 'custom'
  },
].map(item => ({ ...item, checked: false }));

const INITIAL_STATE = {
  filterList: null,
  isFilterModalOpen: false,
  dateOptionsList: DATE_DEFAULT_OPTIONS.map(item => ({ ...item, checked: false })),
  dateSelected: null,
  datePickerState: null,
  finalResults: [],
  pagination: {
  totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: 0,
    pageNumber: 1
  },
  customStartDate:undefined,
  customEndDate:undefined,
  aemConfig:null,
  gridApi:null,
  detailRender:'primary',
  renewalOptionState:null
};

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
