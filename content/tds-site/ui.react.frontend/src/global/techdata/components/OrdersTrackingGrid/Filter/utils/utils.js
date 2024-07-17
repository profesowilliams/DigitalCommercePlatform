import { removeSpecificParams } from '../../../../../../utils/index';
import { removeDisallowedParams } from '../../../../../../utils/index';
import { addDays, endOfDay, startOfDay, startOfYear, startOfMonth, endOfMonth, endOfYear, addMonths, addYears, startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays, } from 'date-fns';

export function updateUrl(filters) {
  console.log('OrderFilter::updateUrl');

  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Declare a variable to hold the updated URL
  let url;

  if (filters) {
    // List of allowed parameters
    const allowedParameters = ['field', 'gtmfield', 'value', 'sortby', 'sortdirection', 'saleslogin'];

    // Remove disallowed parameters from the current URL, keeping only specified ones
    url = removeDisallowedParams(new URL(window.location.href), allowedParameters);

    if (filters.date?.from && filters.date?.to && filters.date?.type) {
      url.searchParams.set('datetype', filters.date.type);
      url.searchParams.set('datefrom', filters.date.from);
      url.searchParams.set('dateto', filters.date.to);
    }

    if (filters.types) {
      filters.types.forEach(type => {
        url.searchParams.append('type', type);
      });
    }

    if (filters.statuses) {
      filters.statuses.forEach(status => {
        url.searchParams.append('status', status);
      });
    }

    url.searchParams.append('page', '1');
  } else {
    // List of parameters which should be removed
    const parametersToRemove = ['datetype', 'datefrom', 'dateto', 'status', 'type'];

    // Remove specific parameters from the URL
    url = removeSpecificParams(currentUrl, parametersToRemove);
  }

  // If the URL has changed, update the browser history
  if (url.toString() !== currentUrl.toString())
    window.history.pushState(null, '', url.toString());
  // history.push(url.href.replace(url.origin, ''));
};

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
    label: 'Previous Week',
    range: () => ({
      startDate: startOfWeek(addDays(new Date(), -7)),
      endDate: endOfWeek(addDays(new Date(), -7)),
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
    label: 'Current Month',
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
    label: 'Previous Month',
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -1)),
      endDate: endOfMonth(addMonths(new Date(), -1)),
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
    label: 'Prev 6 Months',
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -6)),
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
];