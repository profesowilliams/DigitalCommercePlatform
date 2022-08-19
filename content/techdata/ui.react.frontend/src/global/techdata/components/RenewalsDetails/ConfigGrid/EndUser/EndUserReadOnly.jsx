import React from "react";
import Info from "../../../common/quotes/DisplayItemInfo";

export default function EndUserInfoReadOnly ({ endUserData, endUserType, productLines }) {
  console.log('enduser read only data', endUserData);
  const address = endUserData.address;
  const contact = endUserData.contact;

  return (
    <div className="cmp-renewals-qp__enduser-info--address-group">
      <p>
        <Info>{endUserData.nameUpper}</Info>
        <Info>{address.line1}</Info>
        <Info>{address.line2}</Info>
        <Info>{(address.city ?? '') + (`, ${address.state}` || '') + (` ${address.postalCode}` || '')}</Info>      
        <Info>{address.countryCode}</Info>
      </p>
      
      <p>
        <Info label={productLines.emailLabel} noColon>{contact.email}</Info>
        <Info label={productLines.phoneLabel} noColon>{contact.phone}</Info>
      </p>
      
      <p>          
        <Info label={productLines.endCustomerType} noColon>{endUserType}</Info>
        <Info label={productLines.vendorAccountNo} noColon>{endUserData.vendorAccountNumber}</Info>
        <Info label={productLines.endCustpreviousPurchaseOrderNo} noColon>{endUserData.previousEndUserPO ?? 'N/A'}</Info>
      </p>
    </div>
  );
};
