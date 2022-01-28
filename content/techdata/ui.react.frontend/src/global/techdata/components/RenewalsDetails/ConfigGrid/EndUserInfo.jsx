import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function EndUserInfo({ endUser, endUserType, productLines }) {
  const EndUserInfo = ({ endUser }) => {
    const address = endUser.address;
    const contact = endUser.contact;

    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>{endUser.nameUpper && <Info><b>{endUser.nameUpper}</b></Info>}</p>
        <p>
          {endUser.name && <Info>{endUser.name}</Info>}
          {address?.line1 && <Info>{address?.line1}</Info>}
          <Info>
            {(address?.line2 && `${address?.line2},`) +
              (address?.state && `${address?.state} `) +
              (address?.postalCode && `${address?.postalCode}`)}
          </Info>
          {address?.city && <Info>{address?.city}</Info>}
        </p>
        <p>
          {contact?.email && <Info label={productLines.emailLabel}>{contact?.email}</Info>}
          {contact?.phone && <Info label={productLines.phoneLabel}>{contact?.phone}</Info>}
          {endUserType && <Info label={productLines.endCustomerType}>{endUserType}</Info>}
          <Info label={productLines.vendorAccountNo}>3456789</Info>
          <Info label={productLines.endCustpreviousPurchaseOrderNo}>7894561235</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__enduser-info">
      <p className="cmp-renewals-qp__enduser-info--sub-title">{productLines.endCustomerLabel}</p>
      <EndUserInfo endUser={endUser} />
    </div>
  );
}

export default EndUserInfo;
