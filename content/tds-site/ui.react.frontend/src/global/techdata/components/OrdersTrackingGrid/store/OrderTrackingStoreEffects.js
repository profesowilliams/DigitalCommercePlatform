import {
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  TOASTER_LOCAL_STORAGE_KEY,
} from '../../../../../utils/constants';
import { setLocalStorageData } from '../utils/gridUtils';
import { getLocalValueOrDefault } from './../../BaseGrid/store/GridStore';
import { difference, isEqual } from 'lodash';

const areCustomFiltersEqual = (beforeFilters, afterFilters) => {
  let counterBeforeFilters = 0;
  beforeFilters?.map((element) => {
    element?.filterOptionList?.map((filter) => {
      filter?.checked === true && counterBeforeFilters++;
    });
  });
  let counterAfterFilters = 0;
  afterFilters?.map((element) => {
    element?.filterOptionList?.map((filter) => {
      filter?.checked === true && counterAfterFilters++;
    });
  });
  if (counterBeforeFilters === 0 && counterAfterFilters === 0) {
    return true;
  }
  return isEqual(beforeFilters, afterFilters);
};

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
    setPredefinedFiltersApplied(predefinedFiltersApplied) {
      set({ predefinedFiltersApplied });
    },
    setCustomizedFiltersApplied(customizedFiltersApplied) {
      set({ customizedFiltersApplied });
    },
    setAreThereAnyFiltersSelectedButNotApplied() {
      const {
        predefinedFiltersApplied,
        orderStatusFiltersChecked,
        orderTypeFiltersChecked,
        dateRangeFiltersChecked,
        customFiltersChecked,
        customizedFiltersApplied,
      } = get();

      const checkedPredefinedFilters = [
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ];
      const areAnyPredefinedFiltersSelectedButNotApplied =
        difference(checkedPredefinedFilters, predefinedFiltersApplied).length >
          0 ||
        checkedPredefinedFilters.length !== predefinedFiltersApplied.length;
      const checkedCustomizedFilters = customFiltersChecked
        .filter((filter) => filter.checked)
        .map((filter) => filter.filterOptionKey);
      const customizedFiltersAppliedSimplified = customizedFiltersApplied
        .filter((filter) => filter.checked)
        .map((filter) => filter.filterOptionKey);
      const areAnyCustomFiltersSelectedButNotApplied =
        difference(checkedCustomizedFilters, customizedFiltersAppliedSimplified)
          .length > 0 ||
        checkedCustomizedFilters.length !==
          customizedFiltersAppliedSimplified.length;

      const areThereAnyFiltersSelectedButNotApplied =
        areAnyPredefinedFiltersSelectedButNotApplied ||
        areAnyCustomFiltersSelectedButNotApplied;
      set({ areThereAnyFiltersSelectedButNotApplied });
    },
    setSearch90DaysBack(filterDefaultDateRange) {
      set({ filterDefaultDateRange });
    },
    setReasonDropdownValues(reasonDropdownValues) {
      set({
        reasonDropdownValues,
      });
    },
    setDoesReasonDropdownHaveEmptyItems(doesReasonDropdownHaveEmptyItems) {
      set({ doesReasonDropdownHaveEmptyItems });
    },
    clearCheckedButNotAppliedOrderFilters() {
      const { predefinedFiltersApplied, customizedFiltersApplied } = get();
      const getFromPredefinedFilters = (group) =>
        predefinedFiltersApplied.filter((filter) => filter.group === group);
      const typeFilters = getFromPredefinedFilters('type');
      const statusFilters = getFromPredefinedFilters('status');
      const dateFilters = getFromPredefinedFilters('date');
      const customFilters = customizedFiltersApplied;
      set({
        orderTypeFiltersChecked: structuredClone(typeFilters),
        orderStatusFiltersChecked: structuredClone(statusFilters),
        dateRangeFiltersChecked: structuredClone(dateFilters),
        customFiltersChecked: structuredClone(customFilters),
      });
      updateOrderFilterCounter();
    },
    isChangeDetected() {
      const {
        predefinedFiltersSelectedBefore,
        customizedFiltersSelectedBefore,
        predefinedFiltersSelectedAfter,
        customizedFiltersSelectedAfter,
      } = get();
      return (
        !isEqual(
          predefinedFiltersSelectedBefore,
          predefinedFiltersSelectedAfter
        ) ||
        !areCustomFiltersEqual(
          customizedFiltersSelectedBefore,
          customizedFiltersSelectedAfter
        )
      );
    },
    closeAllFilterOptions() {
      const { filterList } = get();
      const updateList = filterList.map((filter) => {
        return { ...filter, open: false };
      });
      setFilterList(updateList);
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
    setFilterClicked(filterClicked) {
      set({ filterClicked });
    },
    closeAndCleanToaster() {
      const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
      setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
    },
  };
};
