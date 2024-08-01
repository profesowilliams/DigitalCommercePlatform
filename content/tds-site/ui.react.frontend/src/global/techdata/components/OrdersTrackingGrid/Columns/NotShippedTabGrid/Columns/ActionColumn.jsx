import React from 'react';
import { EllipsisIcon } from '../../../../../../../fluentIcons/FluentIcons';

function ActionColumn({ line }) {
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  const disabledIconStyle = {
    ...iconStyle,
    fill: '#727679',
    cursor: 'default'
  };
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
            <EllipsisIcon style={disabledIconStyle} />
          </div>
        );
      })}
    </div>
  );
}

export default ActionColumn;