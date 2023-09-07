import React from 'react';
const QuantityColumn = ({ line }) => {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-column">
      {line?.lineDetails?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;
          return (
            <div
              key={el.id}
              className={`order-line-details__content__innerTableNotShipped${
                isSingleElement || isLastElement
                  ? '__separateLine'
                  : '__separateLineMultiple'
              }`}
            >
              <span className="order-line-details__content__innerTableNotShipped__separateLineText">
                {el.quantity} / {el.orderQuantity}
              </span>
            </div>
          );
      })}
    </div>
  );
};
export default QuantityColumn;
