import React from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUserInfo";
import ResellerInfo from "./ResellerInfo";

function ConfigGrid({ data, gridProps }) {
  const { reseller, endUser, items, programName, dueDate, endUserType } = data;
  const { quotePreview } = gridProps;
  return (
    <div className="cmp-renewals-qp__config-grid">
      <p className="cmp-renewals-qp__config-grid--title">
        {quotePreview.quotePreviewlabel}
      </p>
      <div className="info-container">
        <ResellerInfo
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
        />
        <div className="info-divider"></div>
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={endUser}
        />
        <div className="info-divider"></div>
        <AgreementInfo
          programName={programName}
          dueDate={dueDate}
          agreementInfo={quotePreview.agreementInfo}
          contract={items[0].contract}
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
