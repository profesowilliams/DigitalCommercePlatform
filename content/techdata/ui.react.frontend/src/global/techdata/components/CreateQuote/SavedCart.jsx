import React, { useEffect, useState } from 'react';
import Button from '../Widgets/Button';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import SavedCartManuallyTyped from './SavedCartManuallyTyped';

const SavedCart = ({ method, setMethod, methods, createQuote, buttonTitle }) => {
  const cartTypes = [
    { id: 'manually', name: 'Enter Cart name' },
    { id: 'browse', name: 'Browse carts' },
  ];
  const [cartType, setCartType] = useState(false);
  const [cartName, setCartName] = useState("");
  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep(1);
  }

  const manuallyCreateQuote = () => {
    //this alert should be a endpoint to validate the cart name provided by the user
    alert('Validating cartName...');
    if( cartName ){
      createQuote()
    }else{
      alert('Write a cart name to continue.')
    }
  }

  return(
    <>
      <WidgetTitle>
        { step > 0 ? 
          <a onClick={() => setStep(0) }><i class="fas fa-chevron-left"></i> {method.title}</a> : 
          method.title 
        }
      </WidgetTitle>
      { step === 0 &&
        (
          <> 
            <Dropdown selected={method} setValue={setMethod} options={methods} />
            <RadioButtons selected={cartType} options={cartTypes} onSelect={(val) => setCartType(val)} /> 
            <br />
          </> 
        )
      }
      {
        step > 0 && (cartType && cartType.id==='manually') && 
        <>
          <SavedCartManuallyTyped inputValue={cartName} setValue={setCartName} />
          <Button disabled={!cartName} onClick={manuallyCreateQuote}>{buttonTitle}</Button>
        </>
      }
      { step === 0 && <Button disabled={!cartType} onClick={nextStep}>Next</Button>}
    </>
  );
};

export default SavedCart;