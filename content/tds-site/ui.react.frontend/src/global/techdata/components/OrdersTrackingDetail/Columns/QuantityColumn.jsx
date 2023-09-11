import React from 'react'

function QuantityColumn({ line }) {
  //TODO: Add .map() over lineDetails
  return (
    <div>
      {line?.lineDetails[0]?.quantity || line?.lineDetails[0]?.orderQuantity}
    </div>
  );
}

export default QuantityColumn