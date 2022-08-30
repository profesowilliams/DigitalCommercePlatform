import React, { useState, } from "react";
import ResellerEdit from "./ResellerEdit";
import ResellerReadOnly from "./ResellerReadOnly";
import MissingInfo from "../../MissingInfo";
import Saving from "../../Saving";
import EditFlow from "../Common/EditFlow";
import useResellerHandlers from "./useResellerHandlers";
import { isObject } from "../../../../../../utils";
import getModifiedResellerData from "./utils";
import { useRenewalsDetailsStore } from "../../store/RenewalsDetailsStore";

function ResellerInfo({ 
  reseller,
  resellerLabels,
  updateDetails,
}) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resellerDetails, setResellerDetails] = useState(reseller);

  const effects = useRenewalsDetailsStore(state => state.effects);
  const isEditingDetails = useRenewalsDetailsStore( state => state.isEditingDetails);

  // Changes reseller check to vendorAccountNumber
  const resellerResponseAsObj = isObject(reseller.vendorAccountNumber);
  const resellerData = getModifiedResellerData(resellerResponseAsObj, reseller);
  
  const { canEdit, isValid } = reseller;
  const showEditButton = canEdit && !saving;
  const showError = !isValid && !saving;
  
  // Hook to create form handlers as object to be passed, also exposes email validation flag.
  const [editHandlers, isEmailValid] = useResellerHandlers(resellerDetails, setResellerDetails);

  const setLockedEdit = (flag) => {
    setEditMode(flag);
    effects.setCustomState({ key: 'isEditingDetails', value: flag });
  };

  const saveHandler = async () => {
    setSaving(true);
    await updateDetails(null, resellerDetails);
    setSaving(false);
    setLockedEdit(false);
  };

  return (
    <div className={`cmp-renewals-qp__reseller-info ${showError && `error-feedback`}`}>
      <span className="cmp-renewals-qp__reseller-info--title">
        {resellerLabels.resellerLabel}
      </span>
      {showError && <MissingInfo>Reseller missing information!</MissingInfo>}
      {showEditButton && (
        <EditFlow
          disabled={!editMode && isEditingDetails}
          editValue={editMode} 
          setEdit={setLockedEdit} 
          saveHandler={saveHandler} 
          customClass={'cancel-save__absolute'}
        />
      )}
      {saving && <Saving customClass="saving__absolute" />}
      {editMode ? (
        <ResellerEdit
          resellerDetails={resellerDetails} 
          isEmailValid={isEmailValid}
          handlers={editHandlers}
        />
      ) : (
        <ResellerReadOnly 
          resellerData={resellerData}
          resellerLabels={resellerLabels} 
        />
      )}
    </div>
  );
}

export default ResellerInfo;