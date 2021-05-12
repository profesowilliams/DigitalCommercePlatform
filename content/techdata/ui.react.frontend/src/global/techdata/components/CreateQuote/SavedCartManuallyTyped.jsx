import React from 'react';
import InputText from '../Widgets/TextInput';

const SavedCartManuallyTyped = ({inputValue, setValue}) => {
  const onChange = (event) => {
    setValue(event.target.value);
  }
  return(
    <p>
      <InputText onChange={onChange} inputValue={inputValue} label="Enter Cart name" />
    </p>
  );
};

export default SavedCartManuallyTyped;