  import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';

const EstimatedIdSelectItem = ({ onClick, buttonTitle, estimatedIdlistEndpoint, estimatedIddetailsEndpoint, label }) => {
// const EstimatedIdSelectItem = ({ onClick, buttonTitle }) => {
  const [selected, setSelected] = useState(false);
  const [estimatedIdList, setEstimatedIdList] = useState([]);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      const { data: { content: { items } } } = await usGet(estimatedIdlistEndpoint, { }); // WIP: Check the new endpoint to check if the funtionality is going to be the same
      if(items){
        const newItems = items.map(item =>({ id: item.configId, name: item.configId }));
        setEstimatedIdList(newItems);
      }
    }
    getData()
  },[])
  const onNext = async () => {
    if( !selected )
      return alert('Select an item to continue');
    try{
      const params = { id: selected.id, isCartName: false }
      const { data: { content: { data }, error: { isError } } } = await usGet(estimatedIddetailsEndpoint, { params });
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
      console.log('ERROR', e)
      alert('Error getting the cart')
    }
  }
  return(
    <>
      { estimatedIdList.length > 0 && <SearchList items={estimatedIdList} selected={selected} onChange={onChange} label={label} />}
      <Button disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default EstimatedIdSelectItem;
