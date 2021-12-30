import Create from "zustand";
import { renewalsComputed } from "./RenewalsComputed";
// import { createTrackedSelector } from "react-tracked";
import { renewalsEffects } from "./RenewalsEffects";
import { mountStoreDevtool } from "simple-zustand-devtools";

const INITIAL_STATE = {
  filterList: null,
  isFilterModalOpen:false,
  finalResults:[]
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
