import React from 'react';

const ToolTip = ({toolTipData}) => {
  return (
    toolTipData.value && (
      <div
        style={{
          top: `${toolTipData.y}px`,
          left: `${toolTipData.x}px`,
        }}
        className={"tool-tip"}
      >
        {toolTipData.value}
      </div>
    )
  );
};
export default ToolTip;
