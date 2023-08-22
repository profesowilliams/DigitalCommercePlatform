import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../utils/constants';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import { getSessionInfo } from "../../../../utils/user/get";

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
    getSessionInfo().then((data) => {
      setUserData(data[1]);
    });
  }, []);

  return (
    <>
      <div className="footer-container">
        <div className="box-container">
          <div className="box-container__leftPart">
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.labels?.detailsFooterLine1)}
            </span>
            <span className="box-container__leftPart-line2">
              {getDictionaryValueOrKey(config.labels?.detailsFooterLine2)}
            </span>
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.labels?.detailsFooterLine3)}
              <a href={config.labels?.detailsFooterLine3Link}>
                {getDictionaryValueOrKey(config.labels?.detailsFooterLine3Link)}
              </a>
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
              {apiResponse?.content?.paymentDetails?.totalChargeFormatted}{' '}
              {currency ?? defaultCurrency}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderTrackingDetailFooter;
