import React from 'react'

function UnitCostColumn({ line, sortedLineDetails }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column cmp-order-tracking-grid-details__splitLine--rightAlign">
      {sortedLineDetails(line)?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;
        return (
          <div
            key={line.tdNumber + index}
            className={`cmp-order-tracking-grid-details__splitLine${
              isSingleElement || isLastElement
                ? '__separateLine'
                : '__separateLineMultiple'
            }`}
          >
            <span className="cmp-order-tracking-grid-details__splitLine__separateLineText cmp-order-tracking-grid-details__splitLine--offsetRight">
              {line?.unitPriceFormatted ?? ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default UnitCostColumn