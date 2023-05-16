import Create from 'zustand';
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import {
  basicGridState,
  paginationState,
  getLocalValueOrDefault,
} from '../../BaseGrid/store/GridStore';
import { orderTrackingEffects } from './OrderTrackingStoreEffects';
import { getDictionaryValue } from '../../../../../utils/utils';

const orderDate = getDictionaryValue(
  'grids.common.label.orderDate',
  'Order date'
);

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
  dateType: orderDate,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  orderTypeFilters: getLocalValueOrDefault(
    ORDER_FILTER_LOCAL_STORAGE_KEY,
    'orderTypeFilters',
    [
      getDictionaryValue('ZZCC', 'InTouch'),
      getDictionaryValue('ZZCT', 'Manual'),
      getDictionaryValue('ZZED', 'EDI or XML'),
      getDictionaryValue('ZZIT', 'InTouch'),
      getDictionaryValue('ZZKB', 'Consignment Fill-Up'),
      getDictionaryValue('ZZLV', 'License'),
      getDictionaryValue('ZZMR', 'TDMRS Project'),
      getDictionaryValue('ZZOR', 'Manual'),
      getDictionaryValue('ZZPB', 'Manual'),
      getDictionaryValue('ZZPE', 'TD Staff purchase'),
      getDictionaryValue('ZZPT', 'Project order'),
      getDictionaryValue('ZZQT', 'Quotation'),
      getDictionaryValue('ZZSB', 'Third Party'),
      getDictionaryValue('ZZSL', 'Licensing'),
      getDictionaryValue('ZZSO', 'Stocking Order'),
      getDictionaryValue('ZZST', 'StreamOne'),
    ]
  ),
  orderStatusFilters: getLocalValueOrDefault(
    ORDER_FILTER_LOCAL_STORAGE_KEY,
    'orderStatusFilters',
    ['Open', 'Investigation', 'Shipping', 'Rejected', 'Complete']
  ),
  orderTypeFiltersChecked: getLocalValueOrDefault(
    ORDER_FILTER_LOCAL_STORAGE_KEY,
    'orderTypeFiltersChecked',
    []
  ),
  orderStatusFiltersChecked: getLocalValueOrDefault(
    ORDER_FILTER_LOCAL_STORAGE_KEY,
    'orderStatusFiltersChecked',
    []
  ),
  dateRangeFiltersChecked: getLocalValueOrDefault(
    ORDER_FILTER_LOCAL_STORAGE_KEY,
    'dateRangeFiltersChecked',
    []
  ),
  orderFilterCounter: 0,
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
