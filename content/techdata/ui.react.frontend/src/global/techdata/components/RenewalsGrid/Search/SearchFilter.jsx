import PropTypes from "prop-types";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ArrowClockWiseIcon, SearchIcon } from "../../../../../fluentIcons/FluentIcons";
import { SEARCH_LOCAL_STORAGE_KEY, TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { ANALYTICS_TYPES, pushEvent } from "../../../../../utils/dataLayerUtils";
import { isHouseAccount } from "../../../../../utils/user-utils";
import { If } from "../../../helpers/If";
import useIsTDSynnexClass from "../../RenewalFilter/components/useIsTDSynnexClass";
import Capsule from "../../Widgets/Capsule";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage, setLocalStorageData } from "../renewalUtils";
import { useRenewalGridState } from "../store/RenewalsStore";
import { SearchField } from "./SearchField";

export const CloseIconWeighted = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M6.35 20.025 4 17.65 9.625 12 4 6.35l2.35-2.4L12 9.6l5.65-5.65L20 6.35 14.375 12 20 17.65l-2.35 2.375-5.65-5.65Z" />
  </svg>
);

function _SearchFilter(
  { styleProps, options, callback, inputType, filterCounter, onQueryChanged },
  ref
) {
  const customSearchValues = {
    dropdown: "",
    input: "",
    option: getInitialFieldState(),
    label: getInitialLabelState()
  }
  const [values, setValues] = useState({...customSearchValues}); /** TODO: Get rid of states and move to Zustand for less boilerplate. */
  const [callbackExecuted, setCallbackExecuted] = useState(false);
  const [isDropdownVisible, setSwitchDropdown] = useState(false);
  const [isResetVisible, setResetVisible] = useState(true);
  const { dropdown, input, option } = values;
  const node = useRef();
  const inputRef = useRef();
  const _initialInputVal = inputRef?.current?.value !== undefined;
  const [isSearchCapsuleVisible, setIsSearchCapsuleVisible] =
    useState(hasPreviousSearchTerm());
  const _initialEditViewVal = option.length !== 0;
  const [isEditView, setIsEditView] = useState(false);
  const [searchTerm, setSearchTerm] = useState(getInitialValueState());
  const [capsuleSearchValue, setCapsuleSearchValue] = useState(getInitialValueState());
  const [searchTriggered, setSearchTriggered] = useState(false);
  const effects = useRenewalGridState((state) => state.effects);
  const { computeClassName, isTDSynnex } = useIsTDSynnexClass();
  const { closeAndCleanToaster } = effects;  
  const [inputValueState, setInputValueState] = useState(getInitialValueState());
  const [capsuleValues, setCapsuleValues] = useState({...customSearchValues});

  function getInitialValueState() {
    if (hasLocalStorageData(SEARCH_LOCAL_STORAGE_KEY) && isFromRenewalDetailsPage()) {
      return getLocalStorageData(SEARCH_LOCAL_STORAGE_KEY)?.value;
    } else {
      return "";
    }
  }

  function getInitialFieldState() {
    if (hasLocalStorageData(SEARCH_LOCAL_STORAGE_KEY) && isFromRenewalDetailsPage()) {
      return getLocalStorageData(SEARCH_LOCAL_STORAGE_KEY)?.field;
    } else {
      return "";
    }
  }

  function getInitialLabelState() {
    if (!hasLocalStorageData(SEARCH_LOCAL_STORAGE_KEY)) {
      return "";
    }

    if (isFromRenewalDetailsPage())
      return options.filter(item => item.searchKey === getInitialFieldState())[0]?.searchLabel || "";

    return "";
  }

  function hasPreviousSearchTerm() {
    if (!hasLocalStorageData(SEARCH_LOCAL_STORAGE_KEY)) {
      return false;
    }

    if (isFromRenewalDetailsPage())
      return getLocalStorageData(SEARCH_LOCAL_STORAGE_KEY)?.value !== '';

    return false;
  }

  useImperativeHandle(
    ref,
    () => ({ field: values.option, value: inputValueState }),
    [values, inputValueState]
  );

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
    setCapsuleValues(false)
  }

  const onReset = () => {
    setCallbackExecuted(false);
    setIsSearchCapsuleVisible(false);
    if (searchTriggered) {
      onQueryChanged({onSearchAction:true});  
      setSwitchDropdown(!searchTerm.length);
    }
    setSearchTerm("");
    setCapsuleSearchValue("");
    clearValues();
    setLocalStorageData(SEARCH_LOCAL_STORAGE_KEY, {
      field: '',
      value: '',
    });
  };

  const changeHandler = (option) => {
    setValues((prevSt) => ({
      ...prevSt,
      option: option.searchKey,
      label: option.searchLabel,
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
    closeAndCleanToaster();
    if (isSearchCapsuleVisible) {
      handleCapsuleTextClick();
    }
    setSwitchDropdown(!isDropdownVisible);
    if (!isDropdownVisible) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
  }, [isDropdownVisible]);

  const handleOutsideClick = (e) => {
    const isComingFromSearch =
      e.target.parentNode.className === "cmp-renewal-search";
    const isComingFromReset =
      e.target.parentNode.className === "cmp-search-options__reset";
    if (
      node.current &&
      !isComingFromSearch &&
      !isComingFromReset &&
      !node.current.contains(e.target)
    ) {
      setSwitchDropdown(false);
    }
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
    setSearchTerm(inputValue);
    setCapsuleSearchValue(inputValue);
    setIsEditView(false);
    setInputValueState(inputValue);
    setLocalStorageData(SEARCH_LOCAL_STORAGE_KEY, {
      field: option,
      value: inputValue,
    });
    onQueryChanged({onSearchAction:true});
    pushEvent(ANALYTICS_TYPES.events.renewalSearch, null, {
      renewal: {
        searchTerm: inputValue,
        searchType: option,
      },
    });
    setSwitchDropdown(false);
    setCapsuleValues({...values});
  }

  function fetchAll() {
    onQueryChanged({onSearchAction:true});
    onReset();
    setSwitchDropdown(false);
  }

  const triggerSearchOnEnter = (event) => {
    if (event.keyCode === 13) {
      triggerSearch();
    }
  };

  const renderWithPermissions = (option) => {
    const hasNotPrivilege = option?.showIfIsHouseAccount && !isHouseAccount();
    if (hasNotPrivilege) return <></>;
    return (
      <>
        <label key={option.searchKey} onClick={() => changeHandler(option)}>
          {option.searchLabel}
        </label>
      </>
    );
  };

  function SearchCapsule() {
    const getSearchLabel = (option) => {
      const filteredObj = options.find(({ searchKey }) => searchKey === option);
      return filteredObj?.searchLabel;
    };

    return (
      <If condition={isSearchCapsuleVisible}>
        <Capsule closeClick={handleCapsuleClose} hasCloseBtn={true}>
          <span onClick={handleCapsuleTextClick} className="td-capsule__text">
            {`${capsuleValues.label}: ${capsuleSearchValue || inputRef?.current?.value}`}
          </span>
        </Capsule>
      </If>
    );
  }

  if (option.length && isEditView) {
    const chosenFilter = values.label;
    return (
      <>
        <SearchCapsule />
        <div className="cmp-renewal-search">
          <div className="cmp-search-select-container">
            <div className="cmp-search-select-container__box">
              <SearchField
               chosenFilter={values.label}
               inputRef={inputRef}
               searchTerm={searchTerm}
               setSearchTerm={setSearchTerm}
               triggerSearchOnEnter={triggerSearchOnEnter}
              />
              <button
                className={computeClassName("cmp-search-tooltip__button")}
                onClick={() => triggerSearch()}
              >
               {isTDSynnex 
               ? <SearchIcon className="search-icon__light"/>
                :<i className="fas fa-search"></i>}
              </button>
            </div>
            <If condition={isResetVisible}>
              <div
                className="cmp-search-options"
                style={!isTDSynnex ? { padding: "5px 10px" } : {}}
              >
                <div className="cmp-search-options__reset">
                  <label>
                    {callbackExecuted && !filterCounter ? (
                      <p>Sorry, no rows to display</p>
                    ) : (
                      <p>Search by {chosenFilter}</p>
                    )}
                  </label>
                  { isTDSynnex ? <ArrowClockWiseIcon onClick={onReset} /> : <a onClick={onReset}>Reset</a>}
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
            <If condition={!isSearchCapsuleVisible} Else={<span className="cmp-renewal-search-dnone"/>}>
                <span className="cmp-renewal-search__text">Search</span>
            </If>
            {isTDSynnex 
              ? <SearchIcon className="search-icon__dark"/>
              : <i className="fas fa-search cmp-renewal-search__icon"></i>
            }
            
          </div>
        </If>
        <If condition={isDropdownVisible}>
          <div className="cmp-search-select-container" ref={node}>
            <div className="cmp-search-select-container__box">
              <input className={computeClassName("inputStyle")} placeholder={isTDSynnex ? "Search": "Search by"} disabled />
              <button className={computeClassName("cmp-search-tooltip__button")}>
              {isTDSynnex ? 
              <SearchIcon className="search-icon__light"/>
              : <i className="fas fa-search cmp-renewal-search__icon"></i>}
              </button>
            </div>
            <If condition={true}>
              <div className={computeClassName("cmp-search-options hide")}>
                {options.map((option) => renderWithPermissions(option))}
              </div>
            </If>
          </div>
        </If>
      </div>
    </>
  );
}

const SearchFilter = React.memo(forwardRef(_SearchFilter));

export default SearchFilter;


_SearchFilter.propTypes = {
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
