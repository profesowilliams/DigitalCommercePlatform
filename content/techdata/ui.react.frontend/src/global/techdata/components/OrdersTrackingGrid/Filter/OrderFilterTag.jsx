import React from 'react';

const OrderFilterTag = ({ closeHandler, value, id }) => {
  return (
    <div className={'filter-tags tag_dark_teal'} key={id}>
      <span className="filter-tags__title" key={id}>
        {value}
      </span>
      <span onClick={closeHandler}>
        <i className="fas fa-times filter-tags__close"></i>
      </span>
    </div>
  );
};
export default OrderFilterTag;
