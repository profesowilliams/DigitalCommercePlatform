import React from 'react';
function QuantityColumn({ line }) {
  return (
    <div>
      <span>{line?.quantity || '-'}</span>
    </div>
  );
}
export default QuantityColumn;
