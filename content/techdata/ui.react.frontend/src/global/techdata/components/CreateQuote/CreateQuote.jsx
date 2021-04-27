import React, { useEffect, useState } from 'react';
import SelectMethod from './SelectMethod';
import {mapDispatchToProps} from './dispatch';
import {mapStateToProps} from './selector';
import { connect } from 'react-redux';
import SavedCart from './SavedCart';

const QuoteCreate = ({ 
    requested, authError, componentProp, 
  }) => {
  const { label, quotePreviewUrl, buttonTitle, optionsList } = JSON.parse(componentProp)
  const [methodSelected, setMethodSelected] = useState(false)
  const [currentCart, setCurrentCart] = useState(false);
  const methods = optionsList;
  const createQuote = () => {
      alert('Creating quote')
      window.location.href = quotePreviewUrl;
    }
  const createFromActive = async () => {
    if(currentCart ){
      if( currentCart.totalQuantity > 0 ){
        createQuote();
      }else{
        alert('The cart is empty');
      }
    }else{
      alert('Not a valid cart available');
    }
  }
  

  useEffect(async () => {
    const result = JSON.parse(localStorage.getItem("ActiveCart"));
    if( result )
      setCurrentCart({ totalQuantity: result.totalQuantity })
  },[])

  if( authError )
    return (
      <p>You need to be logged to use this feat</p>
    )
  return(
    <div className="cmp-widget">
      { 
        (!methodSelected || (methodSelected&&methodSelected.key ==='active')) && 
        <SelectMethod 
          title={label}
          method={methodSelected}
          setMethod={setMethodSelected}
          methods={methods}
          createQuote={createFromActive}
          buttonTitle={buttonTitle}
        /> 
      }
      {
        methodSelected && methodSelected.key==='saved' && 
        <SavedCart
          method={methodSelected}
          setMethod={setMethodSelected}
          methods={methods}
          createQuote={createQuote}
          buttonTitle={buttonTitle}
          />
      }
      {
        requested && <p>Loading</p>
      }
    </div>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)(QuoteCreate);