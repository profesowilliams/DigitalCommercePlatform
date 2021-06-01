import React, { useEffect, useState } from 'react';
import TextInput from './TextInput';
import WidgetList from './WidgetList';

const SearchList = ({items, selected, onChange, label}) => {
  const [search, setSearch] = useState('');
  const [openlist, setOpenlist] = useState(true);
  const [filtered, setFiltered] = useState(items)
  const searchUpdate = (event) => {
    setSearch(event.target.value);
  }
  useEffect(() => {
    //update list of elements
    if( search !== '' ){
      const newFiltered = items.filter((item) => item.name.toLowerCase().indexOf(search.toLowerCase()) >= 0)
      setFiltered(newFiltered);
    }else{
      setFiltered(items)
    }
  },[search])
  const resetOnChange = (el) => {
    setSearch('');
    setOpenlist(false);
    onChange(el);
  }
  const onFocus = () => {
    setOpenlist(true);
  }
  return(
    <div className="cmp-widget__search-list">
      <p>
        <TextInput bottomSpace onFocus={onFocus} label={label} inputValue={ selected&&!openlist ? selected.name : search } onChange={searchUpdate} />
      </p>
      <WidgetList openlist={openlist} items={filtered} selected={selected} onChange={resetOnChange} />
    </div>
  )
};

export default SearchList;
