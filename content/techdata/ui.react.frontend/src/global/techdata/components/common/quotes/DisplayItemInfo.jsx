import React from "react";
import { removeCommaIfContentNull } from "../../../helpers/formatting";
import { If } from "../../../helpers/If";

function DisplayItemInfo({
  children = null,
  label = null,
  condition = null,
  noColon = false,
  boldLabel = false,
}) {
  const SpanInfo = (
    <If condition={children}>
      <span>{!label && removeCommaIfContentNull(children)}</span>
    </If>
  );

  const toggleBoldLabel = () => (boldLabel ? <b>{label}</b> : label);

  return (
    <>
      <If condition={label && children} Else={SpanInfo}>
        <span>
          {toggleBoldLabel()}
          {!noColon ? ":" : ""} {children}
        </span>
      </If>
    </>
  );
}

export default DisplayItemInfo;
