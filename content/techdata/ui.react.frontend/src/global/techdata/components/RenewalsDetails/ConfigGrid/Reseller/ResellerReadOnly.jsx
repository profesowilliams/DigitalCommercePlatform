import React from "react";
import Info from "../../../common/quotes/DisplayItemInfo";

export default function ResellerReadOnly({ resellerData = {}, resellerLabels }) {
  const { 
    contact,
    vendorAccountNumber,
  } = resellerData;

  const {
    vendorAccountNoResLabel,
  } = resellerLabels;

  return (
    <div className="cmp-renewals-qp__reseller-info--address-group">
      <p>
        <Info>{contact.name}</Info>
        <Info>{contact.email}</Info>
        <Info>{contact.phone}</Info>
      </p>

      <p>
        <Info label={vendorAccountNoResLabel} noColon>{vendorAccountNumber}</Info>
      </p>
    </div>
  );
};
