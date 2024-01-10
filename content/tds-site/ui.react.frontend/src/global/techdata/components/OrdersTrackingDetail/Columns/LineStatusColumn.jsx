import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { WarningTriangle } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function LineStatusColumn({ line, config, sortedLineDetails }) {
  const isEOL = line.isEOL;
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;

  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  const handleSeeOptionsClick = () => {
    setCustomState({
      key: 'productReplacementFlyout',
      value: { data: { line }, show: true },
    });
  };
  const EOLStatus = (
    <>
      <span className="line-status">
        <WarningTriangle />
        {getDictionaryValueOrKey(config?.itemsLabels?.endOfLife)}
      </span>
      <p className="line-status-link">
        {getDictionaryValueOrKey(config?.itemsLabels?.seeOptions)}
      </p>
    </>
  );

  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;
        return (
          <div
            key={line.tdNumber}
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
              {isEOL ? EOLStatus : el.statusText || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default LineStatusColumn;
