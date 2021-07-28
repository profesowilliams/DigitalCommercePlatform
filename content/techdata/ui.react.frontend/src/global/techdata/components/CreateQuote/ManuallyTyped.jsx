import React, { useState } from 'react';
import InputText from '../Widgets/TextInput';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import ErrorMessage from './ErrorMessage';

const ManuallyTyped = ({
  onClick, inputValue, setValue, label, validateCartEndpoint, onError, estimatedIdListEndpoint
}) => {
  const [invalidCartName, setInvalidCartName] = useState(false);
  const { msgBeforelink, msgAfterlink, linklabel, linkFunction, errorMsg } = onError;
  const onChange = (event) => {
    setValue(event.target.value);
  }
  const processMannuallyCart = async () => {
    const params = { id: inputValue, isCartName: true }
    try{
      const { data: { content, error: { isError } } } = await usGet(validateCartEndpoint,{ params })
      if( isError ){
        setInvalidCartName(inputValue);
        return;
      }
      setInvalidCartName(false);
      const { data: { items, source }} = content
      const total = items.reduce((result, item) => ( result + item.quantity ), 0 );
      if( total > 0 && source.id ){
        onClick(source.id);
      }else{
        alert('No items in selected cart')
      }
    }catch(e){
      alert('Error getting data')
    }
  }
  const goToNext = async () => {
    try{
      if( estimatedIdListEndpoint ){
        const { data: { content: { items } } } = await usGet(estimatedIdListEndpoint, { });
        if( items ){
          const filtered = items.filter((item) => item.configId === inputValue )
          if( filtered[0] ){
            const newEndpoint = validateCartEndpoint.replace('{selected-id}', inputValue)
            const { data: { content: { isValid }, error: { isError } } } = await usGet(newEndpoint, { });
            if(isValid)
              onClick(inputValue);
            else
              alert('Not a valid estimated ID')
          }else{
            setInvalidCartName(inputValue);
          }
        }else{
          setInvalidCartName(inputValue);
        }
      }else{
        processMannuallyCart()
      }
    }catch(e){
      console.log('ERROR?',e)
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
