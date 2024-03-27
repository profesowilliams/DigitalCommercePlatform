import React from 'react';

function Hover({ onHover, children }) {
  return (
    <div className="hover">
      <div className="hover__no-hover">{children}</div>
      <div className="hover__hover">{onHover}</div>
    </div>
  );
}
export default Hover;
