/**
 * Renders the back button text based on the current search criteria.
 * @param {Object} translations - The translations object containing text for buttons.
 * @param {Object} data - The data object containing search criteria.
 * @returns {string} - The text to be displayed on the back button.
 */
export function renderBackButton(translations, data) {
  console.log('OrderTrackingDetailHeader::Utils::renderBackButton');

  // Determine if any search criteria are active
  const isSearchActive = data?.criteria?.freetextSearch || data?.criteria?.freetextSearchKey;
  const areFiltersActive = data?.criteria?.type || data?.criteria?.status;
  const areReportsActive = data?.criteria?.reportName;

  // Return appropriate back button text based on the active criteria
  // If any of the criteria are active, show 'Back to Search Results'
  // Otherwise, show 'Back to All orders'
  return isSearchActive || areFiltersActive || areReportsActive
    ? translations?.Button_BackToSearchResults || 'Search Results'
    : translations?.Button_BackToAll || 'All orders';
};

/**
 * Creates a back URL with the appropriate search parameters based on the provided data.
 * @param {string} saleslogin - Sales login value.
 * @param {string} queryCacheKey - Query cache key.
 * @param {Object} data - The data object containing the criteria for the URL parameters.
 * @returns {string} - The constructed back URL as a string.
 */
export function createBackUrl(saleslogin, queryCacheKey, data) {
  console.log('OrderTrackingDetailHeader::Utils::createBackUrl');

  // Create a new URL based on the current location, changing the path to end with '.html'
  const url = new URL(location.href.substring(0, location.href.lastIndexOf('/')) + '.html');

  // If a saleslogin parameter exists, set it in the URL
  if (saleslogin) url.searchParams.set('saleslogin', saleslogin);

  // If criteria exist in the data object, set the corresponding URL parameters
  if (data?.criteria) {
    url.searchParams.set('sortby', data.criteria.sortBy.toLowerCase());
    url.searchParams.set('sortdirection', data.criteria.sortAscending ? 'asc' : 'desc');
    url.searchParams.set('page', data.criteria.pageNumber);
    url.searchParams.set('q', queryCacheKey);

    if (data.criteria?.createdFrom && data.criteria?.createdTo) {
      url.searchParams.set('datetype', 'orderDate');
      url.searchParams.set('datefrom', data.criteria?.createdFrom);
      url.searchParams.set('dateto', data.criteria?.createdTo);
    }

    if (data.criteria?.shippedDateFrom && data.criteria?.shippedDateTo) {
      url.searchParams.set('datetype', 'shipDate');
      url.searchParams.set('datefrom', data.criteria?.shippedDateFrom);
      url.searchParams.set('dateto', data.criteria?.shippedDateTo);
    }

    if (data.criteria?.invoiceDateFrom && data.criteria?.invoiceDateTo) {
      url.searchParams.set('datetype', 'invoiceDate');
      url.searchParams.set('datefrom', data.criteria?.invoiceDateFrom);
      url.searchParams.set('dateto', data.criteria?.invoiceDateTo);
    }

    if (data.criteria?.etaDateFrom && data.criteria?.etaDateTo) {
      url.searchParams.set('datetype', 'etaDate');
      url.searchParams.set('datefrom', data.criteria?.etaDateFrom);
      url.searchParams.set('dateto', data.criteria?.etaDateTo);
    }

    if (data.criteria?.type) {
      data.criteria.type.forEach(type => {
        url.searchParams.append('type', type);
      });
    }

    if (data.criteria?.status) {
      data.criteria.status.forEach(status => {
        url.searchParams.append('status', status);
      });
    }

    if (data.criteria?.freetextSearch) {
      url.searchParams.append('value', data.criteria.freetextSearch);
    }

    if (data.criteria?.freetextSearchKey) {
      url.searchParams.append('field', data.criteria.freetextSearchKey);
    }

    if (data.criteria?.gtmfield) {
      url.searchParams.append('gtmfield', data.criteria.gtmfield);
    }

    if (data.criteria?.reportName) {
      url.searchParams.append('report', data.criteria.reportName);
    }
  }

  // Return the constructed URL as a string
  return url.toString();
};

/**
 * Updates the URL with the new ID and optionally replaces the browser history entry.
 * @param {string} id - The new ID to set in the URL.
 * @param {boolean} replaceState - If true, replace the current history state; otherwise, push a new state.
 */
export function updateUrl(id, replaceState) {
  console.log('OrdersTrackingDetail::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Update the URL with the new ID
  const url = new URL(window.location.href);
  url.searchParams.set('id', id);

  // If the URL has changed, update the browser history
  if (url.toString() !== currentUrl.toString()) {
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
 * Generates the main dashboard URL with the given order ID.
 * @param {string} orderId - The ID of the order.
 * @returns {string} - The updated URL pointing to the main dashboard.
 */
export function mainDashboardUrl(orderId) {
  // Create a new URL object based on the current page URL
  let currentUrl = new URL(window.location.href);

  // Clear the search parameters from the current URL
  currentUrl.search = '';

  // Replace the pathname '/order-details.html' with '.html'
  currentUrl.pathname = currentUrl.pathname.replace('/order-details.html', '.html');

  // Set the new search parameter with the given order ID
  if (orderId)
    currentUrl.search = `?id=${orderId}`;

  // Return the updated URL as a string
  return currentUrl.href;
}