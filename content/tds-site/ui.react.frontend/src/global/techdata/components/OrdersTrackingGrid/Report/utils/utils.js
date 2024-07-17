import { removeDisallowedParams, removeSpecificParams } from '../../../../../../utils/index';

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
  if (report) {
    // List of allowed parameters
    const allowedParameters = ['sortby', 'sortdirection', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
    url.searchParams.set('report', report.key);
    url.searchParams.set('page', '1');
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['report'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(currentUrl, parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (url.toString() !== currentUrl.toString())
    window.history.pushState(null, '', url.toString());
};