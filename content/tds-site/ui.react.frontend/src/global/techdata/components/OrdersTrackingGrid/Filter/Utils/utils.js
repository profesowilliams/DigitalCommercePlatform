import { removeSpecificParams } from '../../../../../../utils/index';
import { removeDisallowedParams } from '../../../../../../utils/index';
import { addDays, endOfDay, startOfDay, startOfYear, startOfMonth, endOfMonth, endOfYear, addMonths, addYears, startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays, } from 'date-fns';
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
      filters.types.forEach(type => {
        url.searchParams.append('type', type);
      });
    }

    if (filter?.statuses && filter?.statuses?.length > 0) {
      filters.statuses.forEach(status => {
        url.searchParams.append('status', status);
      });
    }

    if (currentUrl.searchParams.get('datetype') !== filter.date.type
      || currentUrl.searchParams.get('datefrom') !== filter.date.from
      || currentUrl.searchParams.get('dateto') !== filter.date.to
      || !arraysEqual(currentUrl.searchParams.getAll('type'), filter.types)
      || !arraysEqual(currentUrl.searchParams.getAll('status'), filter.statuses)) {
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
  // history.push(url.href.replace(url.origin, ''));
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

  return isDateFilter || isTypeFilter || isStatusFilter;
}

export const customRanges = [
  {
    label: 'This Week',
    range: () => ({
      startDate: startOfWeek(new Date()),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
  {
    label: 'Last 7 days',
    range: () => ({
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
  {
    label: 'This Month',
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
  {
    label: 'Last 30 days',
    range: () => ({
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
  {
    label: 'This year',
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
  {
    label: 'Today',
    range: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  },
];