import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../utils/constants';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';

//TODO: Add or delete the left part of footer
const OrderTrackingDetailFooter = ({ apiResponse, config }) => {
  const [userData, setUserData] = useState(null);
  const userDataLS = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA))
    : null;
  const currentUserData =
    isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : userDataLS;
  const activeCustomer = currentUserData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';
  const currency = apiResponse?.content?.paymentDetails?.currency;
  const multiplePages = apiResponse?.content?.items.length > 25;
  useEffect(() => {
    window.getSessionInfo &&
      window.getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
  }, []);

  return (
    <div className="box-container">
      <div className="box-container__leftPart">
        <span className="box-container__leftPart-line1">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </span>
        <span className="box-container__leftPart-line2">
          Lorem ipsum dolor, sit amet consectetur.
        </span>
      </div>
      <div className="box-container__rightPart">
        <span className="box-container__rightPart-subtotalLabel">
          {multiplePages
            ? `${getDictionaryValueOrKey(
                config.labels?.detailsOrderSubtotal
              )}: `
            : `${getDictionaryValueOrKey(
                config.labels?.detailsTotalOrderNetPrice
              )}: `}
        </span>
        <span className="box-container__rightPart-subtotalValue">
          {apiResponse?.content?.paymentDetails?.totalChargeFormatted}
          {currency ?? defaultCurrency}
        </span>
      </div>
    </div>
  );
};
export default OrderTrackingDetailFooter;
