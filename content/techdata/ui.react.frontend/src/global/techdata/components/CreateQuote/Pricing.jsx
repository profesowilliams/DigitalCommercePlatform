import React, { useEffect, useState } from 'react';
import Dropdown from '../Widgets/Dropdown';
import Button from '../Widgets/Button';
import { get } from '../../../../utils/api';
import WidgetTitle from '../Widgets/WidgetTitle';
import Loader from '../Widgets/Loader';
import { isNotEmptyValue } from '../../../../utils/utils';

const Pricing = ({
  createQuote,
  buttonTitle,
  method,
  setMethod,
  pricingConditions,
  disableCreateQuoteButton,
  prev,
  placeholderText,
  modalEventError,
  errorMessage
}) => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() =>{
    const getData = async () => {
      setIsLoading(true);
      const { data: { content: { pricingConditions: { items } }, error: { isError } } } = await get(pricingConditions).catch((error) => {
        if (error) {
          setIsLoading(false);
        }
      });
      setIsLoading(false);
      if (isError) modalEventError(isNotEmptyValue(errorMessage.errorInPrice) ? errorMessage.errorInPrice : 'Error in pricing conditions');
      if( items ){
        const newItems = items.map(item => ({label: item.key, key: item.value}) );
        const item = newItems.filter(item => item.label === 'Commercial(Non-Govt)');
        if(item&&item.length>0){
          setMethod(item[0]) 
        }
        setItems(newItems);
      }
    }
    try{
      getData();
    }catch{
      modalEventError(isNotEmptyValue(errorMessage.errorGettingCart) ? errorMessage.errorGettingCart : 'error getting data');
    }
  },[])
  return (
    <>
      <WidgetTitle>
        <a onClick={prev}><i className="fas fa-chevron-left"></i> Create quote from</a>
      </WidgetTitle>
      {isLoading ? <Loader visible={true}/> : <Dropdown selected={method} setValue={setMethod} options={items} label="Select the pricing option" placeholderText={placeholderText}/>}
      <Button btnClass="cmp-quote-button" disabled={!method || disableCreateQuoteButton} onClick={createQuote}>{buttonTitle}</Button>
    </>
  )
}

export default Pricing
