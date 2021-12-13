import React, { useEffect, useState } from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function ResellerInfo({props}) {
  const ResellerInfo = () => {
    return (
      <div className="cmp-renewals-qp__reseller-info--address-group">
        <p>
          <Info>RECARTA IT LIMITED</Info>
        </p>
        <p>
          <Info label="Account No">1234567</Info>
          <Info label="Previous purchase order No">1234567</Info>
        </p>
      </div>
    );
  };

  
  return (
    <div className="cmp-renewals-qp__reseller-info">
        <p className="cmp-renewals-qp__reseller-info--sub-title">
        Reseller
        </p>
        <ResellerInfo />
    </div>
  );
}

export default ResellerInfo;
