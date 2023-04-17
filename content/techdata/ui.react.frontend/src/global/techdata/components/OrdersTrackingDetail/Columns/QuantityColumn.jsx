import React from 'react'

function QuantityColumn({line}) {
  return (
    <div>
      {line?.quantity ? `${line?.quantity}` : ''}
    </div>
  );
}

export default QuantityColumn