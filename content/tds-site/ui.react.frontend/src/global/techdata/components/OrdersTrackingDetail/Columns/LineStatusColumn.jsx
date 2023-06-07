import React from 'react';

function LineStatusColumn({ line }) {
  return <div>{line?.status ? `${line?.status}` : ''}</div>;
}

export default LineStatusColumn;
