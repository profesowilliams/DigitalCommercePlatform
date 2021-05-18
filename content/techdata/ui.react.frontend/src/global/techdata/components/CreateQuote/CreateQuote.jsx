import React, { useEffect, useState } from 'react';
import SelectMethod from './SelectMethod';
import { mapDispatchToProps } from './dispatch';
import { mapStateToProps } from './selector';
import { connect } from 'react-redux';
import SavedCart from './SavedCart';
import Pricing from './Pricing';
import EstimatedId from './EstimatedId';
import { get } from '../../../../utils/api';

const QuoteCreate = ({ 
    requested, authError, componentProp, 
  }) => {
  const { 
    label, quotePreviewUrl, buttonTitle, optionsList, pricingConditions,
    ...endpoints
  } = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false)
  const [currentCart, setCurrentCart] = useState(false);
  const [pricing, setPricing] = useState(false);
  const [step, setStep] = useState(0);
  const [cartID, setCartID] = useState(false);
  const methods = optionsList;

  const validateActiveCart = () => {
    if(currentCart ){
      if( currentCart.totalQuantity > 0 ){
        return { isError: false, message: '' };
      }else{
        return { isError: true, message: 'The cart is empty' };
      }
    }else{
      return { isError: true, message: 'Not a valid cart available' };
    }
  }
  const goToPricing = (id) => {
    if( id ){ 
      setCartID(id);
      setStep(1);
    }else if( methodSelected.key === 'active'  ){
      const { isError, message } = validateActiveCart();
      if(isError)
        alert(message);
      else
        setStep(1);
    }else{
      alert('Invalid cart, try again please')
    }
  }
  const prev = () => {
    setStep(0);
  }
  const createQuote = async () => {
    const { endpoint } = endpoints;
    let params = { pricingCondition: pricing.key }
    if( methodSelected.key !== 'active' )
      params = {...params, id: cartID };
    const { data: { content: { quoteDetails: { orderNumber } }, error: { isError, message } } } = await get(endpoint, { params });
    if( isError )
      return alert( `Error in create quote: ${message}` )
    alert(`Create quote: ${cartID ? cartID : 'Active cart' }, ${orderNumber}`);
    window.location.href = `${quotePreviewUrl}${quotePreviewUrl.indexOf('?') >= 0 ? '&' : '?' }orderNumber${orderNumber}`;
  }

	useEffect(async () => {
		const result = JSON.parse(localStorage.getItem('ActiveCart'));
		if (result) setCurrentCart({ totalQuantity: result.totalQuantity });
	}, []);

  if( authError )
    return (
      <p>You need to be logged to use this feat</p>
    )
  return(
    <div className="cmp-widget">
      { 
        (!methodSelected || (methodSelected&&methodSelected.key ==='active')) &&  step === 0 &&
        <SelectMethod 
          title={label}
          method={methodSelected}
          setMethod={setMethodSelected}
          methods={methods}
          createQuote={goToPricing}
          buttonTitle='Next'
        /> 
      }
      {
        methodSelected && methodSelected.key==='saved' && step === 0 && 
        <SavedCart
          method={methodSelected}
          setMethod={setMethodSelected}
          methods={methods}
          next={goToPricing}
          endpoints={endpoints}
          />
      }
      {methodSelected && methodSelected.key === 'estimate' && step === 0 && (
				<EstimatedId
					method={methodSelected}
					setMethod={setMethodSelected}
					methods={methods}
					createQuote={createQuote}
					buttonTitle={buttonTitle}
					endpoints={endpoints}
				/>
			)}
      {
        step === 1 &&
        <Pricing 
          createQuote={createQuote} 
          buttonTitle={buttonTitle}
          method={pricing}
          setMethod={setPricing}
          pricingConditions={pricingConditions}
          prev={prev}
        />
      }
      {
        requested && <p>Loading</p>
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteCreate);
