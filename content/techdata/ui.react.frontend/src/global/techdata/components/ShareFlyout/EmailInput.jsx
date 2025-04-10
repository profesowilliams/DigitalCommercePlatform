import React, { useState, useEffect } from 'react';

import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export function EmailInput({ id, label, required, enableShareButton, resetDataFlag, requiredText, updateRequestObject, updatedEmailArr, emailsArr = [] }) {

  const [inputValue, setInputValue] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);

  useEffect(() => {
    if (emailsArr && selectedEmails && (JSON.stringify(selectedEmails) !== JSON.stringify(emailsArr))) {
      setSelectedEmails(emailsArr);
    }
  }, [emailsArr]);

  useEffect(() => {
    if (resetDataFlag) {
      setInvalidEmails([]);
      setSelectedEmails([]);
    }
  }, [resetDataFlag]);

  useEffect(() =>{
    if (selectedEmails?.length) {
      if (id === 'to-email') {
        updateRequestObject({
          'ToEmail': selectedEmails
        });
      } else {
        updateRequestObject({
          'CcEmail': selectedEmails
        });
      }
    } else {
      if (id === 'to-email') {
        updateRequestObject({
          'ToEmail': selectedEmails
        });
      } else {
        updateRequestObject({
          'CcEmail': selectedEmails
        });
      }
    }
  }, [selectedEmails]);

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
  };

  const addNewEmail = (email) => {
    if (email !== '') {
      handleSelect(null, [email], '', null);
      setInputValue('');
    }
  }

  const isExistingEmail = (email) => {
    return selectedEmails.includes(email);
  }

  const handleOnBlur = (event) => {
    const value = event.target.value.trim() || '';

    if (!isExistingEmail(value)) {
      addNewEmail(value);
    }
  }

  const handleKeyDown = (event) => {
    let value = event.target.value || '';
    const processAndRemoveCharacter = event.key === " " || event.key === "," || event.key === ";";
    const processNewEmail = event.key === "Tab" || processAndRemoveCharacter;

    if (processAndRemoveCharacter) {
      event.preventDefault();
    }

    value = value.trim();

    if (!isExistingEmail(value) && value !== '' && processNewEmail) {
      addNewEmail(value);
    }
  }

  const handleSelect = (event, value, situation, option) => {
    if (event?.keyCode === 8) {
      selectedEmails.pop();
      setSelectedEmails([...selectedEmails]);
      updatedEmailArr([...selectedEmails], id === 'to-email');
    } else if (situation === 'removeOption') {
      const filteredEmails = selectedEmails.filter(item => item !== option.option);
      setSelectedEmails([...filteredEmails]);
      updatedEmailArr([...filteredEmails], id === 'to-email');
    } else {
      const lastEmail = value[value.length - 1];
      setSelectedEmails([...new Set([...selectedEmails, ...value])]);
      updatedEmailArr([...new Set([...selectedEmails, ...value])], id === 'to-email');
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
    updatedEmailArr(updatedEmails, id === 'to-email');
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
    updatedEmailArr([...selectedEmails, ...emailsToPaste], id === 'to-email');
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
    updatedEmailArr([...updatedEmails], id === 'to-email');
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
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
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
