import React from 'react';
import InputText from '../Widgets/TextInput';

const ManuallyTyped = ({inputValue, setValue, label}) => {
  const onChange = (event) => {
    setValue(event.target.value);
  }
  return(
    <p>
      <InputText onChange={onChange} inputValue={inputValue} label={`Enter ${label}`} />
    </p>
  );
};

export default ManuallyTyped;
