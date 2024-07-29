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
  if (paginationAndSorting?.sortBy) {
    url.searchParams.set('sortby', paginationAndSorting.sortBy);
  }

  // If a sorting direction is provided, set it in the URL
  if (paginationAndSorting?.sortDirection) {
    url.searchParams.set('sortdirection', paginationAndSorting.sortDirection);
  }

  // If a page number is provided, set it in the URL
  if (paginationAndSorting?.pageNumber) {
    url.searchParams.set('page', paginationAndSorting.pageNumber);
  }

  // If a query cache key is provided, set it in the URL
  if (paginationAndSorting?.queryCacheKey) {
    url.searchParams.set('q', paginationAndSorting.queryCacheKey);
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

/**
 * Compares the filters, reports, and search objects of two criteria objects to determine if they are different.
 * @param {Object} newCriteria - The new criteria object containing filters, reports, and search. Can be null.
 * @param {Object} oldCriteria - The old criteria object containing filters, reports, and search. Can be null.
 * @returns {boolean} - Returns true if any of the filters, reports, or search objects are different; otherwise, false.
 */
export function checkIfCountIsRequired(newCriteria, oldCriteria) {
  // Helper function to compare two objects
  const areObjectsDifferent = (obj1, obj2) => {
    // If both objects are null or undefined, return false (they are the same)
    if (!obj1 && !obj2) return false;

    // If only one of the objects is null or undefined, return true (they are different)
    if (!obj1 || !obj2) return true;

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, return true (they are different)
    if (keys1.length !== keys2.length) return true;

    // Check if any of the keys have different values
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    // If all keys have the same values, return false (they are the same)
    return false;
  };

  // If both criteria are null, they are considered the same
  if (!newCriteria && !oldCriteria) return false;

  // If only one of the criteria is null, they are considered different
  if (!newCriteria || !oldCriteria) return true;

  // Compare the filters, reports, and search objects of the new and old criteria
  const filtersDifferent = areObjectsDifferent(newCriteria.filters, oldCriteria.filters);
  const reportsDifferent = areObjectsDifferent(newCriteria.reports, oldCriteria.reports);
  const searchDifferent = areObjectsDifferent(newCriteria.search, oldCriteria.search);

  // Return true if any of the objects are different; otherwise, return false
  return filtersDifferent || reportsDifferent || searchDifferent;
}