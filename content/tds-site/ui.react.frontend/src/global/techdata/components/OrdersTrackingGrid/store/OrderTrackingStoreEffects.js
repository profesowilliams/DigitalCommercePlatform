import {
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  TOASTER_LOCAL_STORAGE_KEY,
} from '../../../../../utils/constants';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../RenewalsGrid/utils/renewalUtils';
import { getLocalValueOrDefault } from './../../BaseGrid/store/GridStore';

export const orderTrackingEffects = (set, get) => {
  function setDatePickerState(fromDate = '', toDate = '') {
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
  }
  function updateOrderFilterCounter() {
    const {
      orderStatusFiltersChecked,
      orderTypeFiltersChecked,
      dateRangeFiltersChecked,
      customFiltersChecked,
    } = get();
    let customCounter = 0;
    customFiltersChecked.map((filter) =>
      filter?.filterOptionList
        ? filter.filterOptionList.map(
            (element) => element.checked && customCounter++
          )
        : filter?.dataRangeLabel && customCounter++
    );
    const counter =
      orderStatusFiltersChecked.length +
      orderTypeFiltersChecked.length +
      dateRangeFiltersChecked.length +
      customCounter;
    set({ orderFilterCounter: counter });
  }
  function setFilterList(newFilterList = []) {
    set({ filterList: [...newFilterList] });
  }
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
    toggleFilterModal(options = {}) {
      const { justClose = false } = options;
      const { isFilterModalOpen } = get();
      if (justClose) return set({ isFilterModalOpen: false });
      set({ isFilterModalOpen: !isFilterModalOpen });
    },
    setFilterList,
    setDatePickerState,
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
      set({ dateType });
    },
    appliedFilterCount: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'count',
      0
    ),
    setOrderTypeFilters(orderTypeFilters) {
      set({ orderTypeFilters });
    },
    setOrderStatusFilters(orderStatusFilters) {
      set({ orderStatusFilters });
    },
    setOrderTypeFiltersChecked(orderTypeFiltersChecked) {
      set({ orderTypeFiltersChecked });
      updateOrderFilterCounter();
    },
    setOrderStatusFiltersChecked(orderStatusFiltersChecked) {
      set({ orderStatusFiltersChecked });
      updateOrderFilterCounter();
    },
    setDateRangeFiltersChecked(dateRangeFiltersChecked) {
      set({ dateRangeFiltersChecked });
      updateOrderFilterCounter();
    },
    setCustomFiltersChecked(customFiltersChecked) {
      set({ customFiltersChecked });
      updateOrderFilterCounter();
    },
    setPredefinedFiltersSelectedBefore(predefinedFiltersSelectedBefore) {
      set({ predefinedFiltersSelectedBefore });
    },
    setPredefinedFiltersSelectedAfter(predefinedFiltersSelectedAfter) {
      set({ predefinedFiltersSelectedAfter });
    },
    setCustomizedFiltersSelectedBefore(customizedFiltersSelectedBefore) {
      set({ customizedFiltersSelectedBefore });
    },
    setCustomizedFiltersSelectedAfter(customizedFiltersSelectedAfter) {
      set({ customizedFiltersSelectedAfter });
    },
    clearAllOrderFilters() {
      const { customFiltersChecked } = get();

      const clearDate = (custom) => {
        custom.startDate = null;
        custom.endDate = null;
        custom.dataRangeLabel = null;
      };

      let customFiltersToClear = customFiltersChecked;
      customFiltersToClear.map((custom) => {
        custom?.group === 'customDate' && clearDate(custom);
        custom?.filterOptionList &&
          custom.filterOptionList.map((element) => {
            element.checked = false;
          });
      });

      set({
        orderStatusFiltersChecked: [],
        orderTypeFiltersChecked: [],
        dateRangeFiltersChecked: [],
        customFiltersChecked: customFiltersToClear,
      });
      setCustomState({
        key: 'customStartDate',
        value: undefined,
      });
      setCustomState({
        key: 'customEndDate',
        value: undefined,
      });
      updateOrderFilterCounter();
    },
    closeAndCleanToaster() {
      const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
      setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
    },
  };
};
