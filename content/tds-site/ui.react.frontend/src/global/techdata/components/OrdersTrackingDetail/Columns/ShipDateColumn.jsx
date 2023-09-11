import React from 'react';
//TODO: Add .map() over lineDetails
function ShipDateColumn({ line }) {
  return (
    <div>
      {line?.lineDetails ? `${line?.lineDetails[0]?.ShipDateFormatted}` : ''}
    </div>
  );
}

export default ShipDateColumn;
