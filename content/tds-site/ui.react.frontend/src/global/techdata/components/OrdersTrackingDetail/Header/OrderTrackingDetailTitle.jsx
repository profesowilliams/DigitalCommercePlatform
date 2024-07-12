import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';

const OrderTrackingDetailTitle = ({ content, labels, isLoading }) => {

  const [statusText, setStatusText] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [completeDeliveryOnlyAvailable, setCompleteDeliveryOnlyAvailable] = useState(false);

  const { orderNo, completeDeliveryOnly } = labels;

  useEffect(() => {
    console.log('OrderTrackingDetailTitle::useEffect::content');

    if (!content) return;

    setStatusText(content.statusText);
    setOrderNumber(content.orderNumber);
    setCompleteDeliveryOnlyAvailable(content.shipComplete === true);
  }, [content]);

  if (isLoading) {
    return (<div className="quote-preview-title"><LoaderIcon /></div>);
  }

  return (
    <div className="quote-preview-title">
      <span className="quote-preview-bold">
        {`${getDictionaryValueOrKey(orderNo)}: `}
      </span>
      <span className="quote-preview">{orderNumber}</span>
      <span className="quote-preview-bold quote-preview-offset">|</span>
      <span className="quote-preview-bold quote-preview-offset">
        {statusText}
      </span>
      {completeDeliveryOnlyAvailable && (
        <span className="quote-preview">
          {` ${getDictionaryValueOrKey(completeDeliveryOnly)}`}
        </span>
      )}
    </div>
  );
};

export default OrderTrackingDetailTitle;