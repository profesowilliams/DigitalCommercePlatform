import React, { useEffect, useState } from 'react';
import SelectMethod from './SelectMethod';
import { mapDispatchToProps } from './dispatch';
import { mapStateToProps } from './selector';
import { connect } from 'react-redux';
import SavedCart from './SavedCart';
import Pricing from './Pricing';
import EstimatedId from './EstimatedId';
import { usPost } from '../../../../utils/api';
import Modal from '../Modal/Modal';

const fixedPayload = { 
    "createFromId": "96722368",
    "createFromType": 2,
    "targetSystem": "R3",  
    "pricingCondition": "0"
}

const QuoteCreate = ({ 
    requested, authError, componentProp, 
  }) => {
  const { 
    label, quotePreviewUrl, buttonTitle, optionsList, pricingConditions,
    ...endpoints
  } = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false)
  const [createQuoteTitle, setCreateQuoteTitle] = useState(buttonTitle)
  const [currentCart, setCurrentCart] = useState(false);
  const [pricing, setPricing] = useState(false);
  const [step, setStep] = useState(0);
  const [cartID, setCartID] = useState(false);
  const [createQuoteButtonEnabled, setCreateQuoteButtonEnabled] = useState(false);

  const [modal, setModal] = useState(null);
  const methods = optionsList;

  const validateActiveCart = () => {
    if(currentCart ){
      if( currentCart.totalQuantity > 0 ){
        setCreateQuoteButtonEnabled(true);
        return { isError: false, message: '' };
      }else{
        setCreateQuoteButtonEnabled(false);
        return { isError: true, message: 'The cart is empty' };
      }
    }else{
      return { isError: true, message: 'Not a valid cart available' };
    }
  }
  const goToPricing = (id,config={}) => {
    const redirectToPreview = config?.redirectToPreview || false;
    if( id ){ 
      setCartID(id);
      if (redirectToPreview){
        window.location.href = `quotes/quote-preview.html?id=${id}&isEstimateId=true&vendor=${config.configurationItem.vendor}`
        return;
      }
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
      const { endpoint } = endpoints;
      const createFromTypes = {
        saved: 'savedCart',
        active: 'activeCart',
        estimate: 'estimationId',
      }
      setCreateQuoteTitle("Quote Creating In Progress")
      setPricing(false)
      //this condition for key equeals to cero is to give QA an opprtunity to test a failed create quote
      //this conditins needs to be removed later
      let params = { ...fixedPayload, pricingCondition: pricing.key === '1' ? null : pricing.key, createFromType: createFromTypes[methodSelected.key]  }
      if( methodSelected.key !== 'active' )
        params = {...params, createFromId: cartID };
      const { data: { content, error: { isError, messages } } } = await usPost(endpoint, params);
      if( isError ){
        return alert( 'Error in create quote' )
      }
      setModal((previousInfo) => (
        {
          content: (
            <div>Your Quote will be created shortly, it can take some minutes before you will be able to see it.<br/> When you close this message, you will see the Quotes dashboard page. <br/>Please refresh it after some minutes to see your quote.</div>
          ),
          properties: {
              title:  'Create Quote',
          },
            ...previousInfo,
        }
    ));
    setCreateQuoteTitle(buttonTitle)
      const { quoteId } = content;
      window.location.href = `${quotePreviewUrl}${quotePreviewUrl.indexOf('?') >= 0 ? '&' : '?' }quoteId=${quoteId}`;
  }

	useEffect(() => {
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
          id='SelectedMethod'
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
          enabled={createQuoteButtonEnabled}
          createQuote={createQuote} 
          buttonTitle={createQuoteTitle}
          method={pricing}
          setMethod={(option)=>setPricing(option)}
          pricingConditions={pricingConditions}
          prev={prev}
        />
      }
     
     {
        requested && <p>Loading</p>
      }
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
      ></Modal>}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteCreate);
