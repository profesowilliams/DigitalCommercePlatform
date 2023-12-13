import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { DeleteElement } from '../../../../fluentIcons/FluentIcons';
import AdditionalEmailForm from './AdditionalEmailForm';

const styleForm = {
  width: '100%',
};
const styleCheckbox = {
  color: '#003031',
  '&.Mui-checked:not(.Mui-disabled)': {
    color: '#005758',
    accentColor: '#005758',
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const EmailsForm = ({ options, labels }) => {
  const [values, setValues] = useState([options[0].key]);
  const [additionalEmail, setAdditionalEmail] = useState(undefined);

  const handleChange = (newValue) => {
    if (values.includes(newValue)) {
      setValues(values.filter((value) => value !== newValue));
    } else {
      setValues([...values, newValue]);
    }
  };

  const handleAdditionalEmailChange = (newValue) => {
    setAdditionalEmail(newValue);
    if (newValue) {
      handleChange(options[1].key);
    }
  };

  return (
    <div className="emails-form">
      <FormControl sx={styleForm}>
        {options && (
          <>
            <FormControlLabel
              key={options[0].key}
              control={
                <Checkbox
                  sx={styleCheckbox}
                  checked={values.includes(options[0].key)}
                  disabled={!additionalEmail}
                />
              }
              disabled={!additionalEmail}
              label={options[0].label}
              onChange={() => handleChange(options[0].key)}
            />
            <p className="default-email">
              {getDictionaryValueOrKey(labels.defaultEmailAddress)}
            </p>
            {additionalEmail ? (
              <div className="additional-email">
                <FormControlLabel
                  key={options[1].key}
                  control={
                    <Checkbox
                      sx={styleCheckbox}
                      checked={values.includes(options[1].key)}
                    />
                  }
                  label={additionalEmail}
                  onChange={() => handleChange(options[1].key)}
                />
                <div
                  className="additional-email-delete"
                  onClick={() =>
                    handleAdditionalEmailChange('', options[1].key)
                  }
                >
                  <DeleteElement />
                </div>
              </div>
            ) : (
              <AdditionalEmailForm
                labels={labels}
                onChange={handleAdditionalEmailChange}
              />
            )}
          </>
        )}
      </FormControl>
    </div>
  );
};

export default EmailsForm;
