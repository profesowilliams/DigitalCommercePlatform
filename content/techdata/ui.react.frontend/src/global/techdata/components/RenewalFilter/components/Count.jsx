import React from "react";
import useIsTDSynnexClass from "./useIsTDSynnexClass";

const Count = ({ children, callback }) => {
  const { computeClassName } = useIsTDSynnexClass();
  return <button onClick={callback} className={computeClassName("count")}>{children}</button>;
};

export default Count;
