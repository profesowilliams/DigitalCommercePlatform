import React, { useState, useEffect } from 'react';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import {
  getDictionaryValueOrKey,
  getDictionaryValue,
} from '../../../../../utils/utils';
import {
  getEnglishFiltersLabel,
  getFilterAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { setLocalStorageData } from '../utils/gridUtils';
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import {
  CollapseIcon,
  ExpandIcon,
} from '../../../../../fluentIcons/FluentIcons';

const OrderFilterFlyout = ({
  filterLabels,
  onQueryChanged,
  filtersRefs,
  isTDSynnex,
  subheaderReference,
  analyticsCategories,
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
  const areThereAnyFiltersSelectedButNotApplied = useOrderTrackingStore(
    (state) => state.filter.areThereAnyFiltersSelectedButNotApplied
  );

  const dateType = useOrderTrackingStore((state) => state.filter.dateType);

  const [showLess, setShowLess] = useState(false);

  const filtersFlyoutConfig = useOrderTrackingStore(
    (state) => state.filtersFlyout
  );

  const {
    setCustomState,
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

  const orderDate = (
    <span className="filter-dateType">
      {getDictionaryValueOrKey(filterLabels.orderDateLabel)}
    </span>
  );
  const shipDate = (
    <div>
      <span className="filter-dateType">
        {getDictionaryValue(filterLabels.shipDateLabel)}{' '}
      </span>
      <span className="filter-dateType-description">
        {getDictionaryValue(filterLabels.pastDateRange, '(Past date range)')}
      </span>
    </div>
  );
  const etaDate = (
    <div>
      <span className="filter-dateType">
        {getDictionaryValue(filterLabels.etaDate, 'ETA Date')}{' '}
      </span>
      <span className="filter-dateType-description">
        {getDictionaryValue(
          filterLabels.futureDateRange,
          '(Future date range)'
        )}
      </span>
    </div>
  );
  const invoiceDate = (
    <span className="filter-dateType">
      {getDictionaryValueOrKey(filterLabels.invoiceDateLabel)}
    </span>
  );

  const filterDateOptions = [
    { key: 'orderDate', label: orderDate },
    { key: 'shipDate', label: shipDate },
    { key: 'etaDate', label: etaDate },
    { key: 'invoiceDate', label: invoiceDate },
  ];

  const showResult = () => {
    filtersFlyoutConfig.clearReports();
    if (orderFilterCounter !== 0) {
      let checkedFilters = [];
      orderStatusFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${orderStatus}: ${orderStatusFiltersChecked
            .map((filter) => getEnglishFiltersLabel(filter.filterOptionKey))
            .join()}`
        );
      orderTypeFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${orderType}: ${orderTypeFiltersChecked
            .map((filter) => getEnglishFiltersLabel(filter.filterOptionKey))
            .join()}`
        );
      dateRangeFiltersChecked.length > 0 &&
        checkedFilters.push(
          `${dateRange}: ${dateRangeFiltersChecked
            .map((filter) => getEnglishFiltersLabel(filter.filterOptionKey))
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
    setCustomState({
      key: 'filtersFlyout',
      value: { show: false },
    });
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
    setCustomState({
      key: 'filtersFlyout',
      value: { show: false },
    });
    closeAllFilterOptions();
    setAreThereAnyFiltersSelectedButNotApplied();
  };

  useEffect(() => {
    !dateType && setDateType(filterDateOptions[0].key);
    setAreThereAnyFiltersSelectedButNotApplied();
  }, []);

  return (
    <BaseFlyout
      open={filtersFlyoutConfig?.show}
      onClose={handleClearFilter}
      width="360px"
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
          <span onClick={toggleShowLess} className="order-filter-tags-more">
            {showLess ? <ExpandIcon /> : <CollapseIcon />}
          </span>
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
