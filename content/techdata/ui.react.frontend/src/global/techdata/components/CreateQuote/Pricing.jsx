import React, { useEffect, useState } from 'react';
import Dropdown from '../Widgets/Dropdown';
import Button from '../Widgets/Button';
import { get } from '../../../../utils/api';
import WidgetTitle from '../Widgets/WidgetTitle';

const Pricing = ({createQuote, buttonTitle, method, setMethod, pricingConditions, prev}) => {
  const [items, setItems] = useState([])
  useEffect(() =>{
    const getData = async () => {
      const {data: { content: { pricingConditions: { items } }, error: { isError } }} = await get(pricingConditions);
      if( isError ) alert('Error in pricing conditions');
      if( items ){
        const newItems = items.map(item => ({label: item.key, key: item.value}) );
        setItems(newItems);
      }
    }
    getData();
  },[])
  return (
    <>
      <WidgetTitle>
        <a onClick={prev}><i className="fas fa-chevron-left"></i> Create quote from</a>
      </WidgetTitle>
      <Dropdown selected={method} setValue={setMethod} options={items} label="Select pricing" />
      <Button disabled={false} onClick={createQuote}>{buttonTitle}</Button>
    </>
  )
}

export default Pricing