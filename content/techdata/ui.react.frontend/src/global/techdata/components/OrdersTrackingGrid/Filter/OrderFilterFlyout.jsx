import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';

const OrderFilterFlyout = ({
  aemData,
  onQueryChanged,
  filtersRefs,
  isTDSynnex,
}) => {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.orderFilterCounter
  );
  const [showLess, setShowLess] = useState(true);
  const enabled = orderFilterCounter !== 0;
  const effects = useOrderTrackingStore((state) => state.effects);
  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.isFilterModalOpen
  );
  const { toggleFilterModal, clearAllOrderFilters } = effects;
  const { filterTitle, showResults } = aemData;
  const handleShowLess = () => {
    setShowLess(!showLess);
  };

  const showResult = () => {
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
      subheaderReference={document.querySelector('.subheader > div > div')}
      titleLabel={
        filterTitle ??
        getDictionaryValueOrKey('grids.common.label.filterTitle') ??
        'Filters'
      }
      buttonLabel={
        showResults ??
        getDictionaryValueOrKey('grids.common.label.showResults') ??
        'Show results'
      }
      enableButton={enabled}
      onClickButton={showResult}
      isTDSynnex={isTDSynnex}
    >
      <section className="cmp-flyout__content teal_scroll height_order_filters">
        <div className={'order-filter-accordion'}>
          <OrderFilterList filtersRefs={filtersRefs} />
        </div>
      </section>
      <section
        className={`filter-order-tags-container ${showLess ? 'activated' : ''}`}
      >
        <span
          onClick={handleShowLess}
          className="order-filter-tags-more"
        ></span>
        <OrderFilterTags filtersRefs={filtersRefs} />
      </section>
    </BaseFlyout>
  );
};
export default OrderFilterFlyout;
