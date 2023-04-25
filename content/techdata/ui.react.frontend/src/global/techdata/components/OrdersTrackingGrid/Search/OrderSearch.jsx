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
  isFromRenewalDetailsPage,
  setLocalStorageData,
} from '../../RenewalsGrid/utils/renewalUtils';
import '../../../../../../src/styles/TopIconsBar.scss';
import OrderSearchEditView from './OrderSearchEditView';
import OrderSearchView from './OrderSearchView';

function _OrderSearch(
  { options, searchCounter, onQueryChanged, store, hideLabel = false },
  ref
) {
  const customSearchValues = {
    dropdown: '',
    input: '',
    option: getInitialFieldState(),
    label: getInitialLabelState(),
  };
  const [values, setValues] = useState({
    ...customSearchValues,
  });
  const [callbackExecuted, setCallbackExecuted] = useState(false);
  const [isDropdownVisible, setSwitchDropdown] = useState(false);
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

  function getInitialValueState() {
    if (
      hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)?.value;
    } else {
      return '';
    }
  }

  function getInitialFieldState() {
    if (
      hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)?.field;
    } else {
      return '';
    }
  }

  function getInitialLabelState() {
    if (!hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)) {
      return '';
    }

    if (isFromRenewalDetailsPage())
      return (
        options.filter((item) => item.searchKey === getInitialFieldState())[0]
          ?.searchLabel || ''
      );

    return '';
  }

  function hasPreviousSearchTerm() {
    if (!hasLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)) {
      return false;
    }

    if (isFromRenewalDetailsPage())
      return getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY)?.value !== '';

    return false;
  }

  function clearValues() {
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
  }

  const onReset = () => {
    setCallbackExecuted(false);
    setIsSearchCapsuleVisible(false);
    if (searchTriggered) {
      setSwitchDropdown(true);
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
  };

  const handleDropdownSwitch = useCallback(() => {
    setIsSearchHovered(false);
    closeAndCleanToaster && closeAndCleanToaster();
    if (isSearchCapsuleVisible) {
      handleCapsuleTextClick();
    }
    setSwitchDropdown(!isDropdownVisible);
    if (!isDropdownVisible) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
  }, [isDropdownVisible]);

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

    setIsSearchCapsuleVisible(true);
    setSearchTerm(inputValue);
    setCapsuleSearchValue(inputValue);
    setIsEditView(false);
    setInputValueState(inputValue);
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
      field: option,
      value: inputValue,
    });
    onQueryChanged({ onSearchAction: true });
    pushEvent(ANALYTICS_TYPES.events.orderSearch, null, {
      order: {
        searchTerm: inputValue,
        searchType: option,
      },
    });
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

  const handleMouseLeave = (e) => {
    if (isSearchCapsuleVisible) return;
    setSwitchDropdown(false);
    onReset();
  };

  const handleMouseOverSearch = () => {
    setIsSearchHovered(true);
  };

  const handleMouseLeaveSearch = () => {
    setIsSearchHovered(false);
  };
  return (
    <>
      {option.length && isEditView ? (
        <OrderSearchEditView
          isSearchCapsuleVisible={isSearchCapsuleVisible}
          handleCapsuleClose={handleCapsuleClose}
          handleCapsuleTextClick={handleCapsuleTextClick}
          capsuleValues={capsuleValues}
          capsuleSearchValue={capsuleSearchValue}
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
        />
      ) : (
        <OrderSearchView
          isSearchCapsuleVisible={isSearchCapsuleVisible}
          handleCapsuleClose={handleCapsuleClose}
          handleCapsuleTextClick={handleCapsuleTextClick}
          capsuleValues={capsuleValues}
          capsuleSearchValue={capsuleSearchValue}
          inputRef={inputRef}
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
        />
      )}
    </>
  );
}
const OrderSearch = React.memo(forwardRef(_OrderSearch));
export default OrderSearch;
