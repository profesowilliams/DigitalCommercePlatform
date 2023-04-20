import React from 'react';
import { getDictionaryValue } from '../../../../../utils/utils';
import OrderFilterList from './OrderFilterList';
import OrderFilterTags from './OrderFilterTags';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import BaseFlyout from './../../BaseFlyout/BaseFlyout';

const OrderFilterModal = ({ onQueryChanged }) => {
  const orderFilterCounter = useOrderTrackingStore(
    (state) => state.orderFilterCounter
  );
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
    clearAllOrderFilters();
    toggleFilterModal();
  };

  return (
    <BaseFlyout
      className={''}
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
      enableButton={orderFilterCounter !== 0}
      disabledButton={orderFilterCounter === 0}
      onClickButton={showResult}
    >
      <section className="cmp-flyout__content teal_scroll height_order_filters">
        <div className={'filter-accordion scrollbar_y_none height_1000'}>
          <OrderFilterList />
        </div>
      </section>
      <section className="filter-order-tags-container">
        <OrderFilterTags />
      </section>
    </BaseFlyout>
  );
};
export default OrderFilterModal;