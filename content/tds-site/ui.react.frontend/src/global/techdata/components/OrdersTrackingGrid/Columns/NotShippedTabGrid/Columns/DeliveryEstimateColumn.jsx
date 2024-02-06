import React from 'react';
function DeliveryEstimateColumn({ line}) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-column">
      {line?.lineDetails?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;

        const shipDateText =
          el.shipDateDetailsTranslated || el.shipDateFormatted;
        return (
          <div
            key={el.id}
            className={`order-line-details__content__innerTableNotShipped${
              isSingleElement || isLastElement
                ? '__separateLine'
                : '__separateLineMultiple'
            }`}
          >
            {shipDateText ? (
              <span className="order-line-details__content__innerTableNotShipped__separateLineText">
                {shipDateText}
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
        );
      })}
    </div>
  );
}
export default DeliveryEstimateColumn;
