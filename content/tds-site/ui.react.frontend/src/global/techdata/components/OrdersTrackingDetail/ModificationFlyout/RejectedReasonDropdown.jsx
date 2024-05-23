import React, { useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const RejectedReasonDropdown = ({
  labels,
  rejectedReason,
  handleChangeReason,
}) => {
  useEffect(() => {
    handleChangeReason('');
  }, []);

  const {
    selectReasonLabel,
    rejectionPrice,
    rejectionAvailability,
    rejectionOther,
    rejectionRequiredInfo,
  } = labels;

  return (
    <div className="decreased-reason-dropdown">
      <FormControl fullWidth>
        <InputLabel className={'decreased-reason-label'}>
          {getDictionaryValueOrKey(selectReasonLabel)}
        </InputLabel>
        <Select
          value={rejectedReason}
          onChange={(e) => handleChangeReason(e.target.value)}
          className="decreased-reason-select"
          variant="standard"
        >
          <MenuItem value={'Z1'}>
            {getDictionaryValueOrKey(rejectionPrice)}
          </MenuItem>
          <MenuItem value={'Z2'}>
            {getDictionaryValueOrKey(rejectionAvailability)}
          </MenuItem>
          <MenuItem value={'Z3'}>
            {getDictionaryValueOrKey(rejectionOther)}
          </MenuItem>
        </Select>
        <div className="decreased-validation-text">
          {getDictionaryValueOrKey(rejectionRequiredInfo)}
        </div>
      </FormControl>
    </div>
  );
};
export default RejectedReasonDropdown;
