import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import SearchAreas from "./SearchAreas";
import SearchSuggestions from "./SearchSuggestions";
import {getUserDataInitialState, hasDCPAccess} from "../../../../utils/user-utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";
import { ADOBE_DATA_LAYER_SEARCH_BAR_EVENT } from "../../../../utils/constants";

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

function useWindowSize() {
  const [size, setSize] = useState([0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const SearchBar = ({ data, componentProp }) => {
  const {
    id,
    areaList,
    placeholder,
    searchDomain,
    uiServiceDomain,
    typeAheadDomain,
    dcpDomain,
  } = JSON.parse(componentProp);
  const [userData, setUserData] = useState(getUserDataInitialState);
  
  const [searchTermText, setSearchTermText] = useState(getSearchTermFromUrl());
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  
  const [isMobile, setMobile] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [originURL, setOriginURL] = useState(null);
  
  const [width] = useWindowSize();
  const mobileState = width <= 767;
  
  const [selectedArea, setSelectedArea] = useState(areaList[0]);
  const [typeAheadSuggestions, setTypeAheadSuggestions] = useState([]);
  const [areaSelectionOpen, setAreaSelectionOpen] = useState(false);
  useEffect(() => {
    const timeOutId = setTimeout(() => loadSuggestions(searchTermText), 200);
    return () => clearTimeout(timeOutId);
  }, [searchTermText]);

  useEffect(() => {
    const urlOrigin = window.location.origin;
    setOriginURL(urlOrigin);
  }, []);

  const replaceSearchTerm = (originalStr, searchTerm) => {
    return originalStr.replace("{search-term}", searchTerm);
  };

  const loadSuggestions = async (searchTerm) => {
    if (searchTermText.length >= 3) {
      if (["all", "product", "content"].includes(selectedArea.area)) {
        const response = await axios.get(
          replaceSearchTerm(typeAheadDomain, searchTerm),
          { withCredentials: false }
        );
        setTypeAheadSuggestions(response.data);
        setAreaSelectionOpen(true);
      }
    } else {
      setTypeAheadSuggestions([]);
      setAreaSelectionOpen(false);
    }
  };

  /**
   * Function that format the URL that will redirect the user to search
   * @param {string} searchTerm 
   * @returns 
   */
  const getURLToSearchInGrid = async (searchTerm) => {
    try {
      // Validate the place where from try to search
      if (dcpDomain && dcpDomain === originURL) {
        const dcpDomainEndPoint = uiServiceDomain + selectedArea.dcpLookupEndpoint.replace('{search-term}', searchTerm);
        const response = await axios.get(dcpDomainEndPoint); //validation
        if (response?.data?.content?.items?.length === 1) {
          const detailsRow = response.data.content.items[0];
          return dcpDomain + `${selectedArea.detailsPage}?id=${detailsRow.id}`; // send to details
        } else {
          return dcpDomain + `${selectedArea.partialEndPoint}?id=${searchTerm}`; // send to partial search
        }
      } else {
          return dcpDomain + `${selectedArea.partialEndPoint}?id=${searchTerm}`; // force send to partial search
      }
    } catch (err) {
      console.error(
          `Error calling UI Serivce Endpoint (${
              uiServiceDomain + selectedArea.dcpLookupEndpoint
          }): ${err}`
      );
      // What should happen if some error happened??? 
      // keep in the page???
      // redirect to shop????
      // return searchDomain + replaceSearchTerm(selectedArea.endpoint, searchTerm);

    }
  }

  /**
   * Function that validate the user attributes and get the URL for the end user
   * @param {string} searchTerm 
   * @returns 
   */
  const getSearchUrl = async (searchTerm) => {
    handlerAnalyticsSearchEvent(searchTerm, selectedArea.area, 0);
    // if the user have DCP Access can search by the DCP domain
    if (hasDCPAccess(userData) && (selectedArea.area === "quote" || selectedArea.area === "order")) {
      const urlResponse = await getURLToSearchInGrid(searchTerm)
      return urlResponse;
    } else { // If not so redirect to shop
      let searchTargetUrl =
          searchDomain + replaceSearchTerm(selectedArea.endpoint, searchTerm);
      if (getShopLoginUrlPrefix() !== "") {
        searchTargetUrl = encodeURIComponent(searchTargetUrl);
      }
      return getShopLoginUrlPrefix() + searchTargetUrl;
    }
  };

  /**
   * handler event that push a search event
   * information to adobeDataLayer
   * @param {string} searchTerm 
   * @param {string} searchType 
   * @param {string} typeAhead 
   */
  const handlerAnalyticsSearchEvent = (
    searchTerm = '',
    searchType = '',
    typeAhead = 0
   ) => {
    const search = {
      searchTerm  : searchTerm,
      searchType  : searchType,
      typeAhead : typeAhead,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_SEARCH_BAR_EVENT,
      search,
    }
    DataLayerUtils.pushEventAnalyticsGlobal(objectToSend);
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
      const response = await getSearchUrl(searchTermText);
      window.location.href = response;
    }
  };

  const changeSelectedArea = (areaConfiguration) => {
    setSelectedArea(areaConfiguration);

    setTypeAheadSuggestions([]);
    setAreaSelectionOpen(false);
  };

  const gotFocus = () => {
    setMobile(true);
    setSearchInputFocused(true);
    setFocus(true);
  };

  const lostFocus = () => {
    if (searchTermText.length === 0) {
      setMobile(false);
      setSearchInputFocused(false);
      setChecked(false);
      setFocus(false);
    }
    setAreaSelectionOpen(false);
  };

  const toggleSearchIcon = () => {
    setClicked(!isClicked);
    setAreaSelectionOpen(!areaSelectionOpen);
  };

  const toggleFocusSearchStyles = () => {
    setFocus(!isFocus);
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

  const renderContextMenu = () => {
    if (!searchInputFocused) {
      return null;
    }
    return (
      <div
        className="cmp-searchbar__context-menu"
      >
        <SearchAreas
          areaList={areaList}
          selectedArea={selectedArea}
          changeSelectedArea={changeSelectedArea}
          toggleSearchIcon={toggleSearchIcon}
        ></SearchAreas>
        <SearchSuggestions
          suggestionsList={typeAheadSuggestions.Suggestions}
          getTypeAheadSearchUrl={getTypeAheadSearchUrl}
          handlerAnalyticEvent={handlerAnalyticsSearchEvent}
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
            aria-expanded={areaSelectionOpen}
            onChange={onSearchTermTextChange}
            onKeyPress={onSearchTermTextKeyPress}
            onFocus={toggleFocusSearchStyles}
            value={searchTermText}
            placeholder={placeholder}
          />
          <button
            className={
              isMobile
                ? "cmp-searchbar__button cmp-searchbar__button--mobile"
                : "cmp-searchbar__button"
            }
            onClick={searchTermText === '' ? mobileSearchOpener : redirectToShop}
          >
            <svg
              className={
                isClicked
                  ? "cmp-searchbar__icon cmp-searchbar__icon--checked"
                  : "cmp-searchbar__icon"
              }
              width="26px"
              height="26px"
              viewBox="0 0 28 28"
              version="1.1"
            >
              <g id="Symbols"fill="none">
                <g id="Icon---Search">
                  <g id="Group-5" transform="translate(1.000000, 1.000000)">
                    <path
                      d="M10.0000394,0 C15.5228817,0 20.0000789,4.53561095 20.0000789,10.1309296 C20.0000789,15.7259892 15.5228817,20.2616001 10.0000394,20.2616001 C4.47719715,20.2616001 0,15.7259892 0,10.1309296 C0,4.53561095 4.47719715,0 10.0000394,0 Z"
                      id="Stroke-1"
                    ></path>
                    <line
                      x1="18.9999724"
                      y1="18.9096442"
                      x2="26"
                      y2="26"
                      id="Stroke-3"
                    ></line>
                  </g>
                </g>
              </g>
            </svg>
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
            aria-expanded={areaSelectionOpen}
            onChange={onSearchTermTextChange}
            onKeyPress={onSearchTermTextKeyPress}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={searchTermText}
            placeholder={placeholder}
          />
          <button
            className={
              isFocus
                ? "cmp-searchbar__button cmp-searchbar__button--checked"
                : "cmp-searchbar__button"
            }
            onClick={redirectToShop}
          >
            <svg
              className={
                isFocus
                  ? "cmp-searchbar__icon cmp-searchbar__icon--checked"
                  : "cmp-searchbar__icon"
              }
              width="26px"
              height="26px"
              viewBox="0 0 28 28"
              version="1.1"
            >
              <g id="Symbols"  fill="none">
                <g id="Icon---Search" >
                  <g id="Group-5" transform="translate(1.000000, 1.000000)">
                    <path
                      d="M10.0000394,0 C15.5228817,0 20.0000789,4.53561095 20.0000789,10.1309296 C20.0000789,15.7259892 15.5228817,20.2616001 10.0000394,20.2616001 C4.47719715,20.2616001 0,15.7259892 0,10.1309296 C0,4.53561095 4.47719715,0 10.0000394,0 Z"
                      id="Stroke-1"
                    ></path>
                    <line
                      x1="18.9999724"
                      y1="18.9096442"
                      x2="26"
                      y2="26"
                      id="Stroke-3"
                    ></line>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </>
      );
    }
  };
  return (
    <div
      onMouseEnter={mobileState ? null : gotFocus}
      onMouseLeave={lostFocus}
      id={id}
      className={`cmp-searchbar ${ isChecked === true ? "cmp-searchbar--checked" : " " }`}>
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
