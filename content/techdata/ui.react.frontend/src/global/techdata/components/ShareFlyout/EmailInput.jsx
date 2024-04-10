import React, { useState, useEffect } from 'react';

import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export function EmailInput({ id, label, required, enableShareButton, requiredText, updateRequestObject, updatedEmailArr, emailsArr }) {

  const [inputValue, setInputValue] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);

  useEffect(() => {
    if (JSON.stringify(selectedEmails) !== JSON.stringify(emailsArr)) {
      setSelectedEmails(emailsArr);
    }
  }, [emailsArr]);

  useEffect(() =>{
    if (selectedEmails?.length) {
      if (enableShareButton) {
        enableShareButton(true);
      }
      updateRequestObject({
        'ToEmail': selectedEmails
      });
    } else {
      if (enableShareButton) {
        enableShareButton(false);
      }
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
      updatedEmailArr([...selectedEmails]);
    } else if (situation === 'removeOption') {
      const filteredEmails = selectedEmails.filter(item => item !== option.option);
      setSelectedEmails([...filteredEmails]);
      updatedEmailArr([...filteredEmails]);
    } else {
      const lastEmail = value[value.length - 1];
      setSelectedEmails([...new Set([...selectedEmails, ...value])]);
      updatedEmailArr([...new Set([...selectedEmails, ...value])]);
      if (!isValidEmailFormat(value[value.length - 1])) {
        setInvalidEmails([...invalidEmails, lastEmail])
      }
    }
  };

  const handleDelete = (emailToDelete) => {
    const updatedEmails = selectedEmails.filter(
      (email) => email !== emailToDelete
    );
    setSelectedEmails(updatedEmails);
    updatedEmailArr(updatedEmails);
    setInvalidEmails([]);
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text");

    const emailsToPaste = pastedText.split(/[\s,;]+/).filter(Boolean);

    const invalidEmailsFilter = emailsToPaste.filter((email) =>
      !isValidEmailFormat(email)
    );

    setSelectedEmails([...selectedEmails, ...emailsToPaste]);
    updatedEmailArr([...selectedEmails, ...emailsToPaste]);
    setInputValue("");
    setInvalidEmails([...invalidEmails, ...invalidEmailsFilter]);
    event.preventDefault();
  };

  const handleEmailEdit = (event) => {
    const emailToEdit = event?.currentTarget?.innerText;
    const updatedEmails = selectedEmails.filter(
      (email) => email !== emailToEdit
    );
    if (inputValue !== '') {
      updatedEmails.push(inputValue);
    }
    setSelectedEmails([...updatedEmails]);
    updatedEmailArr([...updatedEmails]);
    if (!isValidEmailFormat(inputValue)) {
      setInvalidEmails([...invalidEmails, inputValue])
    }
    setInputValue(emailToEdit);
  };

  return (
        <>
          <Autocomplete
            multiple
            id={id}
            options={[]}
            freeSolo={true}
            disableClearable
            defaultValue={[]}
            value={selectedEmails}
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
                  onDoubleClick = {handleEmailEdit}
                  onDelete={() => handleDelete(option)}
                  color={invalidEmails.includes(option) ? "error" : "default"}
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
