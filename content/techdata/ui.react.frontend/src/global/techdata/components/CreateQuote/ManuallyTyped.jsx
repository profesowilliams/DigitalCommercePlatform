import React, { useState } from 'react';
import InputText from '../Widgets/TextInput';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import ErrorMessage from './ErrorMessage';

const ManuallyTyped = ({onClick, inputValue, setValue, label, validateCartEndpoint}) => {
  const onChange = (event) => {
    setValue(event.target.value);
  }
  const goToNext = async () => {
    try{
      const params = { id: inputValue, isCartName: true }
      const { data: { content: { data: { items, source }}, error: { isError } } } = await usGet(validateCartEndpoint,{ params })
      if( isError || !items ) alert('Invalid cart')
      const total = items.reduce((result, item) => ( result + item.quantity ), 0 );
      if( total > 0 && source.id ){
        onClick(source.id);
      }else{
        alert('No items in selected cart')
      }
    }catch{
      alert('Invalid cart error')
    }
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
        isActive={false}
      />
      <p>
        <InputText onChange={onChange} inputValue={inputValue} label={`Enter ${label}`} />
      </p>
      <Button disabled={!inputValue} onClick={goToNext}>Next</Button>
    </>
  );
};

export default ManuallyTyped;
