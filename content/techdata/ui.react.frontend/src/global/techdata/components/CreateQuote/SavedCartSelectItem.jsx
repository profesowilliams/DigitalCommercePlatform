import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import Loader from '../Widgets/Loader';
import { isNotEmptyValue } from '../../../../utils/utils';
import {
  ERROR_CREATE_QUOTE_ERROR_GETTING_DATA,
  ERROR_CREATE_QUOTE_INVALID_CART,
  ERROR_CREATE_QUOTE_NO_ITEMS_CART,
  ERROR_CREATE_QUOTE_SELECT_ITEMS_TO_CONTINUE
} from '../../../../utils/constants';

const SavedCartSelectItem = ({
  onClick,
  buttonTitle,
  cartslistEndpoint,
  cartdetailsEndpoint,
  label="Search Cart Name",
  buttonLabel,
  modalEventError,
  errorMessage,
}) => {
  const [selected, setSelected] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [cartListError, setCartListError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const { data: { content: { items } } } = await usGet(cartslistEndpoint, {}).catch((error) => {
       if (error) {
         setIsLoading(false);
       } 
      });
      setIsLoading(false);
      if (items && items.length > 0) {
        setCartListError(false)
        setCartList(items)
      }else{
        setCartListError(true)
      }
    }
    try{
      getData()
    }catch{
      setCartListError(true)
    }
  },[])
  const onNext = async () => {
    if( !selected )
      return modalEventError(isNotEmptyValue(errorMessage.selectItemToContinue) ? errorMessage.selectItemToContinue : ERROR_CREATE_QUOTE_SELECT_ITEMS_TO_CONTINUE);
    try{
      const params = { id: selected.id, isCartName: false }
      setIsLoading(true);
      const { data: { content, error: { isError, messages } } } = await usGet(cartdetailsEndpoint, { params }).catch((error) => {
        if (error) {
          setIsLoading(false);
        }
      });
      setIsLoading(false);
      if (isError) return modalEventError(`Error: ${messages.join(' -- ')}`);
      const { data: { items } } = content;
      if( items ){
        const total = items.reduce((result, item) => ( result + item.quantity ), 0 );
        if(items && total > 0){
          onClick(selected.id);
        }else{
          modalEventError(isNotEmptyValue(errorMessage.emptyCart) ? errorMessage.emptyCart : ERROR_CREATE_QUOTE_NO_ITEMS_CART)
        }
      }else{
        modalEventError(isNotEmptyValue(errorMessage.invalidCart) ? errorMessage.invalidCart : ERROR_CREATE_QUOTE_INVALID_CART)
      }
    }catch(e){
      modalEventError(isNotEmptyValue(errorMessage.errorGettingCart) ? errorMessage.errorGettingCart : ERROR_CREATE_QUOTE_ERROR_GETTING_DATA)
    }
  }
  return(
    <>
      { cartList.length > 0 &&  <SearchList items={cartList} selected={selected} onChange={onChange} buttonLabel={buttonLabel} label={label}/>}
      { isLoading && <Loader visible={true} /> }
      {cartList.length === 0 && cartListError &&
        <p className="cmp-error-message cmp-error-message__red">No cart available <a className="cmp-error-message__link" href="https://shop.techdata.com/cart">Go to my cart</a></p> 
      }
      <Button btnClass="cmp-quote-button" disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default SavedCartSelectItem;
