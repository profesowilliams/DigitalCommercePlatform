import React from 'react';
import { startOfWeek, addDays, startOfMonth, startOfYear, isSameDay } from 'date-fns';

/**
 * Generates custom date ranges based on the provided translations.
 *
 * @param {Object} translations - The translations object containing localized strings for date range labels.
 * @returns {Array} - An array of custom date ranges with translated labels and date range calculations.
 */
export const getCustomRanges = (translations) => {
  return [
    {
      label: translations?.PredefinedRanges_ThisWeek || 'This Week',
      key: 'ThisWeek',
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
      label: translations?.PredefinedRanges_Last7Days || 'Last 7 days',
      key: 'Last7Days',
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
      label: translations?.PredefinedRanges_ThisMonth || 'This Month',
      key: 'ThisMonth',
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
      label: translations?.PredefinedRanges_Last30Days || 'Last 30 days',
      key: 'Last30Days',
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
      label: translations?.PredefinedRanges_ThisYear || 'This year',
      key: 'ThisYear',
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
    }
  ];
};

/**
 * Generates filter date options based on the provided translations.
 *
 * @param {Object} translations - The translations object containing localized strings.
 * @returns {Array} - An array of filter date options with translated labels.
 */
export const getFilterDateOptions = (translations) => {
  return [
    {
      key: 'orderDate',
      label: (
        <span className="filter-dateType">
          {translations?.OrderDate || 'Order date'}
        </span>
      )
    },
    {
      key: 'shipDate',
      label: (
        <div>
          <span className="filter-dateType">
            {translations?.ShipDate || 'Ship date'}{' '}
          </span>
          <span className="filter-dateType-description">
            {translations?.PastDateRange || 'Past Date Range'}
          </span>
        </div>
      )
    },
    {
      key: 'etaDate',
      label: (
        <div>
          <span className="filter-dateType">
            {translations?.ETADate || 'ETA Date'}{' '}
          </span>
          <span className="filter-dateType-description">
            {translations?.FutureDateRange || 'Future Date Range'}
          </span>
        </div>
      )
    },
    {
      key: 'invoiceDate',
      label: (
        <span className="filter-dateType">
          {translations?.InvoiceDate || 'Invoice date'}
        </span>
      )
    },
  ];
};