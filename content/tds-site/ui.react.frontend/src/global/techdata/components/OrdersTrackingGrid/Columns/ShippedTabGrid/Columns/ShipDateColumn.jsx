import React from 'react';
function ShipDateColumn({ line }) {
  return <div>{line?.actualShipDateFormatted || line?.actualShipDateNotAvailableTranslated || '-'}</div>;
}
export default ShipDateColumn;
