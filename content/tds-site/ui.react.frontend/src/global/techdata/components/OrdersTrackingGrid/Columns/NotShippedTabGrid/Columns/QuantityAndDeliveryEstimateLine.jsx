import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { WarningTriangle } from '../../../../../../../fluentIcons/FluentIcons';

function QuantityAndDeliveryEstimateLine({ line, el, index, config }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isEOL = line?.isEOL;

  const shipDateText = el.shipDateDetailsTranslated || el.shipDateFormatted;

  const EOLStatus = (
    <>
      <span className="line-status">
        <WarningTriangle />
        {getDictionaryValueOrKey(config?.endOfLife)}
      </span>
    </>
  );

  return (
    <div
      key={el.id}
      className={
        'order-line-details__content__innerTableNotShipped__container-row'
      }
    >
      <div
        className={`order-line-details__content__innerTableNotShipped${
          isSingleElement || isLastElement
            ? '__separateLine'
            : '__separateLineMultiple'
        }`}
      >
        <span className="order-line-details__content__innerTableNotShipped__separateLineText">
          {el.quantity} / {line.orderQuantity}
        </span>
      </div>
      <div
        className={`order-line-details__content__innerTableNotShipped${
          isSingleElement || isLastElement
            ? '__separateLine'
            : '__separateLineMultiple'
        } order-line-details__content__innerTableNotShipped__delivery-column`}
      >
        {shipDateText ? (
          <span className="order-line-details__content__innerTableNotShipped__separateLineText">
            {el.shipDateFormatted ? el.shipDateFormatted : ''}
            <br />
            {el.shipDateDetailsTranslated ? el.shipDateDetailsTranslated : ''}
          </span>
        ) : (
          <span></span>
        )}
        {el.statusText ? (
          <span className="order-line-details__content__innerTableNotShipped__separateLineText">
            {isEOL ? EOLStatus : el.statusText || ''}
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
export default QuantityAndDeliveryEstimateLine;
