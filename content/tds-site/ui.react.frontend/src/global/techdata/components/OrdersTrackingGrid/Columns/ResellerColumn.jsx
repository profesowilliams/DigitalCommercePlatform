import React from 'react';

function ResellerColumn({ data }) {
    return data ? <span>{data}</span> : <span>-</span>;
}

export default ResellerColumn;