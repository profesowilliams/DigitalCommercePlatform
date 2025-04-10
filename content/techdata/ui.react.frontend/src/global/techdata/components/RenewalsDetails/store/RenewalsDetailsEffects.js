import { TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { setLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";
import isEqual from 'lodash.isequal';

export const renewalsEffects = (set, get) => ({
  setCustomState({ key = '', value }, options) {
    if (options && options.saveToLocal === true) {
      setLocalStorageData(options.key, value);
    }
    const currentState = get()[key] || value;
    if (typeof value === 'object' && !Array.isArray(value))
      return set({ [key]: { ...currentState, ...value } });
    set({ [key]: value });
  },

  setDatePickerState(fromDate = '', toDate = '') {
    const deleteTimeZoneRegex = /T((?:\d{2}:){2}.*)$/g;
    const fromDateNoTime = fromDate
      ? new Date(fromDate)
          .toISOString()
          .replace(deleteTimeZoneRegex, () => 'T00:00:00.000Z')
      : null;
    const toDateNoTime = toDate
      ? new Date(toDate)
          .toISOString()
          .replace(deleteTimeZoneRegex, () => 'T05:00:00.000Z')
      : null;
    set({ datePickerState: [fromDateNoTime, toDateNoTime] });
  },

  closeAndCleanToaster() {
    const setCustomState = get().effects.setCustomState;
    const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
    setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
  },

  clearEndUser() {
    set({ endUser: null });
  },

  clearReseller() {
    set({ reseller: null });
  },

  clearItems() {
    const gridItems = get().items;
    const gridSavedItems = get().savedItems;
    if (!gridSavedItems && isEqual(gridItems, gridSavedItems)) {
      set({ items: null });
    }
  },
});
