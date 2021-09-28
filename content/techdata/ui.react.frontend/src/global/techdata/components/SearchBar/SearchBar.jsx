import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";

import SearchAreas from "./SearchAreas";
import SearchSuggestions from "./SearchSuggestions";

function getShopLoginUrlPrefix() {
  let prefixShopAuthUrl = "";
  if (window.SHOP == undefined) {
    let sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      let prefixURLEle = document.querySelector("#ssoLoginRedirectUrl");
      if (prefixURLEle) {
        prefixShopAuthUrl =
          document
            .querySelector("#ssoLoginRedirectUrl")
            .getAttribute("data-ssoLoginRedirectUrl") + "?returnUrl=";
      }
    }
  }
  return prefixShopAuthUrl;
}

const getSearchTermFromUrl = () => {
  const searchQueryStringParameter = new URLSearchParams(
    window.location.search
  ).get("kw");

  return searchQueryStringParameter ? searchQueryStringParameter : "";
};

const SearchBar = ({ data, componentProp }) => {
  const {
    id,
    areaList,
    placeholder,
    searchDomain,
    uiServiceDomain,
    typeAheadDomain,
  } = JSON.parse(componentProp);

  const [searchTermText, setSearchTermText] = useState(getSearchTermFromUrl());
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const [isMobile, setMobile] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const [selectedArea, setSelectedArea] = useState(areaList[0]);
  const [typeAheadSuggestions, setTypeAheadSuggestions] = useState([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => loadSuggestions(searchTermText), 200);
    return () => clearTimeout(timeOutId);
  }, [searchTermText]);

  const replaceSearchTerm = (originalStr, searchTerm) => {
    return originalStr.replace("{search-term}", searchTerm);
  };

  const loadSuggestions = async (searchTerm) => {
    if (searchTermText.length >= 3) {
      if (["all", "product", "content"].includes(selectedArea.area)) {
        const response = await axios.get(
          replaceSearchTerm(typeAheadDomain, searchTerm)
        );
        setTypeAheadSuggestions(response.data);
      }
    } else {
      setTypeAheadSuggestions([]);
    }
  };

  const getSearchUrl = async (searchTerm) => {
    if (selectedArea.area === "quote" || selectedArea.area === "order") {
      try {
        const response = await axios.get(
          uiServiceDomain + selectedArea.dcpLookupEndpoint
        );
        const idFound = response.data.content.items.find(
          (order) => order.id == searchTerm
        );
        if (idFound) {
          return (
            window.location.origin +
            `${selectedArea.detailsPage}?id=${searchTerm}`
          );
        }
        return window.location.origin + selectedArea.dcpSearchPage;
      } catch (err) {
        console.log(
          `Error calling UI Serivce Endpoint (${
            uiServiceDomain + selectedArea.dcpQuotesLookupEndpoint
          }): ${err}`
        );
      }
    }

    let searchTargetUrl =
      searchDomain + replaceSearchTerm(selectedArea.endpoint, searchTerm);
    if (getShopLoginUrlPrefix() !== "") {
      searchTargetUrl = encodeURIComponent(searchTargetUrl);
    }
    return getShopLoginUrlPrefix() + searchTargetUrl;
  };

  const getTypeAheadSearchUrl = (searchTerm, itemIndex, refinementId) => {
    let path = replaceSearchTerm(
      selectedArea.areaSuggestionUrl,
      searchTerm
    ).replace("{suggestion-index}", itemIndex + 1);

    if (refinementId) {
      path += `&refinements=${refinementId}`;
    }
    let searchTargetUrl = `${searchDomain}${path}`;
    if (getShopLoginUrlPrefix() !== "") {
      // encode only if there is prefix url
      searchTargetUrl = encodeURIComponent(searchTargetUrl);
    }
    return getShopLoginUrlPrefix() + searchTargetUrl;
  };

  const onSearchTermTextChange = (e) => {
    const value = e.target.value;

    gotFocus();
    setSearchTermText(value);
  };

  const onSearchTermTextKeyPress = async (e) => {
    if (e.key === "Enter") {
      redirectToShop();
    } else if (e.key === "Enter" && searchTermText === "") {
      return null;
    }
  };

  const redirectToShop = async () => {
    if (searchTermText === "") {
      return null;
    } else {
      window.location.href = await getSearchUrl(searchTermText);
    }
  };

  const mobileState = window.innerWidth <= 767;

  const changeSelectedArea = (areaConfiguration) => {
    setSelectedArea(areaConfiguration);

    setTypeAheadSuggestions([]);
  };

  const gotFocus = () => {
    setMobile(true);
    setSearchInputFocused(true);
  };

  const lostFocus = () => {
    setMobile(false);
    setSearchInputFocused(false);
    setChecked(false);
  };

  const toggleSearchIcon = () => {
    setClicked(!isClicked);
  };

  const mobileSearchOpener = () => {
    if (mobileState) {
      if (searchInputFocused === false) {
        gotFocus();
        setChecked(true);
      } else {
        lostFocus();
        setChecked(false);
      }
    }
  };

  console.log("useState checked", isChecked);

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
          toggleSearchIcon={toggleSearchIcon}
        ></SearchAreas>
        <SearchSuggestions
          suggestionsList={typeAheadSuggestions.Suggestions}
          getTypeAheadSearchUrl={getTypeAheadSearchUrl}
        ></SearchSuggestions>
      </div>
    );
  };

  const renderSearch = () => {
    if (mobileState) {
      return (
        <>
          <input
            className={
              isMobile
                ? "cmp-searchbar__input cmp-searchbar__input--mobile"
                : "cmp-searchbar__input"
            }
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
          <button
            className={
              isMobile
                ? "cmp-searchbar__button cmp-searchbar__button--mobile"
                : "cmp-searchbar__button"
            }
            onClick={mobileSearchOpener}
          >
            <i
              className="cmp-searchbar__icon fas fa-search"
              data-cmp-hook-search="icon"
            ></i>
          </button>
        </>
      );
    } else {
      return (
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
          <button
            className={
              isClicked
                ? "cmp-searchbar__button cmp-searchbar__button--checked"
                : "cmp-searchbar__button"
            }
            onClick={redirectToShop}
          >
            <i
              className={
                isClicked
                  ? "cmp-searchbar__icon cmp-searchbar__icon--checked fas fa-search"
                  : "cmp-searchbar__icon fas fa-search"
              }
              data-cmp-hook-search="icon"
            ></i>
          </button>
        </>
      );
    }
  };
  return (
    <div
      id={id}
      className={`cmp-searchbar ${isChecked === true ? "cmp-searchbar--checked" : " "}`}
      onMouseLeave={lostFocus}
      onMouseEnter={gotFocus}
    >
      <button className="cmp-searchbar__clear" data-cmp-hook-search="clear">
        <i className="cmp-searchbar__clear-icon"></i>
      </button>
      <div className="cmp-searchbar__container">{renderSearch()}</div>
      {renderContextMenu()}
      <span
        className="cmp-searchbar__loading-indicator"
        data-cmp-hook-search="loadingIndicator"
      ></span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps, null)(SearchBar);
