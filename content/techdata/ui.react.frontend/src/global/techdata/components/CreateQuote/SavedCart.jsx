import React, { useState } from 'react';
import Button from '../Widgets/Button';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import SavedCartSelectItem from './SavedCartSelectItem';
import ManuallyTyped from './ManuallyTyped';
import { pushAnalyticsEvent } from './analytics';

const SavedCart = ({ 
  method, 
  setMethod, 
  methods, 
  endpoints,
  next,
  buttonLabel
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
    pushAnalyticsEvent(true, method);
    setStep(step + 1);
  }
  const prevStep = () => {
    setStep(step - 1);
  }
  const goToNext = (id) => next(id)
  const getonErrorObj = () => {
    let result = {
      errorMsg: 'We couldn´t find the cart:',
      msgBeforelink: 'Enter a new name or ',
      msgAfterlink: ' instead',
      linklabel: 'browse carts',
      linkFunction: () => setCartType(cartTypes[1])
    }
    if( method.manuallyTypedError ){
      const matches = method.manuallyTypedError.match(/\{(.*?)\}/g)
      if( matches ){
        const { 0: match } = matches
        const split = method.manuallyTypedError.split(match);
        result = { ...result, 
          msgBeforelink: split[0],
          msgAfterlink: split[1],
          linklabel: match.replace('{','').replace('}',''),
        }
      }
      
    }
    return result
  }
  const onError = getonErrorObj()
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
        <ManuallyTyped 
          validateCartEndpoint={cartdetailsEndpoint} 
          onClick={goToNext} inputValue={cartName} 
          setValue={setCartName}
          label={method.textPlaceholder}
          onError={onError} />
      }
      {
        step === 1 && (cartType && cartType.id==='browse') && 
          <SavedCartSelectItem 
            onClick={goToNext} 
            buttonTitle="Next" 
            cartslistEndpoint={cartslistEndpoint} 
            cartdetailsEndpoint={cartdetailsEndpoint}
            label={method.dropdownPlaceholder}
            buttonLabel={buttonLabel}
          />
      }
      { step === 0 && <Button btnClass="cmp-quote-button" disabled={!cartType} onClick={nextStep}>Next</Button>}
    </>
  );
};

export default SavedCart;
