import { TOASTER_LOCAL_STORAGE_KEY, } from '../../../../../utils/constants';
import { setLocalStorageData } from '../../OrdersTrackingGrid/Utils/gridUtils';

export const orderTrackingEffects = (set, get) => {
  
  function setCustomState({ key = '', value }, options) {
    if (options && options.saveToLocal === true) {
      setLocalStorageData(options.key, value);
    }
    const currentState = get()[key] || value;
    if (typeof value === 'object' && !Array.isArray(value))
      return set({ [key]: { ...currentState, ...value } });
    set({ [key]: value });
  }

  return {
    setCustomState,
    setUserData(data) {
      set({ userData: data });
    },
    toggleFilterModal(options = {}) {
      const { justClose = false } = options;
      const { isFilterModalOpen } = get().filter;
      if (justClose)
        return set((state) => ({
          ...state,
          filter: {
            ...state.filter,
            isFilterModalOpen: false,
          },
        }));
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          isFilterModalOpen: !state.filter.isFilterModalOpen,
        },
      }));
    },
    setToolTipData(data = {}) {
      set({
        toolTipData: {
          value: data.value,
          x: data.x,
          y: data.y,
          show: data.show,
        },
      });
    },
    setDateType(dateType) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          dateType,
        },
      }));
    },
    setReasonDropdownValues(reasonDropdownValues) {
      set((state) => ({
        ...state,
        orderModification: {
          ...state.orderModification,
          reasonDropdownValues,
        },
      }));
    },
    setDoesReasonDropdownHaveEmptyItems(doesReasonDropdownHaveEmptyItems) {
      set((state) => ({
        ...state,
        orderModification: {
          ...state.orderModification,
          doesReasonDropdownHaveEmptyItems,
        },
      }));
    },
    closeAndCleanToaster() {
      const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
      setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
    },
    setReturnCounter(value) {
      set((state) => ({
        ...state,
        returnCounter: value,
      }));
    },
    setTrackAndTraceCounter(value) {
      set((state) => ({
        ...state,
        trackAndTraceCounter: value,
      }));
    },
    setExportFlyoutSource(value) {
      set((state) => ({
        ...state,
        exportFlyoutSource: value,
      }));
    },
    setRefinements(value) {
      set((state) => ({
        ...state,
        refinements: value,
      }));
    },
    setFeatureFlags(value) {
      set((state) => ({
        ...state,
        featureFlags: {
          orderModification: value?.OrderModification || false,
          proactiveMessage: value?.ProactiveMessage || false,
          endUserInformation: value?.EndUserInformation || false,
          groupLines: value?.GroupLines || false,
          alternativeSearch: value?.AlternativeSearch || false,
        },
      }));
    },
    setTranslations(value) {
      set((state) => ({
        ...state,
        uiTranslations: value,
      }));
    },
    setOrderDetailSubtotalValue(value) {
      set((state) => ({
        ...state,
        orderDetailSubtotalValue: value,
      }));
    },
    hasRights(right) {
      const { userData } = get();
      return userData?.roleList?.some((role) => role.entitlement === right);
    },
    setMainGridRowsTotalCounter (value) {
      set((state) => ({
        ...state,
        mainGridRowsTotalCounter: value,
      }));
    },
  };
};
