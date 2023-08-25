import React from 'react';
function ShipDateColumn({ line }) {
  return <div>{line?.actualShipDateFormatted || '-'}</div>;
}
export default ShipDateColumn;
