import React, { useState, useEffect } from "react";
import ResellerEdit from "./ResellerEdit";
import ResellerReadOnly from "./ResellerReadOnly";
import MissingInfo from "../../MissingInfo";
import Saving from "../../Saving";
import EditFlow from "../Common/EditFlow";
import useResellerHandlers from "./useResellerHandlers";
import { isObject } from "../../../../../../utils";
import getModifiedResellerData from "./utils";
import { useRenewalsDetailsStore } from "../../store/RenewalsDetailsStore";
import { extractDetailResellerData } from "../../../RenewalsGrid/Orders/orderingRequests"
import { getDictionaryValue } from "../../../../../../utils/utils";

function ResellerInfo({ 
  reseller,
  resellerLabels,
  updateDetails,
  shipTo,
  addressesEndpoint,
}) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resellerDetails, setResellerDetails] = useState(reseller);
  const [shipToDetails, setShipToDetails] = useState(shipTo);

  const effects = useRenewalsDetailsStore(state => state.effects);
  const isEditingDetails = useRenewalsDetailsStore( state => state.isEditingDetails);
  const branding = useRenewalsDetailsStore(state => state.branding || '');

  // Changes reseller check to vendorAccountNumber
  const resellerResponseAsObj = isObject(reseller.vendorAccountNumber);
  const resellerData = getModifiedResellerData(resellerResponseAsObj, reseller);

  const paymentTerms = reseller.paymentTerms || '';
  
  const { canEdit, isValid } = reseller;
  const showEditButton = canEdit && !saving;
  const showError = !isValid && !saving;
  
  // Hook to create form handlers as object to be passed, also exposes email validation flag.
  const [editHandlers, isEmailValid] = useResellerHandlers(resellerDetails, setResellerDetails);

  const setLockedEdit = (flag) => {
    setEditMode(flag);
    effects.setCustomState({ key: 'isEditingDetails', value: flag });

    if (!flag) {
      setResellerDetails(resellerDetails);
    }
  };

  const handleShipToOnChange = (newShipTo) => {
    setShipToDetails(newShipTo);
  }

  const saveHandler = () => {
    setSaving(true);
    updateDetails(null, resellerDetails, shipToDetails)
      .then((result) => {
        if(result) {
          setLockedEdit(false);
          effects.clearReseller();
        }
      })
      .finally(() => setSaving(false));
  };

  const cancelHandler = () => {
    effects.clearEndUser()
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
    setResellerDetails(({...reseller}));
    setShipToDetails(({...shipTo}));
  };

  useEffect(() => {
    if(isEditingDetails) { 
      effects.setCustomState({ key: 'reseller', value: extractDetailResellerData(resellerDetails) });
    } else {
      effects.clearReseller();
    }
  }, [resellerDetails])
  
  return (
    <div className={`cmp-renewals-qp__reseller-info ${showError && `error-feedback`}`}>
      <span className="cmp-renewals-qp__reseller-info--title">
        {getDictionaryValue("details.renewal.label.reseller", "Reseller")}
      </span>
      {showError && <MissingInfo>{ getDictionaryValue( "details.renewal.label.resellerMissingInfo", "Reseller missing information")}</MissingInfo>}
      {showEditButton && (
        <EditFlow
          disabled={!editMode && isEditingDetails}
          editValue={editMode} 
          setEdit={setLockedEdit} 
          saveHandler={saveHandler} 
          cancelHandler={cancelHandler}
          customClass={'cancel-save__absolute'}
        />
      )}
      {saving && <Saving customClass="saving__absolute" />}
      {editMode ? (
        <ResellerEdit
          branding={branding}
          addressesEndpoint={addressesEndpoint}
          resellerDetails={resellerDetails} 
          resellerLabels={resellerLabels}
          isEmailValid={isEmailValid}
          handlers={editHandlers}
          shipToDetails={shipToDetails}
          shipToOnChange={handleShipToOnChange}
        />
      ) : (
        <ResellerReadOnly 
          resellerData={resellerData}
          resellerLabels={resellerLabels} 
          shipToData={shipTo}
          paymentTermsVal={paymentTerms}
        />
      )}
    </div>
  );
}

export default ResellerInfo;
