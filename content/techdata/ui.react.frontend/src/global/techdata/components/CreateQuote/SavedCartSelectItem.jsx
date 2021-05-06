import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';

const SavedCartSelectItem = ({ onClick, buttonTitle, cartslistEndpoint, cartdetailsEndpoint }) => {
  const [selected, setSelected] = useState(false);
  const [cartList, setCartList] = useState([]);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(async() => {
    const { data: { content: { items } } } = await usGet(cartslistEndpoint, { });
    if(items)
      setCartList(items)
  },[])
  const onNext = async () => {
    if( !selected )
      return alert('Select an item to continue');
    const getCart = `${cartdetailsEndpoint}?id=${selected.id}`
    const { data: { content: { data }, error: { isError } } } = await usGet(getCart, { });
    if( isError ) return alert('Error');
    if( data ){
      if(data.items && data.items.length > 0){
        alert('Create from valid cart')
        // onClick();
      }else{
        alert('No items in selected cart')
      }
    }else{
      alert('Invalid cart')
    }
  }
  return(
    <>
      { cartList.length > 0 && <SearchList items={cartList} selected={selected} onChange={onChange} />}
      <Button disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default SavedCartSelectItem;