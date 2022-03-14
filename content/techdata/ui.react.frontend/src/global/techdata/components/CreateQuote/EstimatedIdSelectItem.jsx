  import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import Loader from '../Widgets/Loader';

const EstimatedIdSelectItem = ({ onClick, buttonTitle, estimatedIdListEndpoint, estimatedIddetailsEndpoint, label, buttonLabel }) => {
// const EstimatedIdSelectItem = ({ onClick, buttonTitle }) => {
  const [selected, setSelected] = useState(false);
  const [estimatedIdList, setEstimatedIdList] = useState([]);
  const [estimatedIdListError, setEstimatedIdListError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (el) => {
    setSelected(el);
  }
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const { data: { content: { items } } } = await usGet(`${estimatedIdListEndpoint}&PageNumber=1`, {}).catch((error) => {
        if (error) {
          setIsLoading(false);
        }
      });
      setIsLoading(false);
      if (items && items.length > 0) {
        const newItems = items.map(item =>({ id: item.configId, name: item.configId, vendor: item.vendor, configurationType: item.configurationType }));
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
      setIsLoading(true);
      const { data: { content: { isValid }, error: { isError } } } = await usGet(newEndpoint, {}).catch((error) => {
        if (error) {
          setIsLoading(false);
        }
      });
      setIsLoading(false);
      if (isError) return alert('Error');
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
      { estimatedIdList.length > 0 && <SearchList items={estimatedIdList} selected={selected} onChange={onChange} label={label} buttonLabel={buttonLabel} estimatedIdListEndpoint={estimatedIdListEndpoint}/>}
      { isLoading && <Loader visible={true}/> }
      {estimatedIdList.length === 0 && estimatedIdListError &&
        <p className="cmp-error-message cmp-error-message__red">No Estimated ID's available </p>
      }
      <Button btnClass="cmp-quote-button" disabled={!selected} onClick={onNext}>{buttonTitle}</Button>
    </>
  );
};

export default EstimatedIdSelectItem;
