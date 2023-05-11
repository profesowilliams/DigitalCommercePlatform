import React from 'react'
//TODO: Add estimatedShipDate as a part of first rule of ternary line.deliveryNotes[0].actualShipDate && line.estimatedShipDate ? ...
//TODO: Add .map() over deliveryNotes
function ShipDateColumn({line}) {
  return (
    <div>
      {line.deliveryNotes[0].actualShipDate
        ? line.deliveryNotes[0].actualShipDate
          ? line.deliveryNotes[0].actualShipDate
          : line.estimatedShipDate
        : ''}
    </div>
  );
}

export default ShipDateColumn