import {
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  TOASTER_LOCAL_STORAGE_KEY,
} from '../../../../../utils/constants';
import { setLocalStorageData } from '../../OrdersTrackingGrid/Utils/gridUtils';
import { getLocalValueOrDefault } from './../../BaseGrid/store/GridStore';
import { differenceWith, isEqual, isEmpty } from 'lodash';
import _ from 'lodash/set';

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

const isArrayEqual = (x, y) => {
  return isEmpty(differenceWith(x, y, isEqual));
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
    } = get().filter;
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
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        orderFilterCounter: counter,
      },
    }));
  }
  function setFilterList(newFilterList = []) {
    set((state) => {
      const newState = { ...state };
      newState.filter.filterList = newFilterList;
      return newState;
    });
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

  function clearAllOrderFilters() {
    const { customFiltersChecked } = get().filter;

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
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        orderStatusFiltersChecked: [],
        orderTypeFiltersChecked: [],
        dateRangeFiltersChecked: [],
        customFiltersChecked: customFiltersToClear,
      },
    }));
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        customStartDate: undefined,
      },
    }));
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        customEndDate: undefined,
      },
    }));

    updateOrderFilterCounter();
  }
  function setFilterClicked(filterClicked) {
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        filterClicked,
      },
    }));
  }
  function setPredefinedFiltersApplied(predefinedFiltersApplied) {
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        predefinedFiltersApplied,
      },
    }));
  }
  function setCustomizedFiltersApplied(customizedFiltersApplied) {
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        customizedFiltersApplied,
      },
    }));
  }
  function clearCheckedButNotAppliedOrderFilters() {
    const { predefinedFiltersApplied, customizedFiltersApplied } = get().filter;
    const getFromPredefinedFilters = (group) =>
      predefinedFiltersApplied.filter((filter) => filter.group === group);
    const typeFilters = getFromPredefinedFilters('type');
    const statusFilters = getFromPredefinedFilters('status');
    const dateFilters = getFromPredefinedFilters('date');
    const customFilters = customizedFiltersApplied;
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        orderTypeFiltersChecked: structuredClone(typeFilters),
        orderStatusFiltersChecked: structuredClone(statusFilters),
        dateRangeFiltersChecked: structuredClone(dateFilters),
        customFiltersChecked: structuredClone(customFilters),
      },
    }));
    if (dateFilters.length === 0) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          currentStartDate: undefined,
          currentEndDate: undefined,
        },
      }));
    }
    updateOrderFilterCounter();
  }
  return {
    setCustomState,
    updateOrderFilterCounter,
    setFilterClicked,
    setPredefinedFiltersApplied,
    setCustomizedFiltersApplied,
    clearCheckedButNotAppliedOrderFilters,
    clearAllOrderFilters,
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
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          dateType,
        },
      }));
    },
    appliedFilterCount: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'count',
      0
    ),
    setOrderTypeFilters(orderTypeFilters) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          orderTypeFilters,
        },
      }));
    },
    setOrderStatusFilters(orderStatusFilters) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          orderStatusFilters,
        },
      }));
    },
    setOrderTypeFiltersChecked(orderTypeFiltersChecked) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          orderTypeFiltersChecked,
        },
      }));
      updateOrderFilterCounter();
    },
    setOrderStatusFiltersChecked(orderStatusFiltersChecked) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          orderStatusFiltersChecked,
        },
      }));
      updateOrderFilterCounter();
    },
    setDateRangeFiltersChecked(dateRangeFiltersChecked) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          dateRangeFiltersChecked,
        },
      }));
      updateOrderFilterCounter();
    },
    setPredefinedFiltersSelectedBefore(predefinedFiltersSelectedBefore) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          predefinedFiltersSelectedBefore,
        },
      }));
    },
    setPredefinedFiltersSelectedAfter(predefinedFiltersSelectedAfter) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          predefinedFiltersSelectedAfter,
        },
      }));
    },
    setCustomizedFiltersSelectedBefore(customizedFiltersSelectedBefore) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          customizedFiltersSelectedBefore,
        },
      }));
    },
    setCustomizedFiltersSelectedAfter(customizedFiltersSelectedAfter) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          customizedFiltersSelectedAfter,
        },
      }));
    },

    setAreThereAnyFiltersSelectedButNotApplied() {
      const {
        predefinedFiltersApplied,
        orderStatusFiltersChecked,
        orderTypeFiltersChecked,
        dateRangeFiltersChecked,
        customFiltersChecked,
        customizedFiltersApplied,
      } = get().filter;

      const checkedPredefinedFilters = [
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ];
      const areAnyPredefinedFiltersSelectedButNotApplied =
        !isArrayEqual(checkedPredefinedFilters, predefinedFiltersApplied) ||
        !isArrayEqual(predefinedFiltersApplied, checkedPredefinedFilters);

      const checkedCustomizedFilters = customFiltersChecked
        .filter((filter) => filter.checked)
        .map((filter) => filter.filterOptionKey);
      const customizedFiltersAppliedSimplified = customizedFiltersApplied
        .filter((filter) => filter.checked)
        .map((filter) => filter.filterOptionKey);
      const areAnyCustomFiltersSelectedButNotApplied =
        !isArrayEqual(
          checkedCustomizedFilters,
          customizedFiltersAppliedSimplified
        ) ||
        !isArrayEqual(
          customizedFiltersAppliedSimplified,
          checkedCustomizedFilters
        );
      const areThereAnyFiltersSelectedButNotApplied =
        areAnyPredefinedFiltersSelectedButNotApplied ||
        areAnyCustomFiltersSelectedButNotApplied;
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          areThereAnyFiltersSelectedButNotApplied,
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

    isChangeDetected() {
      const {
        predefinedFiltersSelectedBefore,
        customizedFiltersSelectedBefore,
        predefinedFiltersSelectedAfter,
        customizedFiltersSelectedAfter,
      } = get().filter;
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
      const { filterList } = get().filter;
      const updateList = filterList.map((filter) => {
        return { ...filter, open: false };
      });
      setFilterList(updateList);
    },

    closeAndCleanToaster() {
      const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
      setCustomState({ key: 'toaster', value: { isOpen: false } }, options);
    },
    setCurrentStartDate(currentStartDate) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          currentStartDate,
        },
      }));
    },
    setCurrentEndDate(currentEndDate) {
      set((state) => ({
        ...state,
        filter: {
          ...state.filter,
          currentEndDate,
        },
      }));
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
    setClearFilters() {
      clearAllOrderFilters();
      setFilterClicked(false);
      setPredefinedFiltersApplied([]);
      setCustomizedFiltersApplied([]);
      setLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY, {
        dates: [],
        types: [],
        statuses: [],
      });
      clearCheckedButNotAppliedOrderFilters();
    },
  };
};
