import React from "react";
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import { getDictionaryValue } from "../../../../../../utils/utils";
import Info from "../../../common/quotes/DisplayItemInfo";
export default function ResellerReadOnly({
  resellerData = {},
  resellerLabels,
  shipToData = {},
  paymentTermsVal,
  previousResellerPO,
}) {
  const { id, contact, address, vendorAccountNumber } = resellerData;

  const { shipToLabel, paymentTerms } = resellerLabels;

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
        <Info
          label={getDictionaryValue(
            'details.renewal.label.resellerAccountNo',
            'Account Nº'
          )}
        >
          {id}
        </Info>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.vendorAccountNo',
            'Vendor account Nº'
          )}
        >
          {vendorAccountNumber}
        </Info>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.previousPurchaseOrderNoEndLabel',
            'Previous purchase order No'
          )}
        >
          {previousResellerPO}
        </Info>
        <Info label={getDictionaryValueOrKey(paymentTerms)}>
          {paymentTermsVal}
        </Info>
      </p>
      {shipToData?.id?.text && (
        <p>
          <span className="cmp-renewals-qp__reseller-info--sub-title">
            {getDictionaryValueOrKey(shipToLabel)}
          </span>
          <Info>{shipToData?.name}</Info>
          <Info>{shipToData?.address?.line1}</Info>
          <Info>
            {addSeparator([
              shipToData?.address?.postalCode,
              shipToData?.address?.city,
              shipToData?.address?.stateName,
            ])}
          </Info>
        </p>
      )}
    </div>
  );
}