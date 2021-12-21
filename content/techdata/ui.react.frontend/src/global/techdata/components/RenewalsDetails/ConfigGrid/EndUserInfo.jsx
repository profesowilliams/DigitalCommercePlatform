import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function EndUserInfo({ endUser }) {
  const EndUserInfo = ({ endUser }) => {
    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>{endUser.companyName && <Info><b>{endUser.companyName}</b></Info>}</p>
        <p>
          {endUser.name && <Info>{endUser.name}</Info>}
          {endUser.line1 && <Info>{endUser.line1}</Info>}
          <Info>
            {(endUser.line2 && `${endUser.line2},`) +
              (endUser.state && `${endUser.state} `) +
              (endUser.postalCode && `${endUser.postalCode}`)}
          </Info>
          {endUser.city && <Info>{endUser.city}</Info>}
        </p>
        <p>
          {endUser.email && <Info label="Email">{endUser.email}</Info>}
          {endUser.phoneNumber && <Info label="Phone">1234567</Info>}
          <Info label="End user type">Academic</Info>
          <Info label="Vendor account No">3456789</Info>
          <Info label="Previous purchase order No">7894561235</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__enduser-info">
      <p className="cmp-renewals-qp__enduser-info--sub-title">End User</p>
      <EndUserInfo endUser={endUser} />
    </div>
  );
}

export default EndUserInfo;
