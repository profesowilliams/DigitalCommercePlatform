import React from 'react';
function QuantityColumn({ line }) {
  return (
    <div>
      <span>{line?.shipQuantity || '-'}</span>
    </div>
  );
}
export default QuantityColumn;
