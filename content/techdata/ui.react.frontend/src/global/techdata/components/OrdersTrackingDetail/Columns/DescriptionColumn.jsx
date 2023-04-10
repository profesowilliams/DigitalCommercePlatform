import React from 'react';

function DescriptionColumn({ line, config }) {
  return (
    //TODO: items.displayName, items.manufacturerPart, items.tdNumber
    <div className="cmp-order-tracking-grid__description-column">
      <div className="cmp-order-tracking-grid__description-link">{`${line?.displayName}`}</div>
      <div className="cmp-order-tracking-grid__description-text">
        <div>{`${config.lineMfgPartNo} ${line?.manufacturerPart}`}</div>
        <div>{`${config.lineTdsPartNo} ${line?.tdNumber}`}</div>
      </div>
    </div>
  );
}

export default DescriptionColumn;
