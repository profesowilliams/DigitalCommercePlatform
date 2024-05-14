import React from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../utils/constants';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

const OrderTrackingDetailFooter = ({ content, config }) => {
  const { paymentDetails, lastDataSource } = content || null;
  const userDataLS = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA))
    : null;
  const userData = useOrderTrackingStore((state) => state.userData);
  const orderDetailSubtotalValue = useOrderTrackingStore(
    (state) => state.orderDetailSubtotalValue
  );
  const currentUserData =
    isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : userDataLS;
  const activeCustomer = currentUserData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';
  const currency = paymentDetails?.currency;
  const priceLoading = lastDataSource === 'OrderModification';
  return (
    <>
      <div className="footer-container">
        <div className="box-container">
          <div className="box-container__leftPart">
            {priceLoading ? (
              <span className="box-container__leftPart-line1">
                {getDictionaryValueOrKey(
                  config.footerLabels?.priceLoadingMessage
                )}
              </span>
            ) : (
              <span className="box-container__leftPart-line1">
                {getDictionaryValueOrKey(config.footerLabels?.line1)}
              </span>
            )}
            <span className="box-container__leftPart-line2">
              {getDictionaryValueOrKey(config.footerLabels?.line2)}
            </span>
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.footerLabels?.line3)}{' '}
              <a href={config.footerLabels?.line3Link} target="_blank">
                {getDictionaryValueOrKey(config.footerLabels?.line3Link)}
              </a>
            </span>
          </div>
          {!priceLoading && (
            <div className="box-container__rightPart">
              <span className="box-container__rightPart-subtotalLabel">
                {getDictionaryValueOrKey(
                  config.footerLabels?.totalOrderNetPrice
                )}
              </span>
              <span className="box-container__rightPart-subtotalValue">
                {orderDetailSubtotalValue?.toFixed(2) ||
                  paymentDetails?.subtotalFormatted}{' '}
                {currency ?? defaultCurrency}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default OrderTrackingDetailFooter;
