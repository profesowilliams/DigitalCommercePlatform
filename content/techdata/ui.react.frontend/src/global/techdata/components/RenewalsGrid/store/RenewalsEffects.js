import { FILTER_LOCAL_STORAGE_KEY, TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { checkIfAnyDateRangeIsCleared, getLocalStorageData, removeLocalStorageData, setLocalStorageData } from "../utils/renewalUtils";

export const renewalsEffects = (set, get) => {
  function setFilterList(newFilterList = []) {
    set({ filterList: [...newFilterList] });
  }

  function toggleFilterModal(options = {}) {
    const { justClose = false } = options;
    const { isFilterModalOpen } = get();
    if (justClose) {
      if (isFilterModalOpen) {
        set({ isFilterModalOpen: false });
      }
      return;
    }

    set({ isFilterModalOpen: !isFilterModalOpen });
  }

  function toggleFilterButtonDisable(flag) {
    set({ isFilterButtonDisable: flag });
  }

  function finalResults(filteredList = []) {
    set({ finalResults: filteredList })
  }

  function setToolTipData(data = {}) {
    set({
      toolTipData: {
        value: data.value,
        x: data.x,
        y: data.y,
        show: data.show,
      }
    })
  }

  function closeAllSections(focusedInput) {
    const { dateSelected } = get();
    const keepOpenList = dateSelected ? ['date'] : [];
    const keepOpened = ({ field }) => keepOpenList.includes(field);
    const filterList = get().filterList.map(filter => ({ ...filter, open: keepOpened(filter) }));
    if (focusedInput) {
      set({ filterList });
    }
  }

  function setDateOptionsList(itemIndex) {
    const { dateOptionsList } = get();
    const indexFound = dateOptionsList.findIndex((_, index) => index === itemIndex);
    if (indexFound !== -1) {
      const options = dateOptionsList.slice().map(item => ({ ...item, checked: false }));
      options[indexFound].checked = true;
      const dateSelected = options[indexFound].field;
      set({ dateOptionsList: options, dateSelected })
    }
  }

  function setDatePickerState(fromDate = '', toDate = '') {
    const deleteTimeZoneRegex = /T((?:\d{2}:){2}.*)$/g;
    const fromDateNoTime = fromDate ? new Date(fromDate).toISOString().replace(deleteTimeZoneRegex, () => 'T00:00:00.000Z') : null;
    const toDateNoTime = toDate ? new Date(toDate).toISOString().replace(deleteTimeZoneRegex, () => 'T05:00:00.000Z') : null;
    set({ datePickerState: [fromDateNoTime, toDateNoTime] })
  }

  function clearDateFilters() {
    const { dateOptionsList } = get();
    const allOptionsFalse = dateOptionsList.slice().map(item => ({ ...item, checked: false }));
    set({ datePickerState: null, dateOptionsList: allOptionsFalse, dateSelected: null, customStartDate: null, customEndDate: null });
  }

  function setAppliedFilterCount() {
    const { filterList, dateSelected } = get();
    let count = 0;

    filterList.forEach((item) => {
      if (item.childIds.length === 0 && item.checked === true) {
        count += 1;
      }
    });

    set({
      appliedFilterCount: dateSelected ? count += 1 : count,
    });

    let filterObj = { ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY), ...{ count } };
    setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, filterObj);
  }

  function setCustomState({ key = '', value }, options) {
    if (options && options.saveToLocal === true) {
      setLocalStorageData(options.key, value);
    }
    if (options && options.clearLocal === true) {
      removeLocalStorageData(options.key)
    }
    const currentState = get()[key] || value;
    if (typeof value === "object" && !Array.isArray(value)) return set({ [key]: { ...currentState, ...value } })
    set({ [key]: value })
  }

  function setDateOptionList(dateOptionsList) {
    if (!dateOptionsList) return;
    const dateOptionsWithLocalStorage = dateOptionsList.map(item => ({ ...item, checked: item.field === getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected }));
    set({ dateOptionsList: dateOptionsWithLocalStorage });
  }

  function closeAndCleanToaster() {
    const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
    setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
  }

  function checkOptionListSelected() {
    const { dateOptionsList, filterList, customStartDate, customEndDate } = get();
    const isChecked = (field) => field === getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected;
    const dateOptionsListLocalChecked = dateOptionsList.map(item => ({ ...item, checked: isChecked(item.field) }));
    const mutatedDateList = checkIfAnyDateRangeIsCleared({ dateOptionsList, filterList, customStartDate, customEndDate })
    if (!mutatedDateList) return set({ dateOptionsList: dateOptionsListLocalChecked })
    const { dateOptionsUncheckedList } = mutatedDateList;
    set({ dateOptionsList: dateOptionsUncheckedList });
  }

  function clearUnappliedDateRange() {
    const { dateOptionsList } = get();
    const dateApplied = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected;
    const isChecked = (field) => field === dateApplied;
    const dateOptionsListLocalChecked = dateOptionsList.map(item => ({ ...item, checked: isChecked(item.field) }));
    if (dateApplied && dateApplied !== 'custom') {
      set({ dateOptionsList: dateOptionsListLocalChecked, customStartDate: null, customEndDate: null, datePickerState: null });
    } else if (!dateApplied) {
      clearDateFilters();
    }
  }

  function resetFilterToState() {
    const appliedFilters = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY);
    const filtersDefault = closeSections([]).map((filter, index) => {
      if (index !== 0) {
        return { ...filter, applied: false, checked: false, open: false };
      }
      return filter;
    });
    setDatePickerState(appliedFilters?.customStartDate, appliedFilters?.customEndDate);
    set({
      filterList: appliedFilters?.filterList || filtersDefault,
      dateSelected: appliedFilters?.dateSelected,
      customStartDate: appliedFilters?.customStartDate,
      customEndDate: appliedFilters?.customEndDate,
    });
  }

  function closeSections(keepOpenList) {
    const { filterList } = get();
    const keepOpened = ({ field }) => keepOpenList.includes(field);
    const filterListCopy = filterList.map(filter => {
      let isOpen = false;
      if (keepOpened(filter)) {
        isOpen = filter.open;
      }
      return ({ ...filter, open: isOpen })
    });
    return filterListCopy;
  }

  function setAppliedFilter(optionFields) {
    const { filterList, dateSelected, customStartDate, customEndDate } = get();
    setAppliedFilterCount();
    const activeSections = filterList.map(item => {
      if (item.field === 'date' && dateSelected) {
        return item.field;
      }
      if (item.checked && item.hasOwnProperty('parentId')) {
        return item.field;
      }
    }).filter((element, index, arr) => {
      return element && arr.indexOf(element) === index
    })
    const filtersCopy = closeSections(activeSections).map((filter, index) => {
      if (index !== 0) {
        const applied = filter.checked;
        return { ...filter, applied };
      }
      return filter;
    });
    setFilterList(filtersCopy);
    setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, {
      ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY),
      optionFields,
      dateSelected,
      customStartDate: dateSelected === 'custom' ? customStartDate : null,
      customEndDate: dateSelected === 'custom' ? customEndDate : null,
      filterList: filtersCopy
    });
  }

  function refreshRenealsGrid() {
    set({ renewalsGridRefreshIndex: get().renewalsGridRefreshIndex + 1 });
  }

  function setRenewalsGridActionPerformed(selectedColumn) {
    set({
      renewalsGridActionPerformed: true,
      renewalsGridActionPerformedColumn: selectedColumn
    });
  }

  function resetRenewalsGridActionPerformed() {
    set({renewalsGridActionPerformed : false});
  }

  return {
    setFilterList,
    toggleFilterModal,
    toggleFilterButtonDisable,
    finalResults,
    closeAllSections,
    setDateOptionsList,
    setDatePickerState,
    clearDateFilters,
    setCustomState,
    setAppliedFilterCount,
    setToolTipData,
    setDateOptionList,
    closeAndCleanToaster,
    checkOptionListSelected,
    clearUnappliedDateRange,
    resetFilterToState,
    setAppliedFilter,
    refreshRenealsGrid,
    setRenewalsGridActionPerformed,
    resetRenewalsGridActionPerformed,
  };
};
