import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function ResellerInfo({ reseller, resellerLabels }) {
  const ResellerInfo = ({ reseller }) => {
    return (
      <div className="cmp-renewals-qp__reseller-info--address-group">
        <p>{reseller.name && <Info><b>{reseller.name}</b></Info>}</p>
        <p>
          {reseller.id && <Info label={resellerLabels.accountNoLabel}>{reseller.id}</Info>}
          <Info label={resellerLabels.previousPurchaseOrderNoLabel}>1234567</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__reseller-info">
      <p className="cmp-renewals-qp__reseller-info--sub-title">{resellerLabels.resellerLabel}</p>
      <ResellerInfo reseller={reseller} />
    </div>
  );
}

export default ResellerInfo;
