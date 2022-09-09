import Create from "zustand";
import { renewalsEffects } from "./RenewalsDetailsEffects";

const INITIAL_STATE = {  
  toaster:{
    isOpen:false,
    message:"",
    origin:"details",
    isSuccess:false,
    isAutoClose:false,
  },
  isEditingDetails: false,
  endUser: null,
  reseller: null,
  lines: null,
};

const store = (set,get) => ({
  ...INITIAL_STATE,
  effects: renewalsEffects(set,get),
});

export const useRenewalsDetailsStore = Create(store);

if (process.env.NODE_ENV === "development") {
  import("simple-zustand-devtools").then(({mountStoreDevtool}) => {
    mountStoreDevtool("RenewalsStore", useRenewalsDetailsStore);
  });
}

