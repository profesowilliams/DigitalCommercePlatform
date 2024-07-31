import Create from 'zustand';
import {
  basicGridState,
  paginationState
} from '../../BaseGrid/store/GridStore';
import { orderTrackingEffects } from './OrderTrackingStoreEffects';

const INITIAL_STATE = {
  ...basicGridState,
  ...paginationState,

  branding: '',
  userData: null,
  isAvailable: true,
  toolTipData: {
    value: '',
    x: 0,
    y: 0,
    show: false,
  },
  toaster: {
    isOpen: false,
    title: '',
    message: '',
    origin: 'dashboard',
    isSuccess: false,
  },
  isTDSynnex: true,
  analyticsCategory: 'order tracking',
  orderModification: {
    reasonDropdownValues: [],
    doesReasonDropdownHaveEmptyItems: false,
  },
  trackAndTraceCounter: 1,
  exportFlyoutSource: null,
  featureFlags: {
    orderModification: false,
    proactiveMessage: false,
    endUserInformation: false,
    groupLines: false,
    alternativeSearch: false,
  },
  uiTranslations: {},
  orderDetailSubtotalValue: null,
  mainGridRowsTotalCounter: null,
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
