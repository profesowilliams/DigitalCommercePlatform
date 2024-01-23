import React, { useState, useEffect } from 'react';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  getFilterAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { setLocalStorageData } from '../utils/gridUtils';
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';

const OrderFilterFlyout = ({
  filterLabels,
  onQueryChanged,
  filtersRefs,
  isTDSynnex,
  subheaderReference,
  analyticsCategories,
  resetReports,
}) => {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.filter.orderFilterCounter
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.customFiltersChecked
  );
  const filterClicked = useOrderTrackingStore(
    (state) => state.filter.filterClicked
  );
  const areThereAnyFiltersSelectedButNotApplied = useOrderTrackingStore(
    (state) => state.filter.areThereAnyFiltersSelectedButNotApplied
  );

  const dateType = useOrderTrackingStore((state) => state.filter.dateType);

  const [showLess, setShowLess] = useState(true);

  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.filter.isFilterModalOpen
  );

  const {
    toggleFilterModal,
    clearCheckedButNotAppliedOrderFilters,
    setFilterClicked,
    closeAllFilterOptions,
    setCustomizedFiltersApplied,
    setPredefinedFiltersApplied,
    setAreThereAnyFiltersSelectedButNotApplied,
    setDateType,
  } = useOrderTrackingStore((state) => state.effects);

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  const { dateRange, orderStatus, orderType, filterTitle, showResultLabel } =
    filterLabels;

  const orderDate = getDictionaryValueOrKey(filterLabels.orderDateLabel);
  const shipDate = getDictionaryValueOrKey(filterLabels.shipDateLabel);
  const invoiceDate = getDictionaryValueOrKey(filterLabels.invoiceDateLabel);

  const filterDateOptions = [
    { key: 'orderDate', label: orderDate },
    { key: 'shipDate', label: shipDate },
    { key: 'invoiceDate', label: invoiceDate },
  ];

  const showResult = () => {
    resetReports();
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
    setLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY, {
      dates: dateRangeFiltersChecked,
      types: orderTypeFiltersChecked,
      statuses: orderStatusFiltersChecked,
    });
    onQueryChanged({ onSearchAction: true });
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  const handleClearFilter = () => {
    setFilterClicked(false);
    clearCheckedButNotAppliedOrderFilters();
    toggleFilterModal();
    closeAllFilterOptions();
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  useEffect(() => {
    !dateType && setDateType(filterDateOptions[0].key);
    setAreThereAnyFiltersSelectedButNotApplied();
  }, []);

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
      <section className="cmp-flyout__content-without-padding teal_scroll height_order_filters">
        <div className={'order-filter-accordion'}>
          <OrderFilterList
            filtersRefs={filtersRefs}
            filterLabels={filterLabels}
            filterDateOptions={filterDateOptions}
          />
        </div>
      </section>
      {orderFilterCounter !== 0 && (
        <section
          className={`filter-order-tags-container ${
            showLess ? 'activated' : ''
          }`}
        >
          <span
            onClick={toggleShowLess}
            className="order-filter-tags-more"
          ></span>
          <OrderFilterTags
            filterDateOptions={filterDateOptions}
            filtersRefs={filtersRefs}
          />
        </section>
      )}
    </BaseFlyout>
  );
};
export default OrderFilterFlyout;
