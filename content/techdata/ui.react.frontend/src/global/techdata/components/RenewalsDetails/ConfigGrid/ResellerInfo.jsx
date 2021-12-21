import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function ResellerInfo({ reseller }) {
  const ResellerInfo = ({ reseller }) => {
    return (
      <div className="cmp-renewals-qp__reseller-info--address-group">
        <p>{reseller.companyName && <Info><b>{reseller.companyName}</b></Info>}</p>
        <p>
          <Info label="Account No">1234567</Info>
          <Info label="Previous purchase order No">1234567</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__reseller-info">
      <p className="cmp-renewals-qp__reseller-info--sub-title">Reseller</p>
      <ResellerInfo reseller={reseller} />
    </div>
  );
}

export default ResellerInfo;
