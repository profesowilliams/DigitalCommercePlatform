import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import SearchAreas from './SearchAreas';
import SearchSuggestions from './SearchSuggestions';
import {
  getUserDataInitialState,
  hasDCPAccess,
} from '../../../../utils/user-utils';
import * as DataLayerUtils from '../../../../utils/dataLayerUtils';
import { ADOBE_DATA_LAYER_SEARCH_BAR_EVENT } from '../../../../utils/constants';
import { useStore } from '../../../../utils/useStore';
import { isExtraReloadDisabled } from '../../../../utils/featureFlagUtils';

function getShopLoginUrlPrefix(isLoggedIn) {
  let prefixShopAuthUrl = '';
  if (window.SHOP == undefined) {
    let userIsLoggedIn =
      !isExtraReloadDisabled() && localStorage.getItem('sessionId')
        ? true
        : isLoggedIn;

    if (userIsLoggedIn) {
      let prefixURLEle = document.querySelector('#ssoLoginRedirectUrl');
      if (prefixURLEle) {
        prefixShopAuthUrl =
          document
            .querySelector('#ssoLoginRedirectUrl')
            .getAttribute('data-ssoLoginRedirectUrl') + '?returnUrl=';
      }
    }
  }
  return prefixShopAuthUrl;
}

const getSearchTermFromUrl = () => {
  const searchQueryStringParameter = new URLSearchParams(
    window.location.search
  ).get('kw');

  return searchQueryStringParameter ? searchQueryStringParameter : '';
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

  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [userData, setUserData] = useState(getUserDataInitialState);

  const [searchTermText, setSearchTermText] = useState(getSearchTermFromUrl());
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [originURL, setOriginURL] = useState(null);

  const [width] = useWindowSize();
  const mobileState = width <= 767;
  const removeIconClassMobile = mobileState ? 'cmp-searchbar__remove-icon--mobile' : 'cmp-searchbar__remove-icon';

  const [selectedArea, setSelectedArea] = useState(areaList[0]);
  const [typeAheadSuggestions, setTypeAheadSuggestions] = useState([]);
  const [areaSelectionOpen, setAreaSelectionOpen] = useState(false);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    const timeOutId = setTimeout(() => loadSuggestions(searchTermText), 200);
    return () => clearTimeout(timeOutId);
  }, [searchTermText]);

  useEffect(() => {
    const urlOrigin = window.location.origin;
    setOriginURL(urlOrigin);
    document.addEventListener('click', handleOutsideClick);
  }, []);

  const replaceSearchTerm = (originalStr, searchTerm) => {
    return originalStr.replace('{search-term}', searchTerm);
  };

  const handleOutsideClick = (event) => {
    if (
      ((searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)) ||
        (searchRef.current &&
          searchRef.current.contains(event.target) &&
          isChecked)) &&
      !event.target.classList.contains('cmp-searcharea__button')
    ) {
      setSearchInputFocused(false);
      setChecked(false);
      setFocus(false);
      setAreaSelectionOpen(false);
      setSearchTermText('');
    }
  };

  const loadSuggestions = async (searchTerm) => {
    if (searchTermText.length >= 3) {
      if (['all', 'product', 'content'].includes(selectedArea.area)) {
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
        const dcpDomainEndPoint =
          uiServiceDomain +
          selectedArea.dcpLookupEndpoint.replace('{search-term}', searchTerm);
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
  };

  /**
   * Function that validate the user attributes and get the URL for the end user
   * @param {string} searchTerm
   * @returns
   */
  const getSearchUrl = async (searchTerm) => {
    handlerAnalyticsSearchEvent(searchTerm, selectedArea.area, 0);
    // if the user have DCP Access can search by the DCP domain
    if (
      hasDCPAccess(userData) &&
      (selectedArea.area === 'quote' || selectedArea.area === 'order')
    ) {
      const urlResponse = await getURLToSearchInGrid(searchTerm);
      return urlResponse;
    } else {
      // If not so redirect to shop
      let searchTargetUrl =
        searchDomain + replaceSearchTerm(selectedArea.endpoint, searchTerm);
      if (getShopLoginUrlPrefix(isLoggedIn) !== '') {
        searchTargetUrl = encodeURIComponent(searchTargetUrl);
      }
      return getShopLoginUrlPrefix(isLoggedIn) + searchTargetUrl;
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
      searchTerm: searchTerm,
      searchType: searchType,
      typeAhead: typeAhead,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_SEARCH_BAR_EVENT,
      search,
    };
    DataLayerUtils.pushEventAnalyticsGlobal(objectToSend);
  };

  const getTypeAheadSearchUrl = (searchTerm, itemIndex, refinementId) => {
    let path = replaceSearchTerm(
      selectedArea.areaSuggestionUrl,
      searchTerm
    ).replace('{suggestion-index}', itemIndex + 1);

    if (refinementId) {
      path += `&refinements=${refinementId}`;
    }
    let searchTargetUrl = `${searchDomain}${path}`;
    if (getShopLoginUrlPrefix(isLoggedIn) !== '') {
      // encode only if there is prefix url
      searchTargetUrl = encodeURIComponent(searchTargetUrl);
    }
    return getShopLoginUrlPrefix(isLoggedIn) + searchTargetUrl;
  };

  const onSearchTermTextChange = (e) => {
    const value = e.target.value;

    gotFocus();
    setSearchTermText(value);
  };

  const onSearchTermTextKeyPress = async (e) => {
    if (e.key === 'Enter') {
      redirectToShop();
    } else if (e.key === 'Enter' && searchTermText === '') {
      return null;
    }
  };

  const redirectToShop = async () => {
    if (searchTermText === '') {
      return null;
    } else {
      const response = await getSearchUrl(searchTermText);
      setSearchTermText('');
      window.location.href = response;
    }
  };

  const changeSelectedArea = (areaConfiguration) => {
    setSelectedArea(areaConfiguration);

    setTypeAheadSuggestions([]);
    setAreaSelectionOpen(false);
  };

  const gotFocus = () => {
    if (mobileState) {
      setSearchInputFocused(true);
      setFocus(true);
    } else {
      setFocus(true);
    }
  };

  const lostFocus = () => {
    if (searchTermText.length === 0) {
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
    setSearchInputFocused(true);
  };

  const handleOpenSearchBar = () => {
    setClicked(true);
    if (searchTermText === '') {
      mobileSearchOpener();
    } else {
      if (!mobileState && !isChecked) {
        mobileSearchOpener();
      } else {
        redirectToShop();
      }
    }
  };

  const handleCloseSearchBar = () => {
    clearInputSearch();
    setClicked(false);
    setChecked(false);
    setSearchInputFocused(false);
  };

  const mobileSearchOpener = () => {
    if (mobileState) {
      if (searchInputFocused) {
        lostFocus();
        setChecked(false);
      } else {
        gotFocus();
        setChecked(true);
      }
    } else {
      if (isChecked) {
        lostFocus();
        setChecked(false);
      } else {
        gotFocus();
        setChecked(true);
      }
    }
  };

  const validateSearchTerm = () => {
    return searchTermText && searchTermText?.length > 0 ? true : false;
  };

  const clearInputSearch = () => {
    setSearchTermText('');
  };

  const handlerOpenKeyboard = () => {
    navigator.virtualKeyboard.show();
  }

  const renderSearch = () => {
    return (
      <>
        {mobileState && isChecked && (
          <span
            onClick={handleCloseSearchBar}
            className={
               'cmp-searchbar__button'}>
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.1667 9.5C19.6269 9.5 20 9.1269 20 8.66667C20 8.20643 19.6269 7.83333 19.1667 7.83333L3.00497 7.83333L9.72414 1.78608C10.0662 1.4782 10.094 0.951294 9.78608 0.609203C9.4782 0.267113 8.95129 0.23938 8.60919 0.547262L0.275864 8.04726C0.100269 8.20529 0 8.43043 0 8.66667C0 8.9029 0.100267 9.12804 0.275864 9.28608L8.6092 16.7861C8.95129 17.094 9.4782 17.0662 9.78608 16.7241C10.094 16.382 10.0662 15.8551 9.72414 15.5472L3.00496 9.5L19.1667 9.5Z"
                fill="#005758"
              />
            </svg>
          </span>
        )}
        <div className="input-icon">
          <input
            className={
              isChecked
                ? 'cmp-searchbar__input cmp-searchbar__input--mobile'
                : 'cmp-searchbar__input cmp-search-icon-hidden'
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
            placeholder={!mobileState ? placeholder : ""}
          />
          {validateSearchTerm() && (
            <span
              onClick={clearInputSearch}
              className={"cmp-button__icon cmp-icon-input " + removeIconClassMobile}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM13.5303 6.46967L13.4462 6.39705C13.1852 6.2034 12.827 6.20101 12.5636 6.38988L12.4697 6.46967L10 8.939L7.53033 6.46967L7.44621 6.39705C7.18522 6.2034 6.82701 6.20101 6.56362 6.38988L6.46967 6.46967L6.39705 6.55379C6.2034 6.81478 6.20101 7.17299 6.38988 7.43638L6.46967 7.53033L8.939 10L6.46967 12.4697L6.39705 12.5538C6.2034 12.8148 6.20101 13.173 6.38988 13.4364L6.46967 13.5303L6.55379 13.6029C6.81478 13.7966 7.17299 13.799 7.43638 13.6101L7.53033 13.5303L10 11.061L12.4697 13.5303L12.5538 13.6029C12.8148 13.7966 13.173 13.799 13.4364 13.6101L13.5303 13.5303L13.6029 13.4462C13.7966 13.1852 13.799 12.827 13.6101 12.5636L13.5303 12.4697L11.061 10L13.5303 7.53033L13.6029 7.44621C13.7966 7.18522 13.799 6.82701 13.6101 6.56362L13.5303 6.46967L13.4462 6.39705L13.5303 6.46967Z"
                  fill="#212121"
                />
              </svg>
            </span>
          )}
        </div>

        <button
          className={
            isChecked
              ? 'cmp-searchbar__button cmp-searchbar__button--mobile'
              : 'cmp-searchbar__button'
          }
          ref={searchRef}
          onClick={handleOpenSearchBar}
        >
          <svg
            className={
              !isClicked
                ? 'cmp-searchbar__icon cmp-searchbar__icon--checked'
                : 'cmp-searchbar__icon'
            }
            width="26px"
            height="26px"
            viewBox="0 0 28 28"
            version="1.1"
          >
            <g id="Symbols" fill="none">
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
  };

  const renderContextMenu = () => {
    if (!searchInputFocused) {
      return null;
    }
    return (
      <div className="cmp-searchbar__context-menu">
        {!mobileState && (
          <SearchAreas
            areaList={areaList}
            selectedArea={selectedArea}
            changeSelectedArea={changeSelectedArea}
            toggleSearchIcon={toggleSearchIcon}
            isMobile={mobileState}
          ></SearchAreas>
        )}
        
        <SearchSuggestions
          suggestionsList={typeAheadSuggestions.Suggestions}
          getTypeAheadSearchUrl={getTypeAheadSearchUrl}
          handlerAnalyticEvent={handlerAnalyticsSearchEvent}
          isMobile={mobileState}
        ></SearchSuggestions>
      </div>
    );
  };
  
  const RenderMobileView = (
    <div className={isChecked && "cmp-searchbar__mobile-container--mobile"}>
      <div onClick={handlerOpenKeyboard} className="cmp-searchbar__container">{renderSearch()}</div>
      {renderContextMenu()}
    </div>
  );

  const RenderDesktopView = (
      <div
        id={id}
        ref={searchContainerRef}
        className={`cmp-searchbar ${isChecked && 'cmp-searchbar--checked'}`}
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

  return mobileState ? RenderMobileView : RenderDesktopView;
};

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps, null)(SearchBar);
