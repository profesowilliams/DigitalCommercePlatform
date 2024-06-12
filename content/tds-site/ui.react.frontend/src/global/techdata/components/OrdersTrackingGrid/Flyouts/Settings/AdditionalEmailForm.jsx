import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  AddElement,
  AddElementDisabled,
} from '../../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../../OrdersTrackingCommon/Store/OrderTrackingStore';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const AdditionalEmailForm = ({ labels, onChange }) => {
  const [newEmailInputOpen, setNewEmailInputOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.SettingsFlyout'];

  const handleInputChange = (e) => {
    setNewEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
  };

  const addNewEmail = () => {
    onChange(newEmail);
  };

  const openNewEmailInput = () => {
    setNewEmailInputOpen(true);
  };

  const renderAddButton = isEmailValid ? (
    <div onClick={addNewEmail}>
      <AddElement />
    </div>
  ) : (
    <div>
      <AddElementDisabled />
    </div>
  );

  return (
    <>
      {newEmailInputOpen ? (
        <div className="add-email-input-wrapper">
          <TextField
            value={newEmail}
            onChange={handleInputChange}
            variant="standard"
            label={labels.newEmailAddress + '*'}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          {renderAddButton}
        </div>
      ) : (
        <p className="add-email" onClick={openNewEmailInput}>
            {translations?.Add_Another_Email}
        </p>
      )}
      <p className="internal-use-info">
        {translations?.For_Internal_Use_Only}
      </p>
    </>
  );
};

export default AdditionalEmailForm;
