import React, { useEffect, useState } from 'react';

function QuantityColumn({ line, sortedLineDetails, rowsToGrayOutTDNameRef }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const [temporaryValue, setTemporaryValue] = useState(null);

  useEffect(() => {
    if (rowsToGrayOutTDNameRef.current.includes(line?.tdNumber)) {
      setTemporaryValue('0');
    }
  }, [rowsToGrayOutTDNameRef]);

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
            <span className="cmp-order-tracking-grid-details__splitLine__separateLineText  cmp-order-tracking-grid-details__splitLine--offsetRight">
              {temporaryValue || el.quantity || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default QuantityColumn;