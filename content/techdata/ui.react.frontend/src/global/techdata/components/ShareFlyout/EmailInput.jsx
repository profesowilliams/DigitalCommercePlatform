import React, { useState, useEffect } from 'react';

import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export function EmailInput({ id, label, required, enableShareButton, requiredText }) {

  const [inputValue, setInputValue] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  useEffect(() =>{
    if (selectedEmails?.length && enableShareButton) {
      enableShareButton(true);
    } else if (enableShareButton) {
      enableShareButton(false);
    }
  }, [selectedEmails]);

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
  };

  const handleSelect = (event, value) => {
    if (event?.keyCode === 8) {
      selectedEmails.pop();
      setSelectedEmails([...selectedEmails]);
    } else {
      if (isValidEmailFormat(value[value.length - 1])) {
        if (selectedEmails.length < 10) {
          setSelectedEmails([...new Set([...selectedEmails, ...value])]);
        }
      }
    }
  };

  const handleDelete = (emailToDelete) => {
    const updatedEmails = selectedEmails.filter(
      (email) => email !== emailToDelete
    );
    setSelectedEmails(updatedEmails);
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text");

    const emailsToPaste = pastedText.split(/[\s,;]+/).filter(Boolean);

    const validEmails = emailsToPaste.filter((email) =>
      isValidEmailFormat(email)
    );

    setSelectedEmails([...selectedEmails, ...validEmails]);
    setInputValue("");
    event.preventDefault();
  };

  useEffect(() => {
  }, []);

  return (
        <>
          <Autocomplete
            multiple
            id={id}
            options={[]}
            freeSolo={true}
            options={[]}
            disableClearable
            defaultValue={[]}
            value={selectedEmails}
            onChange={handleSelect}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label={getDictionaryValueOrKey(label)}
                required={required}
                onPaste={handlePaste}
              />
            )}
          />
          {
          required && requiredText ? (
            <p className="required-text">{requiredText}</p> ) : null
           }
       </>
  );
}

export default EmailInput;
