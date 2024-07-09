import React from 'react';
function LineColumn({ line }) {
  return (
    <div>
      <span>{line?.line || ''}</span>
    </div>
  );
}
export default LineColumn;
