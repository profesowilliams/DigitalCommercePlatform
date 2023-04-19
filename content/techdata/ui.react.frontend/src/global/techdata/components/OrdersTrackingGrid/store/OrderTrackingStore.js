import Create from "zustand";
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { basicGridState, paginationState } from "../../BaseGrid/store/GridStore";
import { orderTrackingEffects } from "./OrderTrackingStoreEffects";

const INITIAL_STATE = {
  ...basicGridState,
  ...paginationState,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
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

