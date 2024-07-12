import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import { LoaderIcon } from '../../../../fluentIcons/FluentIcons';

const OrderTrackingDetailFooter = ({
  content,
  config,
  isLoading
}) => {
  const userData = useOrderTrackingStore((state) => state.userData);

  //TODO:remove store
  const orderDetailSubtotalValue = useOrderTrackingStore(
    (state) => state.orderDetailSubtotalValue
  );
  const activeCustomer = userData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';

  const [currency, setCurrency] = useState('');
  const [priceLoading, setPriceLoading] = useState('');
  const [subtotalFormatted, setSubtotalFormatted] = useState('');

  useEffect(() => {
    console.log('OrderTrackingDetailFooter::useEffect::content');

    if (!content) return;

    setCurrency(content.paymentDetails?.currency ?? defaultCurrency);
    setPriceLoading(content.lastDataSource === 'OrderModification');
    setSubtotalFormatted(orderDetailSubtotalValue?.toFixed(2) || content.paymentDetails?.subtotalFormatted);

  }, [content]);

  if (isLoading) {
    return (
      <div className="footer-container">
        <div className="box-container">
          <LoaderIcon />
        </div>
      </div>);
  }

  return (
    <div className="footer-container">
      <div className="box-container">
        <div className="box-container__leftPart">
          {priceLoading ? (
            <span className="box-container__leftPart-line1">
              {getDictionaryValueOrKey(config.footerLabels?.priceLoadingMessage)}
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
              {getDictionaryValueOrKey(config.footerLabels?.totalOrderNetPrice)}
            </span>
            <span className="box-container__rightPart-subtotalValue">
              {subtotalFormatted}{' '}{currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingDetailFooter;