import React from 'react';
function QuantityAndDeliveryEstimateLine({ line, el, index }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;

  const shipDateText = el.shipDateDetailsTranslated || el.shipDateFormatted;
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
            {el.statusText}
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
export default QuantityAndDeliveryEstimateLine;
