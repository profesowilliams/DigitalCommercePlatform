import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function LineStatusColumn({ line, config, sortedLineDetails }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;

  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;
  const isEOL = line.isEOL;
  const handleSeeOptionsClick = () => {
    setCustomState({
      key: 'productReplacementFlyout',
      value: { data: { line }, show: true },
    });
  };
  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;

        return (
          <div
            key={el.id}
            className={`cmp-order-tracking-grid-details__splitLine${
              isSingleElement || isLastElement
                ? '__separateLine'
                : '__separateLineMultiple'
            }`}
          >
            <span
              className="cmp-order-tracking-grid-details__splitLine__separateLineText"
              onClick={isEOL ? handleSeeOptionsClick : null}
            >
              {isEOL
                ? getDictionaryValueOrKey(config?.itemsLabels?.seeOptions)
                : el.statusText || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default LineStatusColumn;
