import React from 'react';
import { ChevronDownIcon } from './../../../../../fluentIcons/FluentIcons';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { OrderSearchField } from './OrderSearchFilter';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const OrderSearchEditView = ({
  inputRef,
  values,
  searchTerm,
  setSearchTerm,
  triggerSearchOnEnter,
  triggerSearch,
  searchCounter,
  onReset,
  callbackExecuted,
  gridConfig,
}) => {
  const { isTDSynnex } = useComputeBranding(useOrderTrackingStore);

  return (
    <>
      <div className="order-search-select-container">
        <div className="order-search-select-container__box">
          <OrderSearchField
            chosenFilter={values.label}
            inputRef={inputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            triggerSearchOnEnter={triggerSearchOnEnter}
            triggerSearch={triggerSearch}
            store={useOrderTrackingStore}
            gridConfig={gridConfig}
          />
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
        <div className="order-search-select-container__filler"></div>
      </div>
    </>
  );
};
export default OrderSearchEditView;