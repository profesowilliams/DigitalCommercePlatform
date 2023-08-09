import React from 'react';
const QuantityColumn = ({ line }) => <div>{line?.quantity || '-'}</div>;
export default QuantityColumn;
