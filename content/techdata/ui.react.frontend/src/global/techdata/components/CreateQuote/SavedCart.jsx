import React, { useEffect, useState } from 'react';
import Button from '../Widgets/Button';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import ManuallyTyped from './ManuallyTyped';
import SavedCartSelectItem from './SavedCartSelectItem';

const SavedCart = ({ 
  method, 
  setMethod, 
  methods, 
  endpoints,
  next,
 }) => {
  const { cartslistEndpoint, cartdetailsEndpoint } = endpoints;
  const cartTypes = [
    { id: 'manually', name: 'Enter Cart name' },
    { id: 'browse', name: 'Browse carts' },
  ];
  const [cartType, setCartType] = useState(false);
  const [cartName, setCartName] = useState("");
  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep(step + 1);
  }
  const prevStep = () => {
    setStep(step - 1);
  }
  const goToNext = () => next(cartType)

  return(
    <>
      <WidgetTitle>
        { step > 0 ?
          <a onClick={prevStep}><i className="fas fa-chevron-left"></i> {method.title}</a> :
          method.title
        }
      </WidgetTitle>
      { step === 0 &&
        (
          <>
            <Dropdown selected={method} setValue={setMethod} options={methods} />
            <RadioButtons selected={cartType} options={cartTypes} onSelect={(val) => setCartType(val)} />
          </>
        )
      }
      {
        step === 1 && (cartType && cartType.id==='manually') && 
        <>
          <SavedCartManuallyTyped inputValue={cartName} setValue={setCartName} />
          <Button disabled={!cartName} onClick={goToNext}>Next</Button>
        </>
      }
      {
        step === 1 && (cartType && cartType.id==='browse') && 
          <SavedCartSelectItem 
            onClick={goToNext} 
            buttonTitle="Next" 
            cartslistEndpoint={cartslistEndpoint} 
            cartdetailsEndpoint={cartdetailsEndpoint}
          />
      }
      { step === 0 && <Button disabled={!cartType} onClick={nextStep}>Next</Button>}
    </>
  );
};

export default SavedCart;
