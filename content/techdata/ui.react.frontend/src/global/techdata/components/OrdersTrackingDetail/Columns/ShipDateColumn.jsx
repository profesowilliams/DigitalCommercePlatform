import React from 'react';
//TODO: Add .map() over deliveryNotes
function ShipDateColumn({ line }) {
  return (
    <div>
      {line?.deliveryNotes[0]?.actualShipDate || line?.estimatedShipDate || ''}
    </div>
  );
}

export default ShipDateColumn;
