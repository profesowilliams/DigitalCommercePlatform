import React, { useState } from 'react';
import axios from 'axios';

import SearchAreas from './SearchAreas'
import SearchSuggestions from './SearchSuggestions'

const SearchBar = ({ componentProp }) => {
  let { id, areaList, placeholder, searchDomain, typeAheadDomain } = JSON.parse(componentProp);

  const [searchTermText, setSearchTermText] = useState('');
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const [selectedArea, setSelectedArea] = useState(areaList[0]);
  const [typeAheadSuggestions, setTypeAheadSuggestions] = useState([]);

  const loadSuggestions = async (searchTerm) => {
    //const response = await axios.get(`http://typeahead.techdata.com/kw2?keyword=${searchTerm}&searchApplication=shop`);
    const response = await axios.get(`http://localhost:3000/typeahead?keyword=${searchTerm}&searchApplication=shop`);

    setTypeAheadSuggestions(response.data)
  }

  const getSearchUrl = (searchTerm) => {
    const path = selectedArea.endpoint.replace('{search-term}', searchTerm);

    return `${searchDomain}${path}`;
  }

  const getTypeAheadSearchUrl = (searchTerm, itemIndex, refinementId) => {
    let path = '/searchall?kw={search-term}&pks=1&pksi={suggestion-index}'
                    .replace('{search-term}', searchTerm)
                    .replace('{suggestion-index}', itemIndex + 1);
    if (refinementId) {
      path += `&refinements=${refinementId}`;
    }

    return `${searchDomain}${path}`;
  }

  const onSearchTermTextChange = (e) => {
    const value = e.target.value;

    gotFocus();
    setSearchTermText(value);

    if(value.length >= 3) {
      loadSuggestions(value);
    }
  }

  const onSearchTermTextKeyPress = (e) => {
    if (e.key === 'Enter') {
      redirectToShop();
    }
  }

  const redirectToShop = () => {
    window.location.href = getSearchUrl(searchTermText);
  }

  const changeSelectedArea = (areaConfiguration) => {
    setSelectedArea(areaConfiguration);
  }

  const gotFocus = () => {
    setSearchInputFocused(true);
  }
  const lostFocus = () => {
    setSearchInputFocused(false);
  }

  const renderContextMenu = () => {
    if (!searchInputFocused) {
      return null;
    }
    return (
      <div className="cmp-searchbar__context-menu">
        <SearchAreas areaList={areaList} selectedArea={selectedArea} changeSelectedArea={changeSelectedArea}></SearchAreas>
        <SearchSuggestions suggestionsList={typeAheadSuggestions.Suggestions} getTypeAheadSearchUrl={getTypeAheadSearchUrl}></SearchSuggestions>
      </div>
    );
  }

  return(
    <div
      id={id}
      className="cmp-searchbar"
      onMouseLeave={lostFocus}
      onMouseEnter={gotFocus}>
      <button className="cmp-searchbar__clear" data-cmp-hook-search="clear">
        <i className="cmp-searchbar__clear-icon"></i>
      </button>
      <input
        className="cmp-searchbar__input"
        data-cmp-hook-search="input"
        type="text"
        name="fulltext"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="true"
        aria-invalid="false"
        onChange={onSearchTermTextChange}
        onKeyPress={onSearchTermTextKeyPress}
        onFocus={gotFocus}
        value={searchTermText}
        placeholder={placeholder}/>
      <button
        className="cmp-searchbar__button"
        onClick={redirectToShop}>
        <i
          className="cmp-searchbar__icon fas fa-search"
          data-cmp-hook-search="icon"></i>
      </button>

      {renderContextMenu()}

      <span className="cmp-searchbar__loading-indicator" data-cmp-hook-search="loadingIndicator"></span>
    </div>
  )
}
export default SearchBar;
