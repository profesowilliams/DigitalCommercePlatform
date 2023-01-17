import Create from "zustand";
import { orderTrackingEffects } from "./OrderTrackingStoreEffects";

const INITIAL_STATE = {  
  
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

