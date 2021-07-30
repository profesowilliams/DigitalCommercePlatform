import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchAreas from "./SearchAreas";
import SearchSuggestions from "./SearchSuggestions";

const SearchBar = ({ componentProp }) => {
  let { id, areaList, placeholder, searchDomain, typeAheadDomain } =
    JSON.parse(componentProp);

  const [searchTermText, setSearchTermText] = useState("");
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const [isMobile, setMobile] = useState(false);

  const [selectedArea, setSelectedArea] = useState(areaList[0]);
  const [typeAheadSuggestions, setTypeAheadSuggestions] = useState([]);

  useEffect(() => {
    const timeOutId = setTimeout(() => loadSuggestions(searchTermText), 200);

    return () => clearTimeout(timeOutId);
  }, [searchTermText]);

  const loadSuggestions = async (searchTerm) => {
    if (searchTermText.length >= 3) {
      if (["all", "product", "content"].includes(selectedArea.area)) {
        const response = await axios.get(
          typeAheadDomain.replace("{search-term}", searchTerm)
        );

        setTypeAheadSuggestions(response.data);
      }
    } else {
      setTypeAheadSuggestions([]);
    }
  };

  const getSearchUrl = (searchTerm) => {
    const path = selectedArea.endpoint.replace("{search-term}", searchTerm);

    return `${searchDomain}${path}`;
  };

  const getTypeAheadSearchUrl = (searchTerm, itemIndex, refinementId) => {
    let path = selectedArea.areaSuggestionUrl
      .replace("{search-term}", searchTerm)
      .replace("{suggestion-index}", itemIndex + 1);

    if (refinementId) {
      path += `&refinements=${refinementId}`;
    }

    return `${searchDomain}${path}`;
  };

  const onSearchTermTextChange = (e) => {
    const value = e.target.value;

    gotFocus();
    setSearchTermText(value);
  };

  const onSearchTermTextKeyPress = (e) => {
    if (e.key === "Enter") {
      redirectToShop();
    }
  };

  const redirectToShop = () => {
    window.location.href = getSearchUrl(searchTermText);
  };

  const mobileState = window.innerWidth <= 767

  const mobileSearchOpener = () => {
    if (mobileState) {
      setMobile(!isMobile);
      setSearchInputFocused(!searchInputFocused)
    }
  };

  const changeSelectedArea = (areaConfiguration) => {
    setSelectedArea(areaConfiguration);

    setTypeAheadSuggestions([]);
  };

  const gotFocus = () => {
    setSearchInputFocused(true);
  };
  const lostFocus = () => {
    setSearchInputFocused(false);
  };

  const renderContextMenu = () => {
    if (!searchInputFocused) {
      return null;
    }
    return (
      <div className="cmp-searchbar__context-menu">
        <SearchAreas
          areaList={areaList}
          selectedArea={selectedArea}
          changeSelectedArea={changeSelectedArea}
        ></SearchAreas>
        <SearchSuggestions
          suggestionsList={typeAheadSuggestions.Suggestions}
          getTypeAheadSearchUrl={getTypeAheadSearchUrl}
        ></SearchSuggestions>
      </div>
    );
  };

  const renderSearch = () => {
    if(mobileState) {
      return (
        <>
        <input
          className={!isMobile ? "cmp-searchbar__input" 
                               : "cmp-searchbar__input cmp-searchbar__input--mobile"}
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
          placeholder={placeholder}
        />
        <button className={!isMobile ? "cmp-searchbar__button" : "cmp-searchbar__button cmp-searchbar__button--mobile"}
                onClick={mobileSearchOpener}>
          <i className="cmp-searchbar__icon fas fa-search" data-cmp-hook-search="icon"></i>
        </button>
      </>
      )
    } else {
      return(
      <>
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
          placeholder={placeholder}
        />
        <button className="cmp-searchbar__button" onClick={redirectToShop}>
          <i
            className="cmp-searchbar__icon fas fa-search"
            data-cmp-hook-search="icon"
          ></i>
        </button>
      </>
      )
    }
  }

  return (
    <div
      id={id}
      className="cmp-searchbar"
      onMouseLeave={lostFocus}
      onMouseEnter={gotFocus}
    >
      <button className="cmp-searchbar__clear" data-cmp-hook-search="clear">
        <i className="cmp-searchbar__clear-icon"></i>
      </button>
      <div className="cmp-searchbar__container">
        {renderSearch()}
      </div>
        {renderContextMenu()}
      <span
        className="cmp-searchbar__loading-indicator"
        data-cmp-hook-search="loadingIndicator"
      ></span>
    </div>
  );
};
export default SearchBar;
