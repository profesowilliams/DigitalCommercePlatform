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
  const { id, contact, address, vendorAccountNumber, customerPO } = resellerData;

  const { shipToLabel, paymentTerms, previousPurchaseOrderNoEndLabel, autorenewPurchaseOrderNoEndLabel } = resellerLabels;

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
      <div>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.resellerAccountNo',
            'Account Nº'
          )}
          spaceBetween
        >
          {id}
        </Info>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.vendorAccountNo',
            'Vendor account Nº'
          )}
          spaceBetween
        >
          {vendorAccountNumber}
        </Info>
        <Info
          label={getDictionaryValueOrKey(
            previousPurchaseOrderNoEndLabel
          )}
          spaceBetween
        >
          {previousResellerPO}
        </Info>
        <Info
          label={getDictionaryValueOrKey(
            autorenewPurchaseOrderNoEndLabel
          )}
          spaceBetween
        >
          {customerPO}
        </Info>
        <Info label={getDictionaryValueOrKey(paymentTerms)}
        spaceBetween
        >
          {paymentTermsVal}
        </Info>
      </div>
      {shipToData?.id?.text && (
        <div>
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
        </div>
      )}
    </div>
  );
}