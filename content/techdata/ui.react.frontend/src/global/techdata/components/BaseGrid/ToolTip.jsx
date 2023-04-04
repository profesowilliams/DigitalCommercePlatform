import React from 'react';

const ToolTip = ({toolTipData}) => {
  return (
    toolTipData.show ? (
      <div
        style={{
          top: `${toolTipData.y}px`,
          left: `${toolTipData.x}px`,
        }}
        className={"tool-tip"}
      >
        {toolTipData.value}
      </div>
    ) : <div></div>
  );
};
export default ToolTip;
