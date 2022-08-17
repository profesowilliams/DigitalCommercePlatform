import React, { useState } from "react";
import Info from "../../../common/quotes/DisplayItemInfo"
import Edit from "../../Edit"
import MissingInfo from "../../MissingInfo";
import { If } from "../../../../helpers/If";
import CancelAndSave from "../../CancelAndSave";
import EndUserEdit from "./EndUserEdit";
import { isObject } from "../../../../../../utils";
import Saving from "../../Saving";
import getModifiedEndUserData from "./utils";

function EndUserInfo({ endUser, endUserType, productLines }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const { canEdit, isValid } = endUser;

  const endUserResponseAsObj = isObject(endUser.name);
  const endUserData = getModifiedEndUserData(endUserResponseAsObj, endUser);

  const handleIconEditClick = () => {
    setEditMode(true);
  };

  const handleIconCancelClick = () => {
    setEditMode(false);
  };

  const handleIconSaveClick = () => {
    setSaving(true);
    // timeout will be replaced with API promise return.
    setTimeout(() => {
      setSaving(false)
      setEditMode(false)
    }, 2000);
  };

  const showEditButton = canEdit && !saving,
        showError = !isValid && !saving;

  const EditFlow = () => {
    return (
      <If
        condition={!editMode}
        Then={<Edit btnClass="icon-button__endUser" handler={handleIconEditClick} />}
        Else={
          <CancelAndSave
            customClass="cancel-save__absolute"
            cancelHandler={handleIconCancelClick}
            saveHandler={handleIconSaveClick}
          />
        }
      />
    )
  };

  const EndUserInfo = ({ endUserData }) => {
    const address = endUserData.address;
    const contact = (Array.isArray(endUserData.contact) ? endUserData.contact[0] : endUserData.contact);

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

  return (
    <div
      className={`cmp-renewals-qp__enduser-info ${
        showError && `error-feedback`
      }`}
    >
      <span className="cmp-renewals-qp__enduser-info--title">
        {productLines.endCustomerLabel}
      </span>
      {showError && <MissingInfo>End user missing information</MissingInfo>}
      {showEditButton && <EditFlow />}
      {saving && <Saving customClass="saving__absolute" />}
      {editMode ? (
        <EndUserEdit endUser={endUser} endUserData={endUserData} />
      ) : (
        <EndUserInfo endUserData={endUserData} />
      )}
    </div>
  );
}

export default EndUserInfo;
