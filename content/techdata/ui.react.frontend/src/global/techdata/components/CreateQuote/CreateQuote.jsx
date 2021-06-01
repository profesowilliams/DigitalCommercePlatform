import React, { useEffect, useState } from 'react';
import SelectMethod from './SelectMethod';
import { mapDispatchToProps } from './dispatch';
import { mapStateToProps } from './selector';
import { connect } from 'react-redux';
import SavedCart from './SavedCart';
import Pricing from './Pricing';
import EstimatedId from './EstimatedId';
import { usPost } from '../../../../utils/api';

const fixedPayload = { 
  salesOrg:"0100",
  TargetSystem:"R3",
  Creator:"700303",
  Type:{
    Id:"ss",
    Value: "test",
  },
  CustomerPO:"test",
  EndUserPo:"Test1",
  EndUser:{
    Id:"1",
    Contact:[
      {
        Email:"test@df.com",
        Name:"qwe user",
        Phone:"1"
      },
      {
        Email:"test@df.com",
        Name:"qwe user2",
        Phone:"123"
      }
    ]
  },
  VendorReference:{
    Type:"1"
  },
  Reseller:{
    Id:"0038048612",
    Contact:[
      {
        Email:"test2@df.com",
        Name:null,
        Phone:"1"
      },
      {
        Email:"test2@df.com",
        Name:"tdos1 tdos2",
        Phone:"123"
      }
    ]
  },
  ShipTo:{
    Id:"1"
  },
  Items:[
    {
      Id:"1",
      Quantity:5,
      Product:[
        {
          Id:"10487448",
          Manufacturer:"10487448",
          Name:"Test1",
          Type:"1"
        }
      ]
    }
  ]
}

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
  const getErrorMessage = (text, messages = []) => {
    return `${text} ${messages.join(' -- ')}`
  }
  const createQuote = async () => {
    try{
      const { endpoint } = endpoints;
      const createFromTypes = {
        saved: 'savedCart',
        active: 'activeCart',
        estimate: 'estimationId',
      }
      //this condition for key equeals to cero is to give QA an opprtunity to test a failed create quote
      //this conditins needs to be removed later
      let params = { ...fixedPayload, pricingCondition: pricing.key === '1' ? null : pricing.key, createFromType: createFromTypes[methodSelected.key]  }
      if( methodSelected.key !== 'active' )
        params = {...params, createFromId: cartID };
      const { data: { content, error: { isError, messages } } } = await usPost(endpoint, params);
      if( isError )
        return alert( 'Error in create quote' )
      const { quoteId } = content;
      alert(`Create quote: ${cartID ? cartID : 'Active cart' }, ${quoteId}`);
      window.location.href = `${quotePreviewUrl}${quotePreviewUrl.indexOf('?') >= 0 ? '&' : '?' }quoteId=${quoteId}`;
    }catch{
      alert( `Unexpected Error in create quote` )
    }
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
          next={goToPricing}
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
