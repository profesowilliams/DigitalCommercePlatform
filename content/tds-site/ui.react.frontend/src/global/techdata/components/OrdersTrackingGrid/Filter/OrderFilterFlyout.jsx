import React, { useState } from 'react';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getFilterAnalytics, pushDataLayer } from '../utils/analyticsUtils';

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
  const [showLess, setShowLess] = useState(true);
  const enabled = orderFilterCounter !== 0;
  const effects = useOrderTrackingStore((state) => state.effects);
  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.isFilterModalOpen
  );
  const { toggleFilterModal, clearAllOrderFilters } = effects;
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
      pushDataLayer(
        getFilterAnalytics(
          getDictionaryValueOrKey(analyticsCategories.filter),
          checkedFilters
        )
      );
    }
    toggleFilterModal();
    onQueryChanged();
  };

  const handleClearFilter = () => {
    Object.keys(filtersRefs).map(
      (filter) => (filtersRefs[filter].current = undefined)
    );
    clearAllOrderFilters();
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
