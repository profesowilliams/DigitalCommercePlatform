import React from 'react';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import OrderRenderWithPermissions from './OrderRenderWithPermissions';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

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
  gridConfig,
}) => {
  const { computeClassName } = useComputeBranding(useOrderTrackingStore);

  return (
    <>
      {!isDropdownVisible ? (
        <div className="cmp-renewal-search" onClick={handleDropdownSwitch}>
          {!hideLabel ? (
            <span className="cmp-renewal-search__text">
              {getDictionaryValueOrKey(gridConfig?.searchTitleLabel)}
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
            <span className="inputStyle">
              {getDictionaryValueOrKey(gridConfig?.searchTitleLabel)}
            </span>
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
