import Create from 'zustand';
import moment from 'moment';
import {
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  PLANS_ACTIONS_LOCAL_STORAGE_KEY,
} from '../../../../../utils/constants';
import {
  basicGridState,
  paginationState,
  getLocalValueOrDefault,
} from '../../BaseGrid/store/GridStore';
import { orderTrackingEffects } from './OrderTrackingStoreEffects';
import { getLocalStorageData } from '../utils/gridUtils';

const getInitialPredefinedFilters = () => {
  const filtersFromLS = getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY);
  const { dates, types, statuses } = filtersFromLS;
  return [...dates, ...types, ...statuses];
};

const getCurrentStartDate = () => {
  const dateFilters = getLocalStorageData(
    ORDER_FILTER_LOCAL_STORAGE_KEY
  )?.dates;
  const currentCreatedFrom = dateFilters?.[0]?.createdFrom;
  return currentCreatedFrom ? moment(currentCreatedFrom).toISOString() : null;
};

const getCurrentEndDate = () => {
  const dateFilters = getLocalStorageData(
    ORDER_FILTER_LOCAL_STORAGE_KEY
  )?.dates;
  const currenCreatedTo = dateFilters?.[0]?.createdTo;
  return currenCreatedTo ? moment(currenCreatedTo).toISOString() : null;
};

const INITIAL_STATE = {
  ...basicGridState,
  ...paginationState,

  branding: '',
  userData: null,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  filter: {
    isFilterModalOpen: false,
    filterList: [],
    dateType: getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY)?.dates?.[0]
      ?.dateType,
    customStartDate: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'customStartDate',
      undefined
    ),
    customEndDate: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'customEndDate',
      undefined
    ),
    detailRender: getLocalValueOrDefault(
      PLANS_ACTIONS_LOCAL_STORAGE_KEY,
      'detailRender',
      'primary'
    ),
    dateSelected: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'dateSelected',
      null
    ),
    appliedFilterCount: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'count',
      0
    ),
    orderTypeFilters: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'orderTypeFilters',
      []
    ),
    orderStatusFilters: getLocalValueOrDefault(
      ORDER_FILTER_LOCAL_STORAGE_KEY,
      'orderStatusFilters',
      []
    ),
    predefinedFiltersApplied:
      (getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY) &&
        getInitialPredefinedFilters()) ||
      [],
    orderTypeFiltersChecked:
      getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY)?.types || [],
    orderStatusFiltersChecked:
      getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY)?.statuses || [],
    dateRangeFiltersChecked:
      getLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY)?.dates || [],
    customFiltersChecked: [],
    customizedFiltersApplied: [],
    areThereAnyFiltersSelectedButNotApplied: false,
    predefinedFiltersSelectedBefore: [],
    predefinedFiltersSelectedAfter: [],
    customizedFiltersSelectedBefore: [],
    customizedFiltersSelectedAfter: [],
    orderFilterCounter: 0,
    filterClicked: false,
    currentStartDate: getCurrentStartDate(),
    currentEndDate: getCurrentEndDate(),
  },
  toaster: {
    isOpen: false,
    title: '',
    message: '',
    origin: 'dashboard',
    isSuccess: false,
  },
  showCriteria: true,
  isTDSynnex: true,
  analyticsCategory: 'order tracking',
  orderModification: {
    reasonDropdownValues: [],
    doesReasonDropdownHaveEmptyItems: false,
  },
};

const store = (set, get) => ({
  ...INITIAL_STATE,
  effects: orderTrackingEffects(set, get),
});

export const useOrderTrackingStore = Create(store);

if (process.env.NODE_ENV === 'development') {
  import('simple-zustand-devtools').then(({ mountStoreDevtool }) => {
    mountStoreDevtool('OrderTrackingStore', useOrderTrackingStore);
  });
}
