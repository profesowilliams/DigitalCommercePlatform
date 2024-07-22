import { removeDisallowedParams, removeSpecificParams } from '../../../../../../utils/index';
import { compareURLs } from '../../../OrdersTrackingCommon/Utils/utils';

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

  if (isSearchFilterNotEmpty(filter)) {
    // List of allowed parameters
    const allowedParameters = ['status', 'type', 'datetype', 'datefrom', 'dateto', 'sortby', 'sortdirection', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
    url.searchParams.set('field', filter.field);
    url.searchParams.set('gtmfield', filter.gtmField);
    url.searchParams.set('value', filter.value);

    // Reset page to 1 if any of the filter parameters (field, gtmfield, value) does not match the current URL
    if (currentUrl.searchParams.get('field') !== filter.field
      || currentUrl.searchParams.get('gtmfield') !== filter.gtmField
      || currentUrl.searchParams.get('value') !== filter.value) {
      console.log('Search::updateUrl::reset page');
      url.searchParams.set('page', '1');
      url.searchParams.delete('q');
    }
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['field', 'gtmfield', 'value'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(new URL(window.location.href), parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (!compareURLs(url, currentUrl))
    window.history.pushState(null, '', url.toString());
  // history.push(url.href.replace(url.origin, ''));
};

/**
* Checks if the search filter object is not empty.
* 
* @param {Object} filter - The search filter object to check.
* @returns {boolean} - Returns true if the search filter is not empty, otherwise false.
*/
export function isSearchFilterNotEmpty(filter) {
  // Return false if the filter is null or undefined
  if (!filter) return false;

  // Check if any relevant properties of the search filter object are non-empty
  return filter.key
    || filter.field
    || filter.value
    || filter.gtmField ? true : false;
}