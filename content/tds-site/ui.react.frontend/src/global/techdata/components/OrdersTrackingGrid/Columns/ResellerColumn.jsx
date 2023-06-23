import React from 'react';

function ResellerColumn({ data }) {
    return (
        data && data.name
            ? <span>{data.name}</span>
            : <span>-</span>
    );
}

export default ResellerColumn;