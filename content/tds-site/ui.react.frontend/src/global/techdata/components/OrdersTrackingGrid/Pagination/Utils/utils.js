export function updateUrl(pagination) {
  console.log('OrderTrackingGridPagination::Utils::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url = new URL(window.location.href);

  if (pagination) {
    url.searchParams.set('page', pagination.pageNumber);
  }

  // If the URL has changed, update the browser history
  if (url.toString() !== currentUrl.toString())
    window.history.pushState(null, '', url.toString());
};