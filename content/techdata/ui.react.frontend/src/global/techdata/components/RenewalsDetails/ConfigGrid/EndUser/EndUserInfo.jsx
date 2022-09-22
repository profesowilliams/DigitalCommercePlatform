import React, { useState, useEffect } from 'react';
import Edit from '../../Edit';
import MissingInfo from '../../MissingInfo';
import { If } from '../../../../helpers/If';
import CancelAndSave from '../../CancelAndSave';
import EndUserEdit from './EndUserEdit';
import EndUserInfoReadOnly from './EndUserReadOnly';
import { isObject } from '../../../../../../utils';
import Saving from '../../Saving';
import getModifiedEndUserData from './utils';
import isEmail from 'validator/es/lib/isEmail';
import produce from 'immer';
import { Snackbar } from '@mui/material';
import {
  CheckmarkCircle,
  CautionIcon,
  CloseIcon,
} from '../../../../../../fluentIcons/FluentIcons';
import { teal } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import EditFlow from "../Common/EditFlow";
import { useRenewalsDetailsStore } from "../../store/RenewalsDetailsStore";
import { extractDetailRenewalData } from "../../../RenewalsGrid/Orders/orderingRequests"

function EndUserInfo({
  endUser,
  endUserType,
  productLines,
  updateDetails,
}) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isToastSuccess, setIsToastSucess] = useState(true);
  const { canEdit, isValid } = endUser;

  const effects = useRenewalsDetailsStore(state => state.effects);
  const isEditingDetails = useRenewalsDetailsStore( state => state.isEditingDetails);

  const endUserResponseAsObj = isObject(endUser.name);
  const endUserData = getModifiedEndUserData(endUserResponseAsObj, endUser);
  const [endUserDetails, setEndUserDetails] = useState(endUser);

  let { contact } = endUserDetails;
  const [isEmailValid, setIsEmailValid] = useState(
    contact[0]?.email?.isValid || true
  );

  const handleEmailChange = (e) => {
    let email = e.target.value;
    setEndUserDetails(
      produce((draft) => {
        draft.contact[0].email.text = email;
      })
    );
    if (isEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const handleAddressChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.address.line1.text = e.target.value;
      })
    );
  };

  const handleCityChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.address.city.text = e.target.value;
      })
    );
  };

  const handleCountryChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.address.country.text = e.target.value;
      })
    );
  };

  const handlePostalCodeChange = (valid, e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.address.postalCode.text = valid || e.target.value;
      })
    );
  };

  const handleNameChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.name.text = e.target.value;
      })
    );
  };

  const handlePhoneChange = (valid, e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.contact[0].phone.text = valid || e.target.value;
      })
    );
  };

  const handleContactNameChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.contact[0].name.text = e.target.value;
      })
    );
  };

  const setLockedEdit = (flag) => {
    setEditMode(flag);
    effects.setCustomState({ key: 'isEditingDetails', value: flag });

    if (!flag) {
      setEndUserDetails(endUserDetails);
      setIsEmailValid(true);
    }
  };

  const saveHandler = () => {
    setSaving(true);
    updateDetails(endUserDetails)
      .then((result) => {
        if(result) {
          setLockedEdit(false);
          setToggleEdit(true);
          effects.clearEndUser();
        }
      })
      .finally(() => setSaving(false));
  };

  const cancelHandler = () => {
    effects.clearEndUser()
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
  };

  useEffect(() => {
    if(isEditingDetails) {
      effects.setCustomState({ key: 'endUser', value: extractDetailRenewalData(endUserDetails) });
    }  
  }, [endUserDetails]);

  const showEditButton = canEdit && !saving,
    showError = !isValid && !saving;

  const handleToastClose = () => {
    setIsToastOpen(false);
  };

  const ToastSuccess = () => {
    return (
      <span>
        <CheckmarkCircle
          fill={teal[800]}
          style={{ verticalAlign: 'bottom', marginRight: '16px' }}
        />
        Changes have been succesfully saved.
      </span>
    );
  };

  const ToastError = () => {
    return (
      <div>
        <CautionIcon
          fill="#E02020"
          style={{ verticalAlign: 'bottom', marginRight: '16px' }}
        />
        Could not save changes. <br />
        <br />
        Please try again. If error persist please contact us at{' '}
        <a href="mailto:test@test.com">test@test.com</a>.
      </div>
    );
  };

  const closeIconStyle = {
    '&.MuiIconButton-root': {
      position: 'absolute',
      top: '14px',
      right: '14px',
    },
  };

  const action = (
    <IconButton
      sx={closeIconStyle}
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleToastClose}
    >
      <CloseIcon />
    </IconButton>
  );

  const toastError = '#CD163F';
  const toastSuccess = '#003031';

  const toastStyle = {
    '& .MuiSnackbarContent-root': {
      minHeight: '62px',
      minWidth: '437px',
      boxShadow: '0px 0px 15px rgb(0 0 0 / 5%)',
      borderRadius: '4px',
      background: '#ffffff',
      color: '#003031',
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '16px',
      borderLeft: `4px solid ${isToastSuccess ? toastSuccess : toastError}`,
      padding: '14px 18px',
    },
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
      <Snackbar
        sx={toastStyle}
        open={isToastOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={isToastSuccess ? 6000 : null}
        onClose={handleToastClose}
        message={isToastSuccess ? <ToastSuccess /> : <ToastError />}
        action={isToastSuccess ? null : action}
      />
      {editMode ? (
        <EndUserEdit
          endUserDetails={endUserDetails}
          isEmailValid={isEmailValid}
          handleAddressChange={handleAddressChange}
          handleCityChange={handleCityChange}
          handleCountryChange={handleCountryChange}
          handleContactNameChange={handleContactNameChange}
          handleEmailChange={handleEmailChange}
          handlePhoneChange={handlePhoneChange}
          handleNameChange={handleNameChange}
          handlePostalCodeChange={handlePostalCodeChange}
        />
      ) : (
        <EndUserInfoReadOnly
          endUserData={endUserData}
          endUserType={endUserType}
          productLines={productLines}
        />
      )}
    </div>
  );
}

export default EndUserInfo;
