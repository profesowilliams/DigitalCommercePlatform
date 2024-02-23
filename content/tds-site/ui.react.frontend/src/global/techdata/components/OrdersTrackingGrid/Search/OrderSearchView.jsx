import React from 'react';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValue } from '../../../../../utils/utils';
import OrderRenderWithPermissions from './OrderRenderWithPermissions';
import useComputeBranding from './../../../hooks/useComputeBranding';

const OrderSearchView = ({
  handleMouseLeave,
  isDropdownVisible,
  handleDropdownSwitch,
  hideLabel,
  handleMouseOverSearch,
  handleMouseLeaveSearch,
  node,
  options,
  changeHandler,
  store,
  gridConfig,
}) => {
  const { computeClassName } = useComputeBranding(store);

  return (
    <>
      {!isDropdownVisible ? (
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
            <SearchIcon className="search-icon__dark" fill="#005758" />
          </div>
        </div>
      ) : (
        <div
          className="order-search-select-container"
          ref={node}
          onMouseLeave={handleMouseLeave}
        >
          <div className="order-search-select-container__box">
            <input
              className={computeClassName('inputStyle')}
              placeholder={getDictionaryValue(gridConfig?.searchTitleLabel)}
              disabled
            />
            <button
              className={computeClassName('order-search-tooltip__button')}
            >
              <SearchIcon className="search-icon__light" />
            </button>
          </div>
          <div className="order-search-select-container__filler"></div>
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
    </>
  );
};
export default OrderSearchView;
