import React from 'react';
import Tooltip from '@mui/material/Tooltip';

function ResellerColumn({ data }) {
  return data ? (
    <div className="status-column-container">
      <Tooltip title={data} placement="top" arrow disableInteractive={true}>
        <span className="status-column-container__text">{data}</span>
      </Tooltip>
    </div>
  ) : (
    <span>-</span>
  );
}

export default ResellerColumn;