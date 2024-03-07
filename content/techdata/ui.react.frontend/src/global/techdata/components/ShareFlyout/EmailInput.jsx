import React, { useState, useEffect } from 'react';

import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export function EmailInput({ id, label, required, enableShareButton, requiredText, updateRequestObject }) {

  const [inputValue, setInputValue] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  useEffect(() =>{
    if (selectedEmails?.length && enableShareButton) {
      enableShareButton(true);
      updateRequestObject({
        'ToEmail': selectedEmails
      });
    } else if (enableShareButton) {
      enableShareButton(false);
      updateRequestObject({
        'ToEmail': []
      });
    }
  }, [selectedEmails]);

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
  };

  const handleSelect = (event, value, situation, option) => {
    if (event?.keyCode === 8) {
      selectedEmails.pop();
      setSelectedEmails([...selectedEmails]);
    } else if (situation === 'removeOption') {
      const filteredEmails = selectedEmails.filter(item => item !== option.option);
      setSelectedEmails([...filteredEmails]);
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
            //onChange={handleSelect}
            onChange={(e, value, situation, option) => {
              handleSelect(e, value, situation, option);
            }}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label={getDictionaryValueOrKey(label)}
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
