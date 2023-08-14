import Create from 'zustand';
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

const INITIAL_STATE = {
  ...basicGridState,
  ...paginationState,
  isFilterModalOpen: false,
  filterList: [],
  branding: '',
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
  dateType: null,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  filterDefaultDateRange: false,
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
  predefinedFiltersSelectedBefore: [],
  predefinedFiltersSelectedAfter: [],
  customizedFiltersSelectedBefore: [],
  customizedFiltersSelectedAfter: [],
  orderTypeFiltersChecked: [],
  orderStatusFiltersChecked: [],
  dateRangeFiltersChecked: [],
  customFiltersChecked: [],
  orderFilterCounter: 0,
  filterClicked: false,
  toaster: {
    isOpen: false,
    title: '',
    message: '',
    origin: 'dashboard',
    isSuccess: false,
  },
  isTDSynnex: true,
  branding: '',
  analyticsCategory: 'order tracking',
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
