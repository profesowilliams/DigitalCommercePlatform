import React from "react";
import { CautionIcon } from "../../../../fluentIcons/FluentIcons";

export function MissingInfo({children}) {
  return (
    <div className="cmp-renewals-qp__missing-info">
      <CautionIcon />
      <p className="cmp-renewals-qp__missing-info--text">
        {children}
      </p>
    </div>
  );
}
