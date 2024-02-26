import React from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../utils/constants';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

const OrderTrackingDetailFooter = ({ content, config }) => {
  const userDataLS = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA))
    : null;
  const userData = useOrderTrackingStore((st) => st.userData);
  const currentUserData =
    isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : userDataLS;
  const activeCustomer = currentUserData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';
  const currency = content.paymentDetails?.currency;

  return (
    <>
      <div className="footer-container">
        <div className="box-container">
          <div className="box-container__leftPart">
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.footerLabels?.line1)}
            </span>
            <span className="box-container__leftPart-line2">
              {getDictionaryValueOrKey(config.footerLabels?.line2)}
            </span>
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.footerLabels?.line3)}{' '}
              <a href={config.footerLabels?.line3Link}>
                {getDictionaryValueOrKey(config.footerLabels?.line3Link)}
              </a>
            </span>
          </div>
          <div className="box-container__rightPart">
            <span className="box-container__rightPart-subtotalLabel">
              {getDictionaryValueOrKey(config.footerLabels?.totalOrderNetPrice)}
            </span>
            <span className="box-container__rightPart-subtotalValue">
              {content.paymentDetails?.subtotalFormatted}{' '}
              {currency ?? defaultCurrency}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderTrackingDetailFooter;
