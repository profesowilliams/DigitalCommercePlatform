import React from 'react';

function ShipToColumn({ data }) {
    return (
        data && data.name
            ? <span>{data.name}</span>
            : <span>-</span>
    );
}

export default ShipToColumn;