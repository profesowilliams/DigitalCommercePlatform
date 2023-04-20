import React, { useState } from 'react';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function OrderFilterTags() {
  const [showMore, setShowMore] = useState(false);
  const {
    setOrderStatusFiltersChecked,
    setOrderTypeFiltersChecked,
    setDateRangeFiltersChecked,
    setCustomState,
  } = useOrderTrackingStore((state) => state.effects);
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.dateRangeFiltersChecked
  );
  const dateType = useOrderTrackingStore((state) => state.dateType);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleFilterCloseClick = (id, group) => {
    if (group === 'status') {
      const newList = orderStatusFiltersChecked.filter((x) => x.id !== id);
      setOrderStatusFiltersChecked(newList);
    }
    if (group === 'type') {
      const newList = orderTypeFiltersChecked.filter((x) => x.id !== id);
      setOrderTypeFiltersChecked(newList);
    }
    if (group === 'date') {
      setDateRangeFiltersChecked([]);
      setCustomState({
        key: 'customStartDate',
        value: undefined,
      });
      setCustomState({
        key: 'customEndDate',
        value: undefined,
      });
    }
  };

  return (
    <>
      <div className={`filter-tags-container ${showMore ? 'active' : ''}`}>
        <span onClick={handleShowMore} className="filter-tags-more"></span>
        {[
          ...orderStatusFiltersChecked,
          ...orderTypeFiltersChecked,
          ...dateRangeFiltersChecked,
        ].map((filter, index) => (
          <div className={"filter-tags tag_dark_teal"} key={index}>
            <span className="filter-tags__title" key={index}>
              {(filter?.group === 'date' && dateType) && `${dateType} : `}
              {`${filter.label}`}
            </span>
            <span
              onClick={() => handleFilterCloseClick(filter.id, filter?.group)}
            >
              <i className="fas fa-times filter-tags__close"></i>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
export default OrderFilterTags;
