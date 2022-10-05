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
        <Info>{resellerData.name}</Info>
      </p>
      <p>
        <Info>{contact.name}</Info>
        <Info>{contact.email}</Info>
        <Info>{contact.phone}</Info>
      </p>        
      <p>
        <Info>{address.line1}</Info>
        <Info>{address.line2}</Info>
        <Info>{addSeparator([address.city, address.country])}</Info>          
        <Info>{address.postalCode}</Info> 
      </p>
      <p>
        <Info label={resellerSAPaccNoLabel} noColon>{id}</Info>
        <Info label={resellerVendorAccountNoLabel} noColon>{vendorAccountNumber}</Info>
      </p>
    </div>
  );
}
