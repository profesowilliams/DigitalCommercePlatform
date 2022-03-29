import PropTypes from "prop-types";
import React, { useRef, useState, useCallback } from "react";
import { pushEvent, ANALYTICS_TYPES } from "../../../../utils/dataLayerUtils";
import { isInternalUser } from "../../../../utils/user-utils";
import { If } from "../../helpers/If";
import Capsule from "../Widgets/Capsule";

function SearchFilter({
  styleProps,
  options,
  callback,
  inputType,
  filterCounter,
  onQueryChanged
}) {
  const [values, setValues] = useState({
    dropdown: "",
    input: "",
    option:""
  });
  const [callbackExecuted, setCallbackExecuted] = useState(false)
  const [isDropdownVisible, setSwitchDropdown ] = useState(false);  
  const [isResetVisible, setResetVisible] = useState(true);
  const { dropdown, input, option } = values;
  const node = useRef();
  const inputRef = useRef();
  const initialInputVal = inputRef?.current?.value !== undefined;
  const [isSearchCapsuleVisible, setIsSearchCapsuleVisible] = useState(initialInputVal);
  const initialEditViewVal = option.length !== 0;
  const [isEditView, setIsEditView] = useState(initialEditViewVal);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  
  const clickHandler = () => {
    callback()
    setCallbackExecuted(true)
  };

  function clearValues() {
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        setValues((prevSt) => {
          return {
            ...prevSt,
            [key]: "",
          };
        });
      }
    }
  }
  
  const onReset = () => {
    setCallbackExecuted(false)
    setIsSearchCapsuleVisible(false);
    if (searchTerm.length !== 0 && searchTriggered) {
      setSearchTerm('');
      onQueryChanged();
      setSwitchDropdown(false);
    }
    setSearchTerm('');
    clearValues();
  };

  const changeHandler = (value) => {    
    setValues((prevSt) => ({
        ...prevSt,
        "option": value,
    }));
    setIsEditView(true);
  };

  let styles;
  if (!styleProps) {
    styles = {
      width: "250px",
      tooltipWidth: "280px",
    };
  }
  
  const handleDropdownSwitch = useCallback(() => {
    setSwitchDropdown(!isDropdownVisible)
    if (!isDropdownVisible) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
  }, [isDropdownVisible])

  const handleOutsideClick = e => {        
    const isComingFromSearch = e.target.parentNode.className === 'cmp-renewal-search';
    const isComingFromReset = e.target.parentNode.className === 'cmp-search-options__reset';
    if (node.current && !isComingFromSearch && !isComingFromReset && !node.current.contains(e.target)) {
      setSwitchDropdown(false)
    };
  };

  function handleCapsuleClose() {
    setIsSearchCapsuleVisible(false);
    fetchAll();
  }

  function handleCapsuleTextClick() {
    setIsSearchCapsuleVisible(false);
    setIsEditView(true);
  }
  
  function triggerSearch() {
    if (!searchTriggered) setSearchTriggered(true);
    const { option } = values;
    const inputValue = inputRef.current.value;
    if (!inputValue) return fetchAll();
    const query = {
      queryString: `&${option}=${inputValue}`,
    };
    setIsSearchCapsuleVisible(true);
    setIsEditView(false);
    onQueryChanged(query);
    pushEvent(ANALYTICS_TYPES.events.renewalSearch, null, {
      renewal: {
        searchTerm: inputValue,
        searchType: option,
      },
    });
    setSwitchDropdown(false);
  }

  function fetchAll () {
    onQueryChanged()
    onReset();
    setSwitchDropdown(false);
  }

  const triggerSearchOnEnter = (event) => {
    if(event.keyCode === 13){
      triggerSearch();
    }
  }

  const renderWithPermissions = (option) => {
    const hasNotPrivilege = (option?.showIfInternal === "true") && !isInternalUser;
    if (hasNotPrivilege) return <></>; 
    return (
      <>     
        <label key={option.searchKey} onClick={() => changeHandler(option.searchKey)}>
          {option.searchLabel}
        </label>
      </>
    )
  } 

  function SearchCapsule() {
    return (
      <If condition={isSearchCapsuleVisible}>
        <Capsule
          closeClick={handleCapsuleClose}
          hasCloseBtn={true}
        >
          <span onClick={handleCapsuleTextClick} className="td-capsule__text">
            {`${values.option}: ${inputRef?.current?.value}`}
          </span>
        </Capsule>
      </If>
    );
  }

  if (option.length && isEditView) {
    const chosenFilter = options.find(
      ({searchKey}) => searchKey === option
    ).searchLabel;
    return (
      <>
        <SearchCapsule />
        <div div className="cmp-renewal-search">
          <div className="cmp-search-select-container">
            <div className="cmp-search-select-container__box">
              <input
                className="inputStyle"
                autoFocus
                placeholder={`Enter a ${chosenFilter}`}
                ref={inputRef}
                onKeyDown={triggerSearchOnEnter}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="cmp-search-tooltip__button"
                onClick={() => triggerSearch()}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
            <If condition={isResetVisible}>
              <div className="cmp-search-options" style={{ padding: "5px 10px" }}>
                <div className="cmp-search-options__reset">
                  <label>
                    {callbackExecuted && !filterCounter ? (
                      <p>Sorry, no rows to display</p>
                    ) : (
                      <p>Search by {chosenFilter}</p>
                    )}
                  </label>
                  <a onClick={onReset}>Reset</a>
                </div>
              </div>
            </If>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchCapsule />
      <div className="cmp-renewal-search">
        <If condition={!isDropdownVisible}>
          <div className="cmp-renewal-search" onClick={handleDropdownSwitch}>
            <span className="cmp-renewal-search__text">search</span>
            <i className="fa fa-search cmp-renewal-search__icon"></i>
          </div>
        </If>
        <If condition={isDropdownVisible}>
          <div className="cmp-search-select-container" ref={node}>
            <div className="cmp-search-select-container__box">
              <input className="inputStyle" placeholder="Search by" disabled />
              <button className="cmp-search-tooltip__button">
                <i className="fa fa-search cmp-renewal-search__icon"></i>
              </button>
            </div>
            <If condition={true}>
              <div className="cmp-search-options">
                {options.map((option) => renderWithPermissions(option))}
              </div>
            </If>
          </div>
        </If>
      </div>
    </>
  );
}

export default SearchFilter;
SearchFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      searchLabel: PropTypes.string,
      searchKey: PropTypes.string,
    })
  ).isRequired,
  callback: PropTypes.func.isRequired,
  filterCounter: PropTypes.number,
  inputType: PropTypes.string,
  styleProps: PropTypes.object,
};
