import React from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUserInfo";
import ResellerInfo from "./ResellerInfo";

function ConfigGrid({ data, gridProps }) {
  const { reseller, endUser, items, programName, dueDate, endUserType, source, expiry, customerPO } = data;
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
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={endUser}
        />
        <AgreementInfo
          source={source}
          programName={programName}
          dueDate={dueDate}
          agreementInfo={quotePreview.agreementInfo}
          contract={items[0].contract}
          expiry={expiry}
          customerPO={customerPO}
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
