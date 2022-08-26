import Create from "zustand";
import { renewalsEffects } from "./RenewalsDetailsEffects";

const INITIAL_STATE = {  
  toaster:{
    isOpen:false,
    message:"",
    origin:"dashboard",
    isSuccess:false
  }
};

const store = (set, get, a) => ({
  ...INITIAL_STATE,
  effects: renewalsEffects(set, get),
});

export const useRenewalsDetailsStore = Create(store);

if (process.env.NODE_ENV === "development") {
  import("simple-zustand-devtools").then(({mountStoreDevtool}) => {
    mountStoreDevtool("RenewalsStore", useRenewalsDetailsStore);
  });
}

