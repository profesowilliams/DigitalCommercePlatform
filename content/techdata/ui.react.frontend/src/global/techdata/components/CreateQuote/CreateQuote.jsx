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
import { pushAnalyticsEvent } from './analytics';
import { getDictionaryValue, isNotEmptyValue } from '../../../../utils/utils';
import Loader from '../Widgets/Loader';
import ModalComponent from './ModalComponent';
import {
  ERROR_CREATE_QUOTE_EMPTY_CART,
  ERROR_CREATE_QUOTE_INVALID_CART,
  ERROR_CREATE_QUOTE_NOT_VALID_CART,
  ERROR_TITLE_DEFAULT
} from '../../../../utils/constants';

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
    label,
    quotePreviewUrl, 
    quotesGridUrl,
    buttonTitle,
    buttonTitleInProgress,
    createQuoteInProgress,
    createQuoteError,
    optionsList,
    pricingConditions,
    errorMessage,
    ...endpoints
  } = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [createQuoteTitle, setCreateQuoteTitle] = useState(buttonTitle);
  const [disableCreateQuoteButton, setDisableCreateQuoteButton] = useState(false);
  const [currentCart, setCurrentCart] = useState(false);
  const [pricing, setPricing] = useState(false);
  const [step, setStep] = useState(0);
  const [cartID, setCartID] = useState(false);
  const [createQuoteButtonEnabled, setCreateQuoteButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const methods = optionsList;
  const titleErrorModal = isNotEmptyValue(errorMessage.errorModalTitle) ? errorMessage.errorModalTitle : ERROR_TITLE_DEFAULT;

  /**
   * Function that execute and set the message for the error modal
   * @param {string} message 
   */
  const modalEventError = (message) =>{
    showSimpleModal(titleErrorModal, (
      ModalComponent(message)
    ));
  };

  const validateActiveCart = () => {
    if(currentCart ){
      if( currentCart.totalQuantity > 0 ){
        setCreateQuoteButtonEnabled(true);
        return { isError: false, message: '' };
      }else{
        setCreateQuoteButtonEnabled(false);
        return { isError: true, message: isNotEmptyValue(errorMessage.emptyCart) ? errorMessage.emptyCart : ERROR_CREATE_QUOTE_EMPTY_CART };
      }
    }else{
      return { isError: true, message: isNotEmptyValue(errorMessage.notValidCart) ? errorMessage.notValidCart : ERROR_CREATE_QUOTE_NOT_VALID_CART };
    }
  }
  const goToPricing = (id,config={}) => {
    const redirectToPreview = config?.redirectToPreview || false;
    if( id ){ 
      setCartID(id);
      if (redirectToPreview){
        window.location.href = quotePreviewUrl?.replace("{id}", id)
                                               .replace("{type}", config.configurationItem.configurationType)
                                               .replace("{vendor}", config.configurationItem.vendor);
        return;
      }
      setStep(1);
    }else if( methodSelected.key === 'active'  ){
      const { isError, message } = validateActiveCart();
      if(isError) {
          modalEventError(message);
      }
      else {
        pushAnalyticsEvent(true, methodSelected);
        setStep(1);
      }
    }else{
      modalEventError(isNotEmptyValue(errorMessage.invalidCart) ? errorMessage.invalidCart : ERROR_CREATE_QUOTE_INVALID_CART)
    }
  }
  
  const prev = () => {
    setStep(0);
  }
  const getErrorMessage = (text, messages = []) => {
    return `${text} ${messages.join(' -- ')}`
  }

  const showSimpleModal = (title, content, onModalClosed=closeModal, buttonLabel, modalAction) =>
    setModal((previousInfo) => ({
      content: content,
      properties: {
          title:  title,
          buttonLabel
      },
      onModalClosed,
      ...previousInfo,
      modalAction
    })
  );

  const closeModal = () => setModal(null);

  const createQuote = async () => {
      const { endpoint } = endpoints;
      const createFromTypes = {
        saved: 'savedCart',
        active: 'activeCart',
        estimate: 'estimationId',
      }
      setDisableCreateQuoteButton(true);
      setCreateQuoteTitle(buttonTitleInProgress);

      //this condition for key equeals to cero is to give QA an opprtunity to test a failed create quote
      //this conditins needs to be removed later
      let params = { ...fixedPayload, pricingCondition: pricing.key === '1' ? null : pricing.key, createFromType: createFromTypes[methodSelected.key]  }
      if( methodSelected.key !== 'active' )
        params = {...params, createFromId: cartID };
    try {
        setIsLoading(true);
      const { data: { content, error: { isError, code, messages } } } = await usPost(endpoint, params).catch((error) => {
        if (error) {
          setIsLoading(false);
          }
        });
        setIsLoading(false);
        pushAnalyticsEvent(false, methodSelected);

        // Only display error messages coming from the backend response when the code returned is 11000
        if (isError && code == 11000) {
          showSimpleModal('Create Quote', (
            <div>{messages[0]}</div>
          ));
        }
        else if( isError ){
          showSimpleModal('Create Quote', (
            <div>{createQuoteError}</div>
          ));
        }
        else {
          showSimpleModal('Create Quote', (
            <div>{createQuoteInProgress.replace("{confirmation-id}", content.confirmationId)} </div>
          ), closeModal, "Track My Quote", () => window.location.href = quotesGridUrl);
        }
      }
      catch(e) {
        console.error(e);
        showSimpleModal('Create Quote', (
          <div>{createQuoteError}</div>
        ));
      }
      setDisableCreateQuoteButton(false);
      setCreateQuoteTitle(buttonTitle);
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
          placeholderText={getDictionaryValue("techdata.quotes.placeholder.createfrom", "Create From")}
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
          buttonLabel = {"Select Cart"}
          modalEventError={modalEventError}
          errorMessage={errorMessage}
          />
      }
      {methodSelected && methodSelected.key === 'estimate' && step === 0 && (
				<EstimatedId
					method={methodSelected}
					setMethod={setMethodSelected}
					methods={methods}
          next={goToPricing}
					endpoints={endpoints}
          buttonLabel = {"Select Estimate"}
          modalEventError={modalEventError}
          errorMessage={errorMessage}
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
          disableCreateQuoteButton={disableCreateQuoteButton}
          placeholderText={getDictionaryValue("techdata.quotes.placeholder.selectpricingtype", "Select pricing type")}
          prev={prev}
          modalEventError={modalEventError}
          errorMessage={errorMessage}
        />
      }
     
     {
        requested && <p>Loading</p>
      }
      {isLoading && <Loader visible={true}/>}
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={modal.onModalClosed}
      ></Modal>}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteCreate);
