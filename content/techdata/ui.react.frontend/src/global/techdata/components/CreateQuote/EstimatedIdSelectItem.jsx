  import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';

const EstimatedIdSelectItem = ({ onClick, buttonTitle, estimatedIdListEndpoint, estimatedIddetailsEndpoint, label, buttonLabel }) => {
// const EstimatedIdSelectItem = ({ onClick, buttonTitle }) => {
  const [selected, setSelected] = useState(false);
  const [estimatedIdList, setEstimatedIdList] = useState([]);
  const [estimatedIdListError, setEstimatedIdListError] = useState(false);
  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      const { data: { content: { items } } } = await usGet(estimatedIdListEndpoint, { });
      if(items && items.length > 0){
        const newItems = items.map(item =>({ id: item.configId, name: item.configId, vendor: item.vendor }));
        setEstimatedIdList(newItems);
        setEstimatedIdListError(false)
      }else{
        setEstimatedIdListError(true)
      }
    }
    try{
      getData()
    }catch{
      setEstimatedIdListError(true)
    }
  },[])
  const onNext = async () => {
    if( !selected )
      return alert('Select an item to continue');
    try{
      const newEndpoint = estimatedIddetailsEndpoint.replace('{selected-id}', selected.id);
      const { data: { content: { isValid }, error: { isError } } } = await usGet(newEndpoint, { });
      if( isError ) return alert('Error');
      if( isValid ){
        onClick(selected.id, {
          redirectToPreview:true,
          configurationItem: {
            ...selected
          }
        });
      }else{
        alert('Invalid estimated ID')
      }
    }catch(e){
      alert('Error getting the cart')
    }
  }
  return(
    <>
      { estimatedIdList.length > 0 && <SearchList items={estimatedIdList} selected={selected} onChange={onChange} label={label} buttonLabel={buttonLabel} />}
      { estimatedIdList.length === 0 && estimatedIdListError &&
        <p className="cmp-error-message cmp-error-message__red">No Estimated ID's available </p>
      }
      <Button btnClass="cmp-quote-button" disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default EstimatedIdSelectItem;
