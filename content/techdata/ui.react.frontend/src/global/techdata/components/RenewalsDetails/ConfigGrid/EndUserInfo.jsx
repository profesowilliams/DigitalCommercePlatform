import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function EndUserInfo({ endUser, endUserType, productLines }) {
  const EndUserInfo = ({ endUser }) => {
    const address = endUser.address;
    const contact = (Array.isArray(endUser.contact) ? endUser.contact[0] : endUser.contact);

    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>
          {endUser.nameUpper && <Info>{endUser.nameUpper}</Info>}
          {address?.line1 && <Info>{address?.line1}</Info>}      
          {address?.line2 && <Info>{address?.line2}</Info>}   
          <Info>{(address?.city ?? '') + (address?.state ? `, ${address?.state}` : '') + (address?.postalCode ? ` ${address?.postalCode}` : '')}</Info>      
          <Info>{address?.countryCode}</Info>
        </p>
        
        <p>
          {contact?.email && <Info label={productLines.emailLabel} noColon>{contact?.email}</Info>}
          {contact?.phone && <Info label={productLines.phoneLabel} noColon>{contact?.phone}</Info>}
        </p>
        
        <p>          
          {endUserType && <Info label={productLines.endCustomerType} noColon>{endUserType}</Info>}
          <Info label={productLines.vendorAccountNo} noColon>{endUser?.vendorAccountNumber}</Info>
          <Info label={"Previous purchase order №:"} noColon>1234566778</Info>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__enduser-info">
      <span className="cmp-renewals-qp__enduser-info--title">{productLines.endCustomerLabel}</span>
      <EndUserInfo endUser={endUser} />
    </div>
  );
}

export default EndUserInfo;
