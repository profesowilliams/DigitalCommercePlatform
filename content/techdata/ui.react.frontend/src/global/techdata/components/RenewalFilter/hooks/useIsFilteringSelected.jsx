import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { getLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants"

export default function useFilteringSelected(){
    const customStartDate = useRenewalGridState((state) => state.customStartDate);
    const filterList = useRenewalGridState((state) => state.filterList);
    const customEndDate = useRenewalGridState((state) => state.customEndDate);
    const dateSelected = useRenewalGridState((state) => state.dateSelected);    
 
    const isDateSelectedOrApplied = () => {
      const isRangeDateSelected = (customStartDate !== null && customEndDate !== null);        
      const hasDateApplied = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected !== null;
      const hasDateSelected = dateSelected === 'custom' ? isRangeDateSelected : !!dateSelected;
      return hasDateSelected || hasDateApplied;
    }    

    const hasAnyFilterApplied = () => {
      const noChildIds = filterList.filter(filter => !filter.childIds.length);        
      return noChildIds.some((filter) => filter.checked || filter.applied) || isDateSelectedOrApplied();
    }

/**
 * Checks if there is a change in the date filter that needs to be applied.
 *
 * @returns {boolean|null} - Returns true if a date change needs to be applied, false if custom dates are selected without valid range, and null if no change is needed.
 */
const hasDateFilterChangeAvailable = () => {
    // Retrieve local filters from local storage
    const localFilters = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY);
    const { dateSelected: hasLocalDateApplied, customStartDate: localStartDate, customEndDate: localEndDate } = localFilters || {};

    // Check if the custom date is selected
    const hasCustomSelected = dateSelected === 'custom';

    // Check if a valid custom date range is provided
    const hasValidCustomRange = hasCustomSelected && !!(customStartDate && customEndDate);

    // Early return if custom date is selected but no start and end dates are provided
    if (hasCustomSelected && !(customStartDate && customEndDate)) {
        return false;
    }

    // Return true if no date is selected but a local date is applied
    if (dateSelected === null && hasLocalDateApplied) {
      return true;
    }

    // Early return if the date selected is the same as the local date applied or if dateSelected is null
    if (dateSelected === hasLocalDateApplied || dateSelected === null) {
        return null;
    }

    // Initialize the variable to check if a date change needs to be applied
    let hasDateChangeToApply = false;

    // Check if the date selected is different from the local date applied
    if (dateSelected && hasLocalDateApplied !== dateSelected) {
        hasDateChangeToApply = true;
    } else if (hasLocalDateApplied && !dateSelected) {
        hasDateChangeToApply = true;
    } else if (hasCustomSelected) {
        // Check if custom date range is different from the local date range
        if (customStartDate !== localStartDate || customEndDate !== localEndDate) {
            hasDateChangeToApply = true;
        }
        // Ensure the custom date range is valid
        if (!hasValidCustomRange) {
            hasDateChangeToApply = false;
        }
    }

    return hasDateChangeToApply;
};

    /**
     * Checks if there is any change available in the filter list or date filter.
     *
     * @returns {boolean} True if there is a change in the filter list and the date filter is null/undefined,
     *                    or if there is a change in either the filter list or the date filter. False otherwise.
     */
    const hasFilterChangeAvailable = () => {
      // Filter out the filters that do not have childIds
      const noChildIds = filterList.filter(filter => !filter.childIds.length);

      /**
       * Check if any of the filters without childIds have a change in their checked or applied status
       *
       * @type {boolean}
       */
      const hasFilterListChange = noChildIds.some((filter) => 
        (filter.checked && !filter.applied) || (!filter.checked && filter.applied)
      );

      /**
       * Determine if there is a change in the date filter
       *
       * @returns {boolean|null|undefined} - The change status of the date filter
       */
      const dateFilterChangeAvailable = hasDateFilterChangeAvailable();

      // Return true if there is a change in filter list and date filter is null or undefined
      if (hasFilterListChange && (dateFilterChangeAvailable === null || dateFilterChangeAvailable === undefined)) {
        return true;
      }

      // Return true if there is no change in filter list but there is a change in date filter
      if (!hasFilterListChange && dateFilterChangeAvailable) {
        return true;
      }

      // Return true if there is a change in both filter list and date filter
      if (hasFilterListChange && dateFilterChangeAvailable) {
        return true;
      }

      // Return false if there is no change in both filter list and date filter
      if (!hasFilterListChange && !dateFilterChangeAvailable) {
        return false;
      }

      // Return false if there is a change in filter list but no change in date filter
      if (hasFilterListChange && !dateFilterChangeAvailable) {
        return false;
      }

      // Default return false if none of the above conditions are met
      return false;
    }

  return { hasAnyFilterApplied, hasFilterChangeAvailable, filterList, dateSelected }
}

