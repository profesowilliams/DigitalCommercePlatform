import { setLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";

export const orderTrackingEffects = ( set, get ) =>  ({
  setCustomState({key='', value }, options){
    if (options && options.saveToLocal === true) {
      setLocalStorageData(options.key, value);
    }
    const currentState = get()[key] || value;
    if (typeof value === "object" && !Array.isArray(value)) return set({[key]:{...currentState,...value}})
    set({[key]:value})
  },
})
