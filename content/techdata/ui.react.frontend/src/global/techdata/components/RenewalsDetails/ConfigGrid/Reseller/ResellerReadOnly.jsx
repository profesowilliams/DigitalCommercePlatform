import React from "react";
import Info from "../../../common/quotes/DisplayItemInfo";
export default function ResellerReadOnly({ resellerData = {}, resellerLabels }) {  
  const { 
    id,
    contact,
    address,
    vendorAccountNumber,
  } = resellerData;

  const {
    resellerSAPaccNoLabel,
    resellerVendorAccountNoLabel,
  } = resellerLabels;

  const addSeparator = (items) => {
    return items?.filter(Boolean)?.join(', ');
  };
  
  return (
    <div className="cmp-renewals-qp__reseller-info--address-group">
      <p>
        <Info hasLineBreak={true}>{resellerData.name}</Info>

        <Info>{contact.name}</Info>
        <Info>{contact.email}</Info>
        <Info hasLineBreak={true}>{contact.phone}</Info>
        
        <Info>{address.line1}</Info>
        <Info>{address.line2}</Info>
        <Info>{addSeparator([address.city, address.country])}</Info>          
        <Info hasLineBreak={true}>{address.postalCode}</Info> 

        <Info label={resellerSAPaccNoLabel} noColon>{id}</Info>
        <Info label={resellerVendorAccountNoLabel} noColon>{vendorAccountNumber}</Info>
      </p>
    </div>
  );
}