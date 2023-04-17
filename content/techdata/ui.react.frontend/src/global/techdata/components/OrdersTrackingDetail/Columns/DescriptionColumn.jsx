import React from 'react';

function DescriptionColumn({ line, config }) {
  return (
    <div className="cmp-order-tracking-grid-details__description-column">
      <div className="cmp-order-tracking-grid-details__description-link">{`${line?.displayName}`}</div>
      <div className="cmp-order-tracking-grid-details__description-text">
        <div>{`${config?.labels?.lineMfgPartNo} ${line?.manufacturerPart}`}</div>
        <div>{`${config?.labels?.lineTdsPartNo} ${line?.tdNumber}`}</div>
      </div>
    </div>
  );
}

export default DescriptionColumn;
