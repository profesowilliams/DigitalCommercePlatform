import React from 'react';
import { getDictionaryValue } from '../../../../../utils/utils';
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
  const enabled = orderFilterCounter !== 0;
  const effects = useOrderTrackingStore((state) => state.effects);
  const isFilterModalOpen = useOrderTrackingStore(
    (state) => state.isFilterModalOpen
  );
  const { toggleFilterModal, clearAllOrderFilters } = effects;

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
  };

  return (
    <BaseFlyout
      open={isFilterModalOpen}
      onClose={handleClearFilter}
      width="425px"
      anchor="right"
      subheaderReference={document.querySelector('.subheader > div > div')}
      titleLabel={getDictionaryValue(
        'grids.common.label.filterTitle',
        'Filters'
      )}
      buttonLabel={getDictionaryValue(
        'grids.common.label.showResults',
        'Show results'
      )}
      enableButton={enabled}
      onClickButton={showResult}
      isTDSynnex={isTDSynnex}
    >
      <section className="cmp-flyout__content teal_scroll height_order_filters">
        <div className={'filter-accordion scrollbar_y_none height_1000'}>
          <OrderFilterList filtersRefs={filtersRefs} />
        </div>
      </section>
      <section className="filter-order-tags-container">
        <OrderFilterTags filtersRefs={filtersRefs} />
      </section>
    </BaseFlyout>
  );
};
export default OrderFilterFlyout;
