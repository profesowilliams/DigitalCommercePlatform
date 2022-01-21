import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';

const SavedCartSelectItem = ({ onClick, buttonTitle, cartslistEndpoint, cartdetailsEndpoint, label="Search Cart Name", buttonLabel}) => {
  const [selected, setSelected] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [cartListError, setCartListError] = useState(false);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      const { data: { content: { items } } } = await usGet(cartslistEndpoint, { });
      if(items && items.length > 0 ){
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
      return alert('Select an item to continue');
    try{
      const params = { id: selected.id, isCartName: false }
      const { data: { content, error: { isError, messages } } } = await usGet(cartdetailsEndpoint, { params });
      if( isError ) return alert(`Error: ${messages.join(' -- ')}`);
      const { data: { items } } = content;
      if( items ){
        const total = items.reduce((result, item) => ( result + item.quantity ), 0 );
        if(items && total > 0){
          onClick(selected.id);
        }else{
          alert('No items in selected cart')
        }
      }else{
        alert('Invalid cart')
      }
    }catch(e){
      alert('Error getting the data')
    }
  }
  return(
    <>
      { cartList.length > 0 && <SearchList items={cartList} selected={selected} onChange={onChange} buttonLabel={buttonLabel} label={label}/>}
      { cartList.length === 0 && cartListError &&
        <p className="cmp-error-message cmp-error-message__red">No cart available <a className="cmp-error-message__link" href="https://shop.techdata.com/cart">Go to my cart</a></p> 
      }
      <Button btnClass="cmp-quote-button" disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default SavedCartSelectItem;
