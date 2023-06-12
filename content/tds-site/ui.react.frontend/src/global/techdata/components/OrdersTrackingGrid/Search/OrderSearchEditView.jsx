import React from 'react';
import { ChevronDownIcon, SearchIcon } from './../../../../../fluentIcons/FluentIcons';
import useComputeBranding from './../../../hooks/useComputeBranding';
import OrderSearchCapsule from './OrderSearchCapsule';
import { OrderSearchField } from './OrderSearchFilter';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderSearchEditView = ({
  isSearchCapsuleVisible,
  handleCapsuleClose,
  handleCapsuleTextClick,
  capsuleValues,
  capsuleSearchValue,
  inputRef,
  values,
  searchTerm,
  setSearchTerm,
  triggerSearchOnEnter,
  store,
  triggerSearch,
  searchCounter,
  onReset,
  callbackExecuted,
  gridConfig,
}) => {
  const { computeClassName, isTDSynnex } = useComputeBranding(store);

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
      <div className="cmp-renewal-search">
        <div className="cmp-search-select-container">
          <div className="cmp-search-select-container__box">
            <OrderSearchField
              chosenFilter={values.label}
              inputRef={inputRef}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              triggerSearchOnEnter={triggerSearchOnEnter}
              store={store}
              gridConfig={gridConfig}
            />
            <button
              className={computeClassName('cmp-search-tooltip__button')}
              onClick={() => triggerSearch()}
            >
              <SearchIcon className="search-icon__light" />
            </button>
          </div>
          <div
            className="cmp-search-options"
            style={!isTDSynnex ? { padding: '5px 10px' } : {}}
          >
            <div className="cmp-search-options__reset">
              <label style={{ pointerEvents: 'none' }}>
                {callbackExecuted && !searchCounter ? (
                  <p>
                    {getDictionaryValueOrKey(
                      gridConfig?.searchSorryNoRowsToDisplayLabel
                    )}
                  </p>
                ) : (
                  <p>
                    {getDictionaryValueOrKey(gridConfig.searchByLabel)}{' '}
                    {values.label}
                  </p>
                )}
              </label>
              <div
                className="cmp-search-options__reset__icon-container"
                onClick={onReset}
              >
                <ChevronDownIcon onClick={onReset} />
              </div>
            </div>
          </div>
          <div className="cmp-search-select-container__filler"></div>
        </div>
      </div>
    </>
  );
};
export default OrderSearchEditView;