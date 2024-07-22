import { removeDisallowedParams, removeSpecificParams } from '../../../../../../utils/index';
import { compareURLs } from '../../../OrdersTrackingCommon/Utils/utils';

/**
 * Updates the URL based on the selected report
 * @param {Object} report - The selected report
 */
export function updateUrl(report) {
  console.log('Report::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url;

  // If an report is selected
  if (isReportFilterNotEmpty(report)) {
    // List of allowed parameters
    const allowedParameters = ['page', 'sortby', 'sortdirection', 'q', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
    url.searchParams.set('report', report.key);

    // Reset page to 1 if the existing report key value does not match the new report key
    if (currentUrl.searchParams.get('report') !== report.key) {
      console.log('Report::updateUrl::reset page');
      url.searchParams.set('page', '1');
      url.searchParams.delete('q');
    } 
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['report'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(currentUrl, parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (!compareURLs(url, currentUrl))
    window.history.pushState(null, '', url.toString());
};

/**
* Checks if the report filter object is not empty.
* 
* @param {Object} filter - The report filter object to check.
* @returns {boolean} - Returns true if the report filter is not empty, otherwise false.
*/
export function isReportFilterNotEmpty(filter) {
  // Return false if the filter is null or undefined
  if (!filter) return false;

  // Check if any relevant properties of the filter object are non-empty
  return filter.key
    || filter.value;
}