import { removeDisallowedParams, removeSpecificParams } from '../../../../../../utils/index';

/**
 * Updates the URL based on the selected filter
 * @param {Object} filter - The selected filter
 */
export function updateUrl(filter) {
  console.log('Search::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url;

  if (filter) {
    // List of allowed parameters
    const allowedParameters = ['status', 'type', 'datetype', 'datefrom', 'dateto', 'sortby', 'sortdirection', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
    url.searchParams.set('field', filter.field);
    url.searchParams.set('gtmfield', filter.gtmField);
    url.searchParams.set('value', filter.value);
    url.searchParams.set('page', '1');
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['field', 'gtmfield', 'value'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(new URL(window.location.href), parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (url.toString() !== currentUrl.toString())
    window.history.pushState(null, '', url.toString());
  // history.push(url.href.replace(url.origin, ''));
};