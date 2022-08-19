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

function EndUserInfo({ endUser, endUserType, productLines, updateDetails }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const { canEdit, isValid } = endUser;

  const endUserResponseAsObj = isObject(endUser.name);
  const endUserData = getModifiedEndUserData(endUserResponseAsObj, endUser);
  const [endUserDetails, setEndUserDetails] = useState(endUser);

  let { contact } = endUserDetails;
  const [isEmailValid, setIsEmailValid] = useState(
    contact[0]['email']['isValid'] || true
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
        draft.address.country = e.target.value;
      })
    );
  };

  const handlePostalCodeChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.address.postalCode.text = e.target.value;
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

  const handlePhoneChange = (e) => {
    setEndUserDetails(
      produce((draft) => {
        draft.contact[0].phone.text = e.target.value;
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

  const handleIconEditClick = () => {
    setEditMode(true);
  };

  const handleIconCancelClick = () => {
    setEditMode(false);
  };

  const handleIconSaveClick = () => {
    setSaving(true);
    updateDetails(endUserDetails)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSaving(false);
        setEditMode(false);
      });
  };

  useEffect(() => {
    // TODO: Remove console log after stable implementation.
    console.log('new data', endUserDetails);
  }, [endUserDetails]);

  const showEditButton = canEdit && !saving,
    showError = !isValid && !saving;

  const EditFlow = () => {
    return (
      <If
        condition={!editMode}
        Then={
          <Edit btnClass="icon-button__endUser" handler={handleIconEditClick} />
        }
        Else={
          <CancelAndSave
            customClass="cancel-save__absolute"
            cancelHandler={handleIconCancelClick}
            saveHandler={handleIconSaveClick}
          />
        }
      />
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
        <EndUserEdit
          endUser={endUser}
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
