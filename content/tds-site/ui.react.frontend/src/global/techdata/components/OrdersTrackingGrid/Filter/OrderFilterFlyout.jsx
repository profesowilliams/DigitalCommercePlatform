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
  const filterClicked = useOrderTrackingStore((state) => state.filterClicked);

  const areThereAnyFiltersSelectedButNotApplied = useOrderTrackingStore(
    (state) => state.areThereAnyFiltersSelectedButNotApplied
  );

  const dateType = useOrderTrackingStore((state) => state.dateType);

  const [showLess, setShowLess] = useState(true);

  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.isFilterModalOpen
  );

  const {
    toggleFilterModal,
    clearCheckedButNotAppliedOrderFilters,
    setFilterClicked,
    closeAllFilterOptions,
    setCustomizedFiltersApplied,
    setPredefinedFiltersApplied,
    setAreThereAnyFiltersSelectedButNotApplied,
  } = useOrderTrackingStore((state) => state.effects);

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  const { dateRange, orderStatus, orderType, filterTitle, showResultLabel } =
    filterLabels;

  const showResult = () => {
    if (orderFilterCounter !== 0) {
      let checkedFilters = [];
      orderStatusFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${orderStatus}: ${orderStatusFiltersChecked
            .map((filter) => filter.filterOptionLabel)
            .join()}`
        );
      orderTypeFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${orderType}: ${orderTypeFiltersChecked
            .map((filter) => filter.filterOptionLabel)
            .join()}`
        );
      dateRangeFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${dateRange}: ${dateRangeFiltersChecked
            .map((filter) => filter.filterOptionLabel)
            .join()}`
        );
      pushDataLayerGoogle(
        getFilterAnalyticsGoogle(
          getDictionaryValueOrKey(analyticsCategories.filter),
          checkedFilters,
          dateRangeFiltersChecked.length > 0 ? dateType : ''
        )
      );
    }
    toggleFilterModal();
    closeAllFilterOptions();
    setFilterClicked(false);
    setPredefinedFiltersApplied([
      ...orderStatusFiltersChecked,
      ...orderTypeFiltersChecked,
      ...dateRangeFiltersChecked,
    ]);
    setCustomizedFiltersApplied(structuredClone(customFiltersChecked));
    onQueryChanged();
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  const handleClearFilter = () => {
    setFilterClicked(false);
    clearCheckedButNotAppliedOrderFilters();
    toggleFilterModal();
    closeAllFilterOptions();
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  return (
    <BaseFlyout
      open={isFilterModalOpen}
      onClose={handleClearFilter}
      width="425px"
      anchor="right"
      titleLabel={getDictionaryValueOrKey(filterTitle)}
      buttonLabel={getDictionaryValueOrKey(showResultLabel)}
      disabledButton={!areThereAnyFiltersSelectedButNotApplied}
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
