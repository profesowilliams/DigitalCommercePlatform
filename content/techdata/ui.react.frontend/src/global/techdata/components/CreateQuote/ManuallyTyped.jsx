import React from 'react';
import InputText from '../Widgets/TextInput';
import ErrorMessage from './ErrorMessage';

const ManuallyTyped = ({inputValue, setValue, label}) => {
  const onChange = (event) => {
    setValue(event.target.value);
  }

function testErrorMessage() {
  alert('Test Error Message');
}
  return(
    <>
      <ErrorMessage
        msgBeforelink='This is before the link '
        msgAfterlink=' This is after link'
        linklabel='Im the link Label'
        linkFunction={testErrorMessage}
        errorMsg='This  is the error message'
        isActive={true}
      />
      <p>
        <InputText onChange={onChange} inputValue={inputValue} label={`Enter ${label}`} />
      </p>
    </>
  );
};

export default ManuallyTyped;
