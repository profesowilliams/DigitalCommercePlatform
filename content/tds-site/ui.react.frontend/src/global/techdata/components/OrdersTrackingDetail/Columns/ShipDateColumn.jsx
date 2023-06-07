import React from 'react';
//TODO: Add .map() over deliveryNotes
function ShipDateColumn({ line }) {
  return (
    <div>
      {line?.deliveryNotes[0]?.actualShipDateFormatted ||
        line?.estimatedShipDateFormatted ||
        ''}
    </div>
  );
}

export default ShipDateColumn;
