import React, { useState } from 'react';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  getFilterAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { isEqual } from 'lodash';

const OrderFilterFlyout = ({
  filterLabels,
  onQueryChanged,
  filtersRefs,
  isTDSynnex,
  subheaderReference,
  analyticsCategories,
}) => {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.orderFilterCounter
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.dateRangeFiltersChecked
  );
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.customFiltersChecked
  );

  const [showLess, setShowLess] = useState(true);

  const predefinedFiltersSelectedBefore = useOrderTrackingStore(
    (state) => state.predefinedFiltersSelectedBefore
  );
  const predefinedFiltersSelectedAfter = useOrderTrackingStore(
    (state) => state.predefinedFiltersSelectedAfter
  );
  const customizedFiltersSelectedBefore = useOrderTrackingStore(
    (state) => state.customizedFiltersSelectedBefore
  );
  const customizedFiltersSelectedAfter = useOrderTrackingStore(
    (state) => state.customizedFiltersSelectedAfter
  );

  const areCustomFiltersEqual = (beforeFilters, afterFilters) => {
    let counterBeforeFilters = 0;
    beforeFilters?.map((element) => {
      element?.filterOptionList?.map((filter) => {
        filter?.checked === true && counterBeforeFilters++;
      });
    });
    let counterAfterFilters = 0;
    afterFilters?.map((element) => {
      element?.filterOptionList?.map((filter) => {
        filter?.checked === true && counterAfterFilters++;
      });
    });
    if (counterBeforeFilters === 0 && counterAfterFilters === 0) {
      return true;
    }
    return isEqual(beforeFilters, afterFilters);
  };

  const isChangeDetected =
    !isEqual(predefinedFiltersSelectedBefore, predefinedFiltersSelectedAfter) ||
    !areCustomFiltersEqual(
      customizedFiltersSelectedBefore,
      customizedFiltersSelectedAfter
    );

  const enabled = orderFilterCounter !== 0 && isChangeDetected;

  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.isFilterModalOpen
  );

  const {
    toggleFilterModal,
    clearAllOrderFilters,
    setPredefinedFiltersSelectedBefore,
    setPredefinedFiltersSelectedAfter,
    setCustomizedFiltersSelectedBefore,
    setCustomizedFiltersSelectedAfter,
  } = useOrderTrackingStore((state) => state.effects);
  const { filterTitle, showResultLabel } = filterLabels;
  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  const { dateRange, orderStatus, orderType } = filterLabels;

  const showResult = () => {
    if (orderFilterCounter !== 0) {
      let checkedFilters = [];
      orderStatusFiltersChecked.length > 0 &&
        checkedFilters.push(getDictionaryValueOrKey(orderStatus));
      orderTypeFiltersChecked.length > 0 &&
        checkedFilters.push(getDictionaryValueOrKey(orderType));
      dateRangeFiltersChecked.length > 0 &&
        checkedFilters.push(getDictionaryValueOrKey(dateRange));
      pushDataLayerGoogle(
        getFilterAnalyticsGoogle(
          getDictionaryValueOrKey(analyticsCategories.filter),
          checkedFilters
        )
      );
    }
    toggleFilterModal();
    setPredefinedFiltersSelectedBefore([
      ...orderStatusFiltersChecked,
      ...orderTypeFiltersChecked,
      ...dateRangeFiltersChecked,
    ]);
    setCustomizedFiltersSelectedBefore(structuredClone(customFiltersChecked));
    onQueryChanged();
  };

  const handleClearFilter = () => {
    Object.keys(filtersRefs).map(
      (filter) => (filtersRefs[filter].current = undefined)
    );
    clearAllOrderFilters();
    setPredefinedFiltersSelectedBefore([]);
    setPredefinedFiltersSelectedAfter([]);
    setCustomizedFiltersSelectedBefore([]);
    setCustomizedFiltersSelectedAfter([]);
    toggleFilterModal();
    onQueryChanged();
  };

  return (
    <BaseFlyout
      open={isFilterModalOpen}
      onClose={handleClearFilter}
      width="425px"
      anchor="right"
      titleLabel={getDictionaryValueOrKey(filterTitle)}
      buttonLabel={getDictionaryValueOrKey(showResultLabel)}
      enableButton={enabled}
      disabledButton={!enabled}
      onClickButton={showResult}
      isTDSynnex={isTDSynnex}
      subheaderReference={subheaderReference}
    >
      <section className="cmp-flyout__content teal_scroll height_order_filters">
        <div className={'order-filter-accordion'}>
          <OrderFilterList
            filtersRefs={filtersRefs}
            filterLabels={filterLabels}
          />
        </div>
      </section>
      <section
        className={`filter-order-tags-container ${showLess ? 'activated' : ''}`}
      >
        <span
          onClick={toggleShowLess}
          className="order-filter-tags-more"
        ></span>
        <OrderFilterTags filtersRefs={filtersRefs} />
      </section>
    </BaseFlyout>
  );
};
export default OrderFilterFlyout;
