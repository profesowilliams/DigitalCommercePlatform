import React, {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ORDER_SEARCH_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import {
  ANALYTICS_TYPES,
  pushEvent,
} from '../../../../../utils/dataLayerUtils';
import {
  getLocalStorageData,
  hasLocalStorageData,
  setLocalStorageData,
} from '../utils/gridUtils';
import '../../../../../../src/styles/TopIconsBar.scss';
import OrderSearchEditView from './OrderSearchEditView';
import OrderSearchView from './OrderSearchView';
import {
  getSearchAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import OrderSearchCapsule from './OrderSearchCapsule';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import OrderRenderWithPermissions from './OrderRenderWithPermissions';

const getInitialFieldState = () => {
  if (hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)) {
    return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).field;
  } else {
    return '';
  }
};

const getInitialLabelState = () => {
  if (hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)) {
    return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).field;
  }
  return '';
};

const getInitialValueState = () => {
  if (hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)) {
    return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).value;
  }
  return '';
};

const hasPreviousSearchTerm = () => {
  if (getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).value) {
    return true;
  }
  return false;
};

const _OrderSearch = (
  {
    options,
    searchCounter,
    onQueryChanged,
    store,
    hideLabel = false,
    gridConfig,
    searchAnalyticsLabel,
  },
  ref
) => {
  const customSearchValues = {
    dropdown: '',
    input: getInitialValueState(),
    option: getInitialFieldState(),
    label:
      options.find((option) => option.searchKey === getInitialFieldState())
        ?.searchLabel || '',
  };
  const [values, setValues] = useState({
    ...customSearchValues,
  });
  const [callbackExecuted, setCallbackExecuted] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const { option } = values;
  const node = useRef();
  const inputRef = useRef();
  const [isSearchCapsuleVisible, setIsSearchCapsuleVisible] = useState(
    hasPreviousSearchTerm()
  );
  const [isEditView, setIsEditView] = useState(false);
  const [searchTerm, setSearchTerm] = useState(getInitialValueState());
  const [capsuleSearchValue, setCapsuleSearchValue] = useState(
    getInitialValueState()
  );
  const [searchTriggered, setSearchTriggered] = useState(false);
  const effects = store((state) => state.effects);
  const { closeAndCleanToaster } = effects;
  const [inputValueState, setInputValueState] = useState(
    getInitialValueState()
  );
  const [capsuleValues, setCapsuleValues] = useState({ ...customSearchValues });

  useImperativeHandle(
    ref,
    () => ({ field: values.option, value: inputValueState }),
    [values, inputValueState]
  );

  const clearValues = () => {
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        setValues((prevSt) => {
          return {
            ...prevSt,
            [key]: '',
          };
        });
      }
    }
    setCapsuleValues(false);
  };

  const onReset = () => {
    setCallbackExecuted(false);
    setIsSearchCapsuleVisible(false);
    if (searchTriggered) {
      onQueryChanged({ onSearchAction: true });
    }
    setSearchTriggered(false);
    setSearchTerm('');
    setCapsuleSearchValue('');
    clearValues();
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
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
    setIsSearchCapsuleVisible(false);
  };

  const handleDropdownSwitch = useCallback(() => {
    setIsSearchHovered(false);
    setIsDropdownVisible(false);
    closeAndCleanToaster && closeAndCleanToaster();
    if (isSearchCapsuleVisible) {
      handleCapsuleTextClick();
    }
    if (!isDropdownVisible) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
  }, []);

  const handleOutsideClick = (e) => {
    const isComingFromSearch = e.target.closest('.cmp-renewal-search');
    const isComingFromReset =
      e.target.closest('.cmp-search-options__reset') ||
      e.target.closest('.cmp-search-options__reset__icon-container');
    if (
      node.current &&
      !isComingFromSearch &&
      !isComingFromReset &&
      !node.current.contains(e.target)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleCapsuleClose = () => {
    setIsSearchCapsuleVisible(false);
    fetchAll();
  };

  const handleCapsuleTextClick = () => {
    setIsSearchCapsuleVisible(false);
    setIsEditView(true);
  };

  const triggerSearch = () => {
    setIsDropdownVisible(false);
    if (!searchTriggered) setSearchTriggered(true);
    const { option } = values;
    const inputValue = inputRef.current.value;
    if (!inputValue) return fetchAll();
    // if (inputValue.length < 3) { // TODO: add proper handling in case there are less than 3 characters
    //   return;
    // }
    pushDataLayerGoogle(
      getSearchAnalyticsGoogle(searchAnalyticsLabel, option, inputValue)
    );
    setIsSearchCapsuleVisible(true);
    setSearchTerm(inputValue);
    setCapsuleSearchValue(inputValue);
    setIsEditView(false);
    setInputValueState(inputValue);
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
      field: option,
      value: inputValue,
    });
    onQueryChanged();
    pushEvent(ANALYTICS_TYPES.events.orderSearch, null, {
      order: {
        searchTerm: inputValue,
        searchType: option,
      },
    });
    setCapsuleValues({ ...values });
    setIsDropdownVisible(false);
  };

  const fetchAll = () => {
    onQueryChanged({ onSearchAction: true });
    onReset();
  };

  const triggerSearchOnEnter = (event) => {
    if (event.keyCode === 13) {
      setIsDropdownVisible(false);
      triggerSearch();
    }
  };

  const handleMouseLeave = () => {
    if (isSearchCapsuleVisible) return;
    setIsDropdownVisible(false);
    onReset();
  };

  const handleMouseOverSearch = () => {
    setIsSearchHovered(true);
    setIsDropdownVisible(true);
  };

  const handleMouseLeaveSearch = () => {
    setIsSearchHovered(false);
    setIsDropdownVisible(false);
  };
  return (
    <>
      {isSearchCapsuleVisible ? (
        <>
          <OrderSearchCapsule
            capsuleSearchValue={capsuleSearchValue}
            handleCapsuleClose={handleCapsuleClose}
            handleCapsuleTextClick={handleCapsuleTextClick}
            inputValue={inputRef?.current?.value}
            label={capsuleValues.label}
          />
          {!isDropdownVisible ? (
            <div className="cmp-renewal-search">
              <div
                onMouseOver={handleMouseOverSearch}
                onMouseLeave={handleMouseLeaveSearch}
              >
                <SearchIcon className="search-icon__dark" />
              </div>
            </div>
          ) : (
            <div
              className="order-search-select-container"
              ref={node}
              onMouseLeave={handleMouseLeaveSearch}
            >
              <div className="order-search-select-container__box">
                <input
                  className="inputStyle"
                  placeholder={getDictionaryValueOrKey(
                    gridConfig?.searchTitleLabel
                  )}
                  disabled
                />
                <button className="order-search-tooltip__button">
                  <SearchIcon className="search-icon__light" />
                </button>
              </div>
              <div className="order-search-select-container__filler"></div>
              <div className="cmp-search-options">
                {options.map((option) => (
                  <OrderRenderWithPermissions
                    option={option}
                    changeHandler={changeHandler}
                    key={option.searchKey}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : option.length && isEditView ? (
        <OrderSearchEditView
          inputRef={inputRef}
          values={values}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          triggerSearchOnEnter={triggerSearchOnEnter}
          store={store}
          triggerSearch={triggerSearch}
          searchCounter={searchCounter}
          onReset={onReset}
          callbackExecuted={callbackExecuted}
          gridConfig={gridConfig}
          setIsDropdownVisible={setIsDropdownVisible}
        />
      ) : (
        <OrderSearchView
          handleMouseLeave={handleMouseLeave}
          isDropdownVisible={isDropdownVisible}
          handleDropdownSwitch={handleDropdownSwitch}
          hideLabel={hideLabel}
          handleMouseOverSearch={handleMouseOverSearch}
          handleMouseLeaveSearch={handleMouseLeaveSearch}
          isSearchHovered={isSearchHovered}
          node={node}
          store={store}
          options={options}
          changeHandler={changeHandler}
          gridConfig={gridConfig}
        />
      )}
    </>
  );
};
const OrderSearch = React.memo(forwardRef(_OrderSearch));
export default OrderSearch;
