import React, { useEffect, useState } from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function EndUserInfo({props}) {
  const EndUserInfo = () => {
    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>
          <Info>AVENIR GLOBAL CHERRY- ADVERTISING LTD</Info>
        </p>
        <p>
          <Info>Uche Ogbonna</Info>
          <Info>168-170 Bermondsey Street</Info>
          <Info>London, ENG 54673</Info>
          <Info>United Kingdom</Info>
        </p>
        <p>  
          <Info label="Email">UcheOgbonna@emailexample.com</Info>
          <Info label="Phone">1234567</Info>
          <Info label="End user type">Academic</Info>
          <Info label="Vendor account No">3456789</Info>
          <Info label="Previous purchase order No">7894561235</Info>
        </p>
      </div>
    );
  };

  
  return (
    <div className="cmp-renewals-qp__enduser-info">
        <p className="cmp-renewals-qp__enduser-info--sub-title">
        End User
        </p>
        <EndUserInfo />
    </div>
  );
}

export default EndUserInfo;
