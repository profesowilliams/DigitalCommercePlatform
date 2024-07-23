import { compareURLs } from '../../OrdersTrackingCommon/Utils/utils';

/**
 * Updates the URL with pagination and sorting parameters.
 * If the URL changes, it updates the browser history.
 * 
 * @param {Object} paginationAndSorting - Contains pagination and sorting information.
 * @param {Object} paginationAndSorting.current - The current pagination and sorting state.
 * @param {string} [paginationAndSorting.current.sortBy] - The field to sort by.
 * @param {string} [paginationAndSorting.current.sortDirection] - The direction to sort (e.g., 'asc', 'desc').
 * @param {number} [paginationAndSorting.current.page] - The current page number.
 * @param {boolean} [replaceState=false] - Whether to replace the current history state (default is false).
 */
export function updateUrl(paginationAndSorting, replaceState = false) {
  console.log('OrderTrackingGrid::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url = new URL(window.location.href);

  // If a sorting parameter is provided, set it in the URL
  if (paginationAndSorting?.current?.sortBy) {
    url.searchParams.set('sortby', paginationAndSorting.current.sortBy);
  }

  // If a sorting direction is provided, set it in the URL
  if (paginationAndSorting?.current?.sortDirection) {
    url.searchParams.set('sortdirection', paginationAndSorting.current.sortDirection);
  }

  // If a page number is provided, set it in the URL
  if (paginationAndSorting?.current?.pageNumber) {
    url.searchParams.set('page', paginationAndSorting.current.pageNumber);
  }

  // If a query cache key is provided, set it in the URL
  if (paginationAndSorting?.current?.queryCacheKey) {
    url.searchParams.set('q', paginationAndSorting.current.queryCacheKey);
  }

  // If the URL has changed, update the browser history
  if (!compareURLs(url, currentUrl)) {
    if (replaceState) {
      // Use pushState to add a new entry to the browser history
      window.history.pushState(null, '', url.toString());
    } else {
      // Use replaceState to modify the current entry in the browser history
      window.history.replaceState(null, '', url.toString());
    }
  }
};