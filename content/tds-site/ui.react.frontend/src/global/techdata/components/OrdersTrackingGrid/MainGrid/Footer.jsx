import React from 'react';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';

/**
 * Footer component for the main grid, including pagination controls.
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onQueryChanged - Callback function to trigger when the query changes.
 * @param {boolean} props.isLoading - Flag indicating if data is currently loading.
 * @param {Object} props.searchParams - The current search parameters.
 */
const Footer = ({ onQueryChanged, isLoading, searchParams, paginationData }) => {

  /**
   * Handles page change event from the pagination component.
   * @param {Object} data - The data containing the new page number.
   */
  const onPageChange = (data) => {
    console.log("MainGridFooter::onPageChange");

    // Ensure searchParams and nested paginationAndSorting objects are defined

    searchParams.paginationAndSorting = searchParams?.paginationAndSorting ?? {};

    // Update the current page number in the search parameters
    searchParams.paginationAndSorting.pageNumber = data.pageNumber;

    // Trigger the query change callback indicating a search action with updated searchParams
    onQueryChanged(searchParams);
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

export default Footer;