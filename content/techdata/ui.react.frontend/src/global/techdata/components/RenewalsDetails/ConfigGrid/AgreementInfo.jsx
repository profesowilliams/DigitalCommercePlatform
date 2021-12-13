import React, { useEffect, useState } from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function AgreementInfo({props}) {
  const AgreementInfo = () => {
    return (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          <Info label="Program">Support Subscription</Info>
          <Info label="Duration">1 Year</Info>
          <Info label="Support level">Basic</Info>
          <Info label="Vendor quote ID">1234567GJDFH</Info>
          <Info label="Agreement No">7894561235</Info>
          <Info label="Reference No">1234567</Info>
          <Info label="Quote due date">20/06/2021</Info>
          <Info label="Quote expiry date">20/06/2021</Info>
          <Info label="Agreement start date">20/09/2021</Info>
          <Info label="Agreement end date">20/09/2021</Info>
          <Info label="Usage start date">20/07/2021</Info>
          <Info label="Usage end date">20/07/2021</Info>
        </p>
      </div>
    );
  };

  
  return (
    <div className="cmp-renewals-qp__agreement-info">
        <p className="cmp-renewals-qp__agreement-info--sub-title">
        Agreement Information
        </p>
        <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
