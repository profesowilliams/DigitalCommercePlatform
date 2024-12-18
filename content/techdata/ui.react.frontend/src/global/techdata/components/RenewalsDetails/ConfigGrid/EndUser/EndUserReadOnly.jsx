import React from "react";
import { getDictionaryValue } from "../../../../../../utils/utils";
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
        <Info>{contact.name}</Info>
        <Info>{contact.email}</Info>
        <Info>{contact.phone}</Info>
      </p>
      <p>
        <Info>{address.line1}</Info>
        <Info>{address.line2}</Info>
        <Info>
          {addSeparator([
            address.city,
            address.state?.text ?? address.state,
            address.country?.text,
          ])}
        </Info>
        <Info>{address.postalCode ?? ''}</Info>
      </p>
      <div>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.endUserType',
            'End user type'
          )}
          spaceBetween
        >
          {endUserType}
        </Info>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.vendorAccountNo',
            'Vendor account №'
          )}
          spaceBetween
        >
          {endUserData.vendorAccountNumber}
        </Info>
        <Info
          label={getDictionaryValue(
            'details.renewal.label.prevPONo',
            'Previous purchase order №'
          )}
          spaceBetween
        >
          {endUserData.previousEndUserPO}
        </Info>
      </div>
    </div>
  );
};
