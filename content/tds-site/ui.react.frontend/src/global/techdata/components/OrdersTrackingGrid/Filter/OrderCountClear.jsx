import React from 'react';
import { FilterClearIcon } from '../../../../../fluentIcons/FluentIcons';

const OrderCountClear = ({ children, onClearFilters }) => {
  return (
    <div className={'count-clear tag_dark_teal'}>
      <div className={'filter-count-wrapper'}>{children}</div>
      <span className="filter-clear-button" onClick={onClearFilters}>
        <FilterClearIcon className="svg-clear-filter" />
      </span>
    </div>
  );
};

export default OrderCountClear;