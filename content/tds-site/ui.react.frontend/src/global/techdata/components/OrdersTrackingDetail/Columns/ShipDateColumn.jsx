import React, { useEffect, useState } from 'react';

function ShipDateColumn({ line, sortedLineDetails, rowsToGrayOutTDNameRef }) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const [temporaryValue, setTemporaryValue] = useState(null);

  const shipDateText = (el) => (
    <>
      {el.shipDateFormatted && <span>{el.shipDateFormatted}</span>}
      {el.shipDateFormatted && <br />}
      {el.shipDateDetailsTranslated && <span>{el.shipDateDetailsTranslated}</span>}
    </>
  );

  const text = (el) =>
    el.shipDateFormatted || el.shipDateDetailsTranslated
      ? shipDateText(el)
      : el.shipDateNotAvailableTranslated || '-';

  useEffect(() => {
    if (rowsToGrayOutTDNameRef.current.includes(line?.tdNumber)) {
      setTemporaryValue('-');
    }
  }, [rowsToGrayOutTDNameRef]);

  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column cmp-order-tracking-grid-details__splitLine--centerAlign">
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
            <span className="cmp-order-tracking-grid-details__splitLine__separateLineText">
              {temporaryValue || text(el)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ShipDateColumn;
