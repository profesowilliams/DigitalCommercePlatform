import React from "react";
import Info from "../../../common/quotes/DisplayItemInfo";

export default function EndUserInfoReadOnly ({ endUserData, endUserType, productLines }) {
  const address = endUserData.address;
  const contact = endUserData.contact;

  const addSeparator = (items) => {
    return items?.filter(Boolean)?.join(', ');
  };

  return (
    <div className="cmp-renewals-qp__enduser-info--address-group">
      <p>
        <Info>{endUserData.nameUpper}</Info>
      </p>
      <p>
        <Info>{endUserData.name}</Info>
        <Info>{contact.email}</Info>
        <Info>{contact.phone}</Info>
      </p>
      <p>
        <Info>{address.line1}</Info>
        <Info>{address.line2}</Info>
        <Info>{addSeparator([address.city, address.state])}</Info>      
        <Info>{address.postalCode ?? ''}</Info>
      </p>
      <p>          
        <Info label={productLines.endCustomerType} noColon>{endUserType}</Info>
        <Info label={productLines.vendorAccountNo} noColon>{endUserData.vendorAccountNumber}</Info>
        <Info label={productLines.endCustpreviousPurchaseOrderNo} noColon>{endUserData.previousEndUserPO}</Info>     
      </p>
    </div>
  );
};
