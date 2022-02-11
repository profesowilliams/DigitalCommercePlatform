import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function EndUserInfo({ endUser, endUserType, productLines }) {
  const EndUserInfo = ({ endUser }) => {
    const address = endUser.address;
    const contact = (Array.isArray(endUser.contact) ? endUser.contact[0] : endUser.contact);

    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>{endUser.nameUpper && <Info><b>{endUser.nameUpper}</b></Info>}</p> <br />
        <p>
          {endUser.name && <Info>{endUser.name}</Info>}
          {address?.line1 && <Info>{address?.line1}</Info>}      
          <Info>
            {(address?.line2 && `${address?.line2},`) +
              (address?.state && `${address?.state} `) }
          </Info>
          <Info>{address?.postalCode}</Info>
          {address?.city && <Info>{address?.city}</Info>}
        </p> <br />
        <p>
          {contact?.email && <Info label={productLines.emailLabel} noColon boldLabel>{contact?.email}</Info>}
          {contact?.phone && <Info label={productLines.phoneLabel} noColon boldLabel>{contact?.phone}</Info>}
        </p> <br />
        <p>          
          {endUserType && <Info label={productLines.endCustomerType} noColon boldLabel>{endUserType}</Info>}
          <Info label={productLines.vendorAccountNo} noColon boldLabel>3456789</Info>
          <Info label={productLines.endCustpreviousPurchaseOrderNo} noColon boldLabel>7894561235</Info>
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
