import React, { useEffect, useState } from 'react';
import SelectMethod from './SelectMethod';
import {mapDispatchToProps} from './dispatch';
import {mapStateToProps} from './selector';
import { connect } from 'react-redux';

const QuoteCreate = ({ 
    quoteCreated, requested, showError, cart, authError,
    getLocalStorageUser, createQuoteRequestDispatcher, componentProp, 
  }) => {
  const { cartLabel, label, endpoint, buttonTitle } = JSON.parse(componentProp)
  const [methodSelected, setMethodSelected] = useState(false)
  const methods = [
    {
      id: 1,
      name: cartLabel
    },
  ]
  const createQuote = async () => {
    if( methodSelected && cart ){
      createQuoteRequestDispatcher( endpoint, cart )
    }else{
      alert('please select an option to continue.')
    }
  }
  useEffect(() => {
    getLocalStorageUser()
  },[])
  useEffect(() => {
    if( showError )
      alert('An error occours, please confirm your data and try again')
  },[showError])
  useEffect(() => {
    if( quoteCreated.quoteDetails ){
      const { quoteDetails } = quoteCreated
      alert(`Quote created, quote ID: ${quoteDetails.quoteNumber}`)
    }
  },[quoteCreated])
  if( authError )
    return (
      <p>You need to be logged to use this feat</p>
    )
  return(
    <>
      <h3 className="cmp-title--small">{ label }</h3>
      <SelectMethod 
        method={methodSelected}
        setMethod={setMethodSelected}
        methods={methods}
        createQuote={createQuote}
        buttonTitle={buttonTitle}
      />
      {
        requested && <p>Loading</p>
      }
    </>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)(QuoteCreate);