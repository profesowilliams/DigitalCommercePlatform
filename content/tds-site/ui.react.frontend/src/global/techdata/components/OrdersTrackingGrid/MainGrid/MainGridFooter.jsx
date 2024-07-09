import React from 'react';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';

const MainGridFooter = ({
  onQueryChanged,
  isLoading,
  searchParams,
  paginationData
}) => {
  const onPageChange = (data) => {
    console.log("MainGridFooter::onPageChange");

    searchParams.paginationAndSorting.current.pageNumber = data.pageNumber;

    onQueryChanged({ onSearchAction: true });
  }

  return (
    <>
      <div className="grid-subheader-pagination-right">
        <OrderTrackingGridPagination
          onPageChange={onPageChange}
          disabled={isLoading}
          paginationData={paginationData}
        />
      </div>
    </>
  );
};

export default MainGridFooter;