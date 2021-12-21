import React from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUserInfo";
import ResellerInfo from "./ResellerInfo";

function ConfigGrid({ data, gridProps }) {
  const { reseller, endUser } = data;
  return (
    <div className="cmp-renewals-qp__config-grid">
      <p className="cmp-renewals-qp__config-grid--title">Quote preview</p>
      <div className="info-container">
        <ResellerInfo reseller={reseller} />
        <div className="info-divider"></div>
        <EndUserInfo endUser={endUser} />
        <div className="info-divider"></div>
        <AgreementInfo />
      </div>
    </div>
  );
}

export default ConfigGrid;
