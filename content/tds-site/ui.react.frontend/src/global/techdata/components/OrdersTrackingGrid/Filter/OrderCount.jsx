import React from "react";

const OrderCount = ({ children, callback }) => {
  return <button onClick={callback} className={"count tag_dark_teal"}>{children}</button>;
};

export default OrderCount;