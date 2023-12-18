import React, { useEffect, useState } from 'react';
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

const EmailsForm = ({ options, labels, value, onChange }) => {
  const { emailActive, additionalEmailActive, email, additionalEmail } = value;
  const initialValues = [
    ...(emailActive ? [options[0].key] : []),
    ...(additionalEmailActive ? [options[1].key] : []),
  ];
  const [values, setValues] = useState(initialValues);
  const [newAdditionalEmail, setNewAdditionalEmail] = useState(additionalEmail);

  const handleChange = (key, activeFlag, newValue) => {
    if (values.includes(key)) {
      setValues(values.filter((value) => value !== key));
      onChange(activeFlag, false);
    } else {
      setValues([...values, key]);
      onChange(activeFlag, true);
    }
    newValue && onChange(key, newValue);
  };

  const handleAdditionalEmailChange = (newValue) => {
    setNewAdditionalEmail(newValue);
    handleChange('additionalEmail', 'additionalEmailActive', newValue);
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
                  disabled={!newAdditionalEmail}
                />
              }
              disabled={!newAdditionalEmail}
              label={email}
              onChange={() => handleChange('email', 'emailActive')}
            />
            <p className="default-email">
              {getDictionaryValueOrKey(labels.defaultEmailAddress)}
            </p>
            {newAdditionalEmail ? (
              <>
                <div className="additional-email">
                  <FormControlLabel
                    key={options[1].key}
                    control={
                      <Checkbox
                        sx={styleCheckbox}
                        checked={values.includes(options[1].key)}
                      />
                    }
                    label={newAdditionalEmail}
                    onChange={() =>
                      handleChange('additionalEmail', 'additionalEmailActive')
                    }
                  />
                  <div
                    className="additional-email-delete"
                    onClick={() => handleAdditionalEmailChange('')}
                  >
                    <DeleteElement />
                  </div>
                </div>
                <div>
                  {values.length === 0 && (
                    <p className="error-message">
                      {getDictionaryValueOrKey(labels?.emailsErrorMessage)}
                    </p>
                  )}
                </div>
              </>
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
