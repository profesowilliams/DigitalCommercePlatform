import React from 'react'

function QuantityColumn({line}) {
  //TODO: Add .map() over deliveryNotes
  return (
    <div>
      {line.deliveryNotes[0].quantityDelivered
        ? line.deliveryNotes[0].quantityDelivered
        : `${line?.quantity}`}
    </div>
  );
}

export default QuantityColumn