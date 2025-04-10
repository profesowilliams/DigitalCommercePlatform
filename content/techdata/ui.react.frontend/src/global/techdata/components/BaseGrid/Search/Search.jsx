import PropTypes from "prop-types";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useEffect } from "react";
import { ChevronDownIcon, SearchIcon, SearchIconFilled } from "../../../../../fluentIcons/FluentIcons";
import { SEARCH_LOCAL_STORAGE_KEY, TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { isHouseAccount } from "../../../../../utils/user-utils";
import { getDictionaryValue } from "../../../../../utils/utils";
import { If } from "../../../helpers/If";
import useComputeBranding from "../../../hooks/useComputeBranding";
import Pill from '../../Widgets/Pill';
import {
  getLocalStorageData,
  hasLocalStorageData,
  isFromRenewalDetailsPage,
  setLocalStorageData,
} from '../../RenewalsGrid/utils/renewalUtils';
import { SearchField } from './SearchField';
import "../../../../../../src/styles/TopIconsBar.scss";
import { useStore } from "../../../../../utils/useStore";
import { pushDataLayer, getSearchAnalytics } from '../../Analytics/analytics'

function _GridSearch(
  { styleProps, options, callback, inputType, filterCounter, onQueryChanged, store, hideLabel=false },
  ref
) {
  const customSearchValues = {
    dropdown: "",
    input: "",
    option: getInitialFieldState(),
    label: getInitialLabelState()
  }
  const analyticsCategory = store((state) => state.analyticsCategory);
  const [values, setValues] = useState({ ...customSearchValues }); /** TODO: Get rid of states and move to Zustand for less boilerplate. */
  const [callbackExecuted, setCallbackExecuted] = useState(false);
  const [isDropdownVisible, setSwitchDropdown] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
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
  const effects = store((state) => state.effects);
  const { computeClassName, isTDSynnex } = useComputeBranding(store);
  const { closeAndCleanToaster } = effects;
  const [inputValueState, setInputValueState] = useState(getInitialValueState());
  const [capsuleValues, setCapsuleValues] = useState({ ...customSearchValues });
  const userData = useStore(state => state.userData);

  const getOptionGivenQueryString = (options, userData) => {
    let searchTerm = null;
    const urlParams = new URLSearchParams(window.location.search);

    for (const [key, value] of urlParams) {
      const option = options.find((option) => option.searchKey.toLowerCase() === "id" && option.searchKey.toLowerCase() === key.toLowerCase() && (!option?.showIfIsHouseAccount || (option?.showIfIsHouseAccount && isHouseAccount(userData))));
      if (option) {
        searchTerm = {value, option};
        break;
      }
    }
    return searchTerm;
  };

  const setSearchOptionGivenQueryString = async (options, userData) => {
    const searchTerm = getOptionGivenQueryString(options, userData);

    if (!!searchTerm) {
      setSearchTriggered(true);
      setLocalStorageData(SEARCH_LOCAL_STORAGE_KEY, {
        field: searchTerm.option.searchKey,
        value: searchTerm.value,
      });
      setSwitchDropdown(false);
      setIsSearchCapsuleVisible(true);
      setSearchTerm(searchTerm.value);
      setCapsuleSearchValue(searchTerm.value);
      setIsEditView(false);
      setInputValueState(searchTerm.value);
      onQueryChanged({ onSearchAction: true });
      setValues({ ...values, option: searchTerm.option.searchKey, label: searchTerm.option.searchLabel });
      setCapsuleValues({ ...customSearchValues, option: searchTerm.option.searchKey, label: searchTerm.option.searchLabel });
    }
  };

  useEffect(() => {
    if (userData) {
      setSearchOptionGivenQueryString(options, userData);
    }
  }, [userData]);


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
      setSwitchDropdown(true);
      onQueryChanged({ onSearchAction: true });
    }
    setSearchTriggered(false);
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
    setIsSearchHovered(false);
    closeAndCleanToaster && closeAndCleanToaster();
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
      e.target.closest(".cmp-renewal-search");
    const isComingFromReset =
      e.target.closest(".cmp-search-options__reset") || e.target.closest(".cmp-search-options__reset__icon-container");
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
    onQueryChanged({ onSearchAction: true });
    pushDataLayer(getSearchAnalytics(analyticsCategory, { field: option, value: inputValue}));
    setCapsuleValues({ ...values });
  }

  function fetchAll() {
    onQueryChanged({ onSearchAction: true });
    onReset();
  }

  const triggerSearchOnEnter = (event) => {
    if (event.keyCode === 13) {
      setSwitchDropdown(false);
      triggerSearch();
    }
  };

  const RenderWithPermissions = ({ option }) => {
    const hasNotPrivilege = option?.showIfIsHouseAccount && !isHouseAccount(userData);
    if (hasNotPrivilege) return <></>;
    return (
      <>
        <label onClick={() => changeHandler(option)}>
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
        <Pill closeClick={handleCapsuleClose} hasCloseButton>
          <span onClick={handleCapsuleTextClick} className="td-capsule__text">
            {`${capsuleValues.label}: ${
              capsuleSearchValue || inputRef?.current?.value
            }`}
          </span>
        </Pill>
      </If>
    );
  }

  const handleMouseLeave = (e) => {
    if (isSearchCapsuleVisible) return
    setSwitchDropdown(false);
    onReset();
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
                store={store}
              />
              <button
                className={computeClassName("cmp-search-tooltip__button")}
                onClick={() => triggerSearch()}
              >
                <SearchIcon className="search-icon__light" />
              </button>
            </div>
            <If condition={isResetVisible}>
              <div
                className="cmp-search-options"
                style={!isTDSynnex ? { padding: "5px 10px" } : {}}
              >
                <div className="cmp-search-options__reset">
                  <label style={{ pointerEvents: 'none' }}>
                    {callbackExecuted && !filterCounter ? (
                      <p>Sorry, no rows to display</p>
                    ) : (
                      <p>Search by {chosenFilter}</p>
                    )}
                  </label>
                  <div className="cmp-search-options__reset__icon-container" onClick={onReset}>
                    <ChevronDownIcon onClick={onReset} />
                  </div>
                </div>
              </div>
            </If>
            <div className="cmp-search-select-container__filler"></div>
          </div>
        </div>
      </>
    );
  }

  const handleMouseOverSearch = () => {
    setIsSearchHovered(true);
  }

  const handleMouseLeaveSearch = () => {
    setIsSearchHovered(false);
  }

  return (
    <>
      <SearchCapsule />
      <div className="cmp-renewal-search" onMouseLeave={handleMouseLeave}>
        <If condition={!isDropdownVisible}>
          <div className="cmp-renewal-search" onClick={handleDropdownSwitch}>
            {!hideLabel && <If condition={!isSearchCapsuleVisible} Else={<span className="cmp-renewal-search-dnone" />}>
              <span className="cmp-renewal-search__text">{getDictionaryValue("grids.common.label.search", "Search")}</span>
            </If>}
            <div onMouseOver={handleMouseOverSearch} onMouseLeave={handleMouseLeaveSearch}>            
              {isSearchHovered ? <SearchIconFilled className="search-icon__dark" /> 
              : <SearchIcon className="search-icon__dark"/>}
            </div>
          </div>
        </If>
        <If condition={isDropdownVisible}>
          <div className="cmp-search-select-container" ref={node}>
            <div className="cmp-search-select-container__box">
              <input className={computeClassName("inputStyle")} placeholder={getDictionaryValue("grids.common.label.search", "Search")} disabled />
              <button className={computeClassName("cmp-search-tooltip__button")}>
                <SearchIcon className="search-icon__light" />
              </button>
            </div>
            <div className="cmp-search-select-container__filler"></div>
            <If condition={true}>
              <div className={computeClassName("cmp-search-options")}>
                {options.map((option) => <RenderWithPermissions option={option} key={option.searchKey} />)}
              </div>
            </If>
          </div>
        </If>
      </div>
    </>
  );
}

const GridSearch = React.memo(forwardRef(_GridSearch));

export default GridSearch;


_GridSearch.propTypes = {
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
  hideLabel: PropTypes.bool,
};
