import { removeSpecificParams } from '../../../../../../utils/index';
import { removeDisallowedParams } from '../../../../../../utils/index';
import { arraysEqual, compareURLs } from '../../../OrdersTrackingCommon/Utils/utils';

export function updateUrl(filter) {
  console.log('OrderFilter::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url;

  // Check if any filters are applied
  if (isFilterNotEmpty(filter)) {
    // List of allowed parameters
    const allowedParameters = ['field', 'gtmfield', 'value', 'sortby', 'sortdirection', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);

    if (filter.date?.from && filter.date?.to && filter.date?.type) {
      url.searchParams.set('datetype', filter.date.type);
      url.searchParams.set('datefrom', filter.date.from);
      url.searchParams.set('dateto', filter.date.to);
    }

    if (filter?.types && filter?.types?.length > 0) {
      filter.types.forEach(type => {
        url.searchParams.append('type', type);
      });
    }

    if (filter?.statuses && filter?.statuses?.length > 0) {
      filter.statuses.forEach(status => {
        url.searchParams.append('status', status);
      });
    }

    if (currentUrl.searchParams.get('datetype') !== filter.date?.type
      || currentUrl.searchParams.get('datefrom') !== filter.date?.from
      || currentUrl.searchParams.get('dateto') !== filter.date?.to
      || !arraysEqual(currentUrl.searchParams.getAll('type'), filter?.types)
      || !arraysEqual(currentUrl.searchParams.getAll('status'), filter?.statuses)) {
      console.log('OrderFilter::updateUrl::reset page');
      url.searchParams.set('page', '1');
      url.searchParams.delete('q');
    }
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['datetype', 'datefrom', 'dateto', 'status', 'type'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(currentUrl, parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (!compareURLs(url, currentUrl))
    window.history.pushState(null, '', url.toString());
};

/**
 * Checks if the filter object is not empty.
 * 
 * @param {Object} filter - The filter object to check.
 * @returns {boolean} - Returns true if the filter is not empty, otherwise false.
 */
export function isFilterNotEmpty(filter) {
  // Return false if the filter is null or undefined
  if (!filter) return false;

  // Check if date filter is applied
  const isDateFilter = filter.date?.from && filter.date?.to && filter.date?.type;

  // Check if type filter is applied
  const isTypeFilter = filter?.types && filter?.types?.length > 0;

  // Check if status filter is applied
  const isStatusFilter = filter?.statuses && filter?.statuses?.length > 0;

  // Check if reset filter it applied
  const isReset = filter.resetFilters;

  return isReset || isDateFilter || isTypeFilter || isStatusFilter ? true : false;
}

/**
 * Validates if a filter change model is valid.
 * 
 * @summary This function checks if the provided filter change model has valid date
 *          information (type, from, and to), or non-empty types or statuses arrays.
 * 
 * @param {Object} filter - The filter change model object with properties for date, types, and statuses.
 * @returns {boolean} - Returns true if the filter change model is valid, otherwise false.
 */
export function isFilterChangeModelIsValid(filter) {
  // Check if the filter object is provided
  if (!filter) return false;

  // Validate the filter by checking the date fields or if types or statuses arrays are non-empty
  return filter.resetFilters
    || (filter.date?.type && filter.date?.from && filter.date?.to)
    || (filter.types?.length > 0)
    || (filter.statuses?.length > 0) ? true : false;
}

function dateFilterIsCorrect(date) {
  return date && date.type && date.from && date.to ? true : false;
}

/**
 * Compares two filter objects to determine if they are equal.
 *
 * @param {Object} appliedFilter - The first filter object to compare.
 * @param {Object} newFilter - The second filter object to compare.
 * @returns {boolean} - Returns true if the filters are equal, otherwise false.
 */
export function compareFilters(appliedFilter, newFilter) {
  // Check if both filters are provided
  if (!appliedFilter || !newFilter) return false;

  // Compare date properties
  const datesEqual =
    !dateFilterIsCorrect(appliedFilter.date) && !dateFilterIsCorrect(newFilter.date)
    ||
    dateFilterIsCorrect(appliedFilter.date) && dateFilterIsCorrect(newFilter.date) &&
    (
      appliedFilter.date.type === newFilter.date.type &&
      appliedFilter.date.from === newFilter.date.from &&
      appliedFilter.date.to === newFilter.date.to
    );

  // Compare statuses and types arrays
  const statusesEqual = appliedFilter.statuses && newFilter.statuses && arraysEqual(appliedFilter.statuses, newFilter.statuses);
  const typesEqual = appliedFilter.types && newFilter.types && arraysEqual(appliedFilter.types, newFilter.types);

  // Return true if all parts of the filters are equal
  return datesEqual && statusesEqual && typesEqual;
}