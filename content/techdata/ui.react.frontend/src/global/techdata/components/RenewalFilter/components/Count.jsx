import React from "react";

const Count = ({ children, callback }) => {
  return <button onClick={callback} className="count">{children}</button>;
};

export default Count;
