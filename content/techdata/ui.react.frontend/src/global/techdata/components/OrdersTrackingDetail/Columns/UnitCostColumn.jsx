import React from 'react'

function UnitCostColumn({data}) {
  return (
    <div className="cmp-order-tracking-grid__cost-column">{`${data?.unitPriceFormatted}`}</div>
  );
}

export default UnitCostColumn