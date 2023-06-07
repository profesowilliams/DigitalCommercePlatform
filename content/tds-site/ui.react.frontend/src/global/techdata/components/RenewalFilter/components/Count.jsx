import React from "react";
import useComputeBranding from "../../../hooks/useComputeBranding";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";

const Count = ({ children, callback }) => {
  const { computeClassName } = useComputeBranding(useRenewalGridState);
  return <button onClick={callback} className={computeClassName("count")}>{children}</button>;
};

export default Count;
