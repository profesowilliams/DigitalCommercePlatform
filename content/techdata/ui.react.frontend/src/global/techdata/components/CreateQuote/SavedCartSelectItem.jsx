import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';

const SavedCartSelectItem = ({ onClick, buttonTitle, cartslistEndpoint, cartdetailsEndpoint, label="Search Cart Name" }) => {
  const [selected, setSelected] = useState(false);
  const [cartList, setCartList] = useState([]);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      const { data: { content: { items } } } = await usGet(cartslistEndpoint, { });
      if(items)
        setCartList(items)
    }
    getData()
  },[])
  const onNext = async () => {
    if( !selected )
      return alert('Select an item to continue');
    try{
      const params = { id: selected.id, isCartName: false }
      const { data: { content: { data }, error: { isError } } } = await usGet(cartdetailsEndpoint, { params });
      if( isError ) return alert('Error');
      if( data ){
        const total = data.items.reduce((result, item) => ( result + item.quantity ), 0 );
        if(data.items && total > 0){
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
      { cartList.length > 0 && <SearchList items={cartList} selected={selected} onChange={onChange} label={label}/>}
      <Button disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default SavedCartSelectItem;
