import React, { useState } from 'react';
import InputText from '../Widgets/TextInput';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import ErrorMessage from './ErrorMessage';

const ManuallyTyped = ({onClick, inputValue, setValue, label, validateCartEndpoint, onError}) => {
  const [invalidCartName, setInvalidCartName] = useState(false);
  const { msgBeforelink, msgAfterlink, linklabel, linkFunction, errorMsg } = onError;
  const onChange = (event) => {
    setValue(event.target.value);
  }
  const goToNext = async () => {
    try{
      const params = { id: inputValue, isCartName: true }
      const { data: { content: { data: { items, source }}, error: { isError } } } = await usGet(validateCartEndpoint,{ params })
      if( isError || !items ){
        setInvalidCartName(inputValue);
        return;
      }
      setInvalidCartName(false);
      const total = items.reduce((result, item) => ( result + item.quantity ), 0 );
      if( total > 0 && source.id ){
        onClick(source.id);
      }else{
        alert('No items in selected cart')
      }
    }catch{
      setInvalidCartName(inputValue);
    }
  }
  return(
    <>
    <ErrorMessage
        msgBeforelink={msgBeforelink}
        msgAfterlink={msgAfterlink}
        linklabel={linklabel}
        linkFunction={linkFunction}
        errorMsg={`${errorMsg} ${inputValue}`}
        isActive={invalidCartName}
      />
      <p>
        <InputText onChange={onChange} inputValue={inputValue} label={label} bottomSpace/>
      </p>
      <Button disabled={!inputValue} onClick={goToNext}>Next</Button>
    </>
  );
};

export default ManuallyTyped;
