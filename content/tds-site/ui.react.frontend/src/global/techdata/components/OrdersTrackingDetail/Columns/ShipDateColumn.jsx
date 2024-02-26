import React from 'react';
function ShipDateColumn({ line, sortedLineDetails }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;

  const shipDateText = (el) =>
    `${el.shipDateFormatted || ''} ${el.shipDateDetailsTranslated || ''}`;

  const text = (el) =>
    el.shipDateFormatted || el.shipDateDetailsTranslated
      ? shipDateText(el)
      : el.shipDateNotAvailableTranslated || '-';

  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column cmp-order-tracking-grid-details__splitLine--centerAlign">
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
            <span className="cmp-order-tracking-grid-details__splitLine__separateLineText">
              {text(el)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ShipDateColumn;
