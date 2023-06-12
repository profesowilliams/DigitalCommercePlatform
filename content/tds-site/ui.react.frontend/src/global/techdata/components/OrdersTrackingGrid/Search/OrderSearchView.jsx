import React from 'react';
import {
  SearchIconFilled,
  SearchIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValue } from '../../../../../utils/utils';
import OrderRenderWithPermissions from './OrderRenderWithPermissions';
import OrderSearchCapsule from './OrderSearchCapsule';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { useStore } from '../../../../../utils/useStore';

const OrderSearchView = ({
  isSearchCapsuleVisible,
  handleCapsuleClose,
  handleCapsuleTextClick,
  capsuleValues,
  capsuleSearchValue,
  inputRef,
  handleMouseLeave,
  isDropdownVisible,
  handleDropdownSwitch,
  hideLabel,
  handleMouseOverSearch,
  handleMouseLeaveSearch,
  isSearchHovered,
  node,
  options,
  changeHandler,
  store,
  gridConfig,
}) => {
  const { computeClassName } = useComputeBranding(store);
  const userData = useStore((state) => state.userData);

  return (
    <>
      <OrderSearchCapsule
        capsuleSearchValue={capsuleSearchValue}
        handleCapsuleClose={handleCapsuleClose}
        handleCapsuleTextClick={handleCapsuleTextClick}
        inputValue={inputRef?.current?.value}
        isSearchCapsuleVisible={isSearchCapsuleVisible}
        label={capsuleValues.label}
      />
      <div className="cmp-renewal-search" onMouseLeave={handleMouseLeave}>
        {!isDropdownVisible && (
          <div className="cmp-renewal-search" onClick={handleDropdownSwitch}>
            {!hideLabel ? (
              <span className="cmp-renewal-search__text">
                {getDictionaryValue(gridConfig?.searchTitleLabel)}
              </span>
            ) : (
              <span className="cmp-renewal-search-dnone" />
            )}
            <div
              onMouseOver={handleMouseOverSearch}
              onMouseLeave={handleMouseLeaveSearch}
            >
              {isSearchHovered ? (
                <SearchIconFilled className="search-icon__dark" />
              ) : (
                <SearchIcon className="search-icon__dark" />
              )}
            </div>
          </div>
        )}
        {isDropdownVisible && (
          <div className="cmp-search-select-container" ref={node}>
            <div className="cmp-search-select-container__box">
              <input
                className={computeClassName('inputStyle')}
                placeholder={getDictionaryValue(gridConfig?.searchTitleLabel)}
                disabled
              />
              <button
                className={computeClassName('cmp-search-tooltip__button')}
              >
                <SearchIcon className="search-icon__light" />
              </button>
            </div>
            <div className="cmp-search-select-container__filler"></div>
            <div className={computeClassName('cmp-search-options')}>
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
      </div>
    </>
  );
};
export default OrderSearchView;
