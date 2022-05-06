import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function ResellerInfo({ reseller, resellerLabels }) {
  const ResellerInfo = ({ reseller }) => {
    return (
      <div className="cmp-renewals-qp__reseller-info--address-group">
        <p>
          <Info noColon>{reseller?.name}</Info>
          <Info label={resellerLabels.accountNoLabel} noColon>{reseller.id}</Info>
          <Info label={resellerLabels.vendorAccountNoResLabel} noColon>{reseller?.vendorAccountNumber}</Info>
          <Info label={"Previous purchase order №:"} noColon>1234566778</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__reseller-info">
      <p className="cmp-renewals-qp__reseller-info--title">{resellerLabels.resellerLabel}</p>
      <ResellerInfo reseller={reseller} />
    </div>
  );
}

export default ResellerInfo;
