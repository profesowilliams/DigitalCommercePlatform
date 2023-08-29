import React from 'react'

function QuantityColumn({line}) {
  //TODO: Add .map() over deliveryNotes
  return (
    <div>
      {line?.deliveryNotes[0]?.quantityDelivered || `${line?.orderQuantity}`}
    </div>
  );
}

export default QuantityColumn