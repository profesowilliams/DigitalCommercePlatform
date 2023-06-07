  import React, { useEffect, useState } from 'react';
import SearchList from '../Widgets/SearchList';
import Button from '../Widgets/Button';
import { usGet } from '../../../../utils/api';
import Loader from '../Widgets/Loader';
import { isNotEmptyValue } from '../../../../utils/utils';
import {
  ERROR_CREATE_QUOTE_ERROR_GETTING_CART,
  ERROR_CREATE_QUOTE_INVALID_ESTIMATE_ID,
  ERROR_CREATE_QUOTE_SELECT_ITEMS_TO_CONTINUE,
  ERROR_TITLE_DEFAULT
} from '../../../../utils/constants';

const EstimatedIdSelectItem = ({
  onClick,
  buttonTitle,
  estimatedIdListEndpoint,
  estimatedIddetailsEndpoint,
  label,
  buttonLabel,
  modalEventError,
  errorMessage,
}) => {
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
      return modalEventError(isNotEmptyValue(errorMessage.selectItemToContinue) ? errorMessage.selectItemToContinue :  ERROR_CREATE_QUOTE_SELECT_ITEMS_TO_CONTINUE);
    try{
      const newEndpoint = estimatedIddetailsEndpoint.replace('{selected-id}', selected.id);
      setIsLoading(true);
      const { data: { content: { isValid }, error: { isError } } } = await usGet(newEndpoint, {}).catch((error) => {
        if (error) {
          setIsLoading(false);
        }
      });
      setIsLoading(false);
      if (isError) return modalEventError(isNotEmptyValue(errorMessage.errorModalTitle) ? errorMessage.errorModalTitle : ERROR_TITLE_DEFAULT);
      if( isValid ){
        onClick(selected.id, {
          redirectToPreview:true,
          configurationItem: {
            ...selected
          }
        });
      }else{
        modalEventError(isNotEmptyValue(errorMessage.invalidEstimatedId) ? errorMessage.invalidEstimatedId : ERROR_CREATE_QUOTE_INVALID_ESTIMATE_ID);
      }
    }catch(e){
      modalEventError(isNotEmptyValue(errorMessage.errorGettingCart) ? errorMessage.errorGettingCart : ERROR_CREATE_QUOTE_ERROR_GETTING_CART);
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
