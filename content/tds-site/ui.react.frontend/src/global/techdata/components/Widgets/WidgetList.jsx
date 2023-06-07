import React, { useEffect, useState, useRef } from 'react';
import { usGet } from '../../../../utils/api';
import Button from './Button';
import Loader from './Loader';

const WidgetList = ({ items, onChange, openlist, buttonLabel, estimatedIdListEndpoint }) => {
  const [localSelected, setLocalSelected] = useState(false);
  const [listData, setListData] = useState(items);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [estimatedIdList, setEstimatedIdList] = useState([]);
  const [estimatedIdListError, setEstimatedIdListError] = useState(false);
  const listRef = useRef([]);
  const pageNumber = useRef(2);
  const onSelect = (item) => {
    setLocalSelected(item);
  }
  useEffect(() => {
    listRef.current = [...items];    
    document.getElementById('cmp-widget-list').addEventListener('scroll', onScroll, false);

  },[])
  const confirm = () =>{
    onChange(localSelected);
  }
  const onScroll = async (e) => {
    var scrollTop = document.getElementById('cmp-widget-list').scrollTop;
    var clientHeight = document.getElementById('cmp-widget-list').clientHeight;
    var scrollHeight = document.getElementById('cmp-widget-list').scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight && items.length) {
      updateListData();
    }
  }
  const updateListData = async () => {
    setIsLoadingItems(true);
    const { data: { content: { items } } } = await usGet(`${estimatedIdListEndpoint}&PageNumber=${pageNumber.current++}`, { });
    if(items && items.length > 0){
      const newItems = items.map(item =>({ id: item.configId, name: item.configId, vendor: item.vendor }));
      setEstimatedIdList(newItems);
      setEstimatedIdListError(false)
      listRef.current = [...listRef.current, ...newItems];
      setListData(listRef.current);      
    }else{
      setEstimatedIdListError(true)
    }
    setIsLoadingItems(false);
  }
  return(
    <div className={`cmp-widget-list__list-wrapper ${ openlist ? 'cmp-widget-list__list-wrapper--open' : '' }`}>
      <Loader visible={isLoadingItems} />
      { estimatedIdList.length === 0 && estimatedIdListError &&
        <p className="cmp-error-message cmp-error-message__red">No Estimated ID's available </p>
      }

      <ul id="cmp-widget-list" className="cmp-widget-list__list-wrapper-content">
        {listData.map((item) => {
          return <li key={Symbol(item.id).toString()}>
            <a className={localSelected.id === item.id ? 'cmp-widget-list__list-item--active':''} onClick={() => onSelect(item)}>
              <i className="fas fa-check"></i> {item.name}
            </a>
          </li>
        })}
      </ul>
      <Button btnClass="cmp-quote-button" disabled={!localSelected} onClick={confirm}>{buttonLabel}</Button>
    </div>
  );
};

export default WidgetList;
