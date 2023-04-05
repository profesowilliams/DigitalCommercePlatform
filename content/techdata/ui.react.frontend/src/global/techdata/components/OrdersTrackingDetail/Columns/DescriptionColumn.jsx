import React from 'react'

function DescriptionColumn({data}) {
  return (//TODO: items.displayName, items.manufacturerPart, items.tdNumber
    <div className="cmp-order-tracking-grid__description-column">{`${data?.displayName}`}</div>
  );
}

export default DescriptionColumn