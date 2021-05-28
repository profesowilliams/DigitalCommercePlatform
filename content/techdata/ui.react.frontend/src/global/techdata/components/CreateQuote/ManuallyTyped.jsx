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
      alert('Not a valid cart name provided')
    }
  }
  const goToNext = async () => {
    try{
      if( estimatedIdListEndpoint ){
        const { data: { content: { items } } } = await usGet(estimatedIdListEndpoint, { }); 
        if( items ){
          const filtered = items.filter((item) => item.configId === inputValue )
          console.log('Coincidencia', filtered)
          if( filtered[0] ){
            const newEndpoint = `${validateCartEndpoint}/${inputValue}`
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
