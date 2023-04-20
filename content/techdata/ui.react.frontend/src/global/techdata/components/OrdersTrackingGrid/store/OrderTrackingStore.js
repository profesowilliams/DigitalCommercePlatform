import Create from "zustand";
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { basicGridState, paginationState, getLocalValueOrDefault } from "../../BaseGrid/store/GridStore";
import { orderTrackingEffects } from "./OrderTrackingStoreEffects";

const mockedOrderTypeFilters = [{id:1, label:"Lorem Ipsum1", group: "type"}, {id:2, label:"Lorem Ipsum2", group: "type"}, {id: 3, label:"Lorem Ipsum3", group: "type"}, {id: 4, label:"Lorem Ipsum4", group: "type"}];
const mockedOrderStatusFilters = [{id:1, label:"Lorem Ipsum1", group: "status"}, {id:2, label:"Lorem Ipsum2", group: "status"}, {id: 3, label:"Lorem Ipsum3", group: "status"}, {id: 4, label:"Lorem Ipsum4", group: "status"}];
const mockedDataFilterLIst = [
  { id: 1, title: 'Date Range', open: false, field: 'date' },
  { id: 2, title: 'Order Status', open: false, field: 'order' },
  { id: 3, title: 'Order Type', open: false, field: 'order' },
];
const INITIAL_STATE = {
  ...basicGridState,
  ...paginationState,
  isFilterModalOpen: false,
  filterList: /*getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "orderFilterList",*/ mockedDataFilterLIst, //),
  branding:'',
  customStartDate: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "customStartDate", undefined),
  customEndDate: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "customEndDate", undefined),
  dateSelected: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "dateSelected", null),
  appliedFilterCount: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "count", 0),
  dateType: null,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  orderTypeFilters: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "orderTypeFilters", mockedOrderTypeFilters ?? []),
  orderStatusFilters: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "orderStatusFilters", mockedOrderStatusFilters ?? []),
  orderTypeFiltersChecked: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "orderTypeFiltersChecked", []),
  orderStatusFiltersChecked: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "orderStatusFiltersChecked", []),
  dateRangeFiltersChecked: getLocalValueOrDefault(ORDER_FILTER_LOCAL_STORAGE_KEY, "dateRangeFiltersChecked", []),
  orderFilterCounter: 0,
  isTDSynnex: true,
  branding: '',
};

const store = (set,get) => ({
  ...INITIAL_STATE,
  effects: orderTrackingEffects(set,get),
});

export const useOrderTrackingStore = Create(store);

if (process.env.NODE_ENV === "development") {
  import("simple-zustand-devtools").then(({mountStoreDevtool}) => {
    mountStoreDevtool("OrderTrackingStore", useOrderTrackingStore);
  });
}

