import Create from "zustand";
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { getFromQueryString, getLocalValueOrDefault } from "../../RenewalsGrid/store/RenewalsStore";
import { orderTrackingEffects } from "./OrderTrackingStoreEffects";
const INITIAL_STATE = {  
  resetGrid:null,
  pagination: {
    totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: getLocalValueOrDefault(ORDER_PAGINATION_LOCAL_STORAGE_KEY, "currentResultsInPage", 0),
    pageNumber: getLocalValueOrDefault(ORDER_PAGINATION_LOCAL_STORAGE_KEY, "pageNumber", getFromQueryString('page=') || 1),
  },
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

